const fs = require("fs");
const { launchBrowser, openPage } = require("./services/browser");
const {
  waitTitle,
  openReviewTab,
  getInitialReviews,
  watchNewReviews,
  highLightElement,
  sortReviews,
  handleElementActions,
  elementReviewComment,
  elementReviewQA,
  copyReviewURL,
  getReviewDate,
  getReviewRate,
  getOwnerResponse,
  getImgURLs,
  getUserDetails,
} = require("./services/page");
const { Subject, concatMap, interval, take, map, defer } = require("rxjs");
const { firestore, batchWriteLargeArray } = require("./services/firebase");
const { uploadFile } = require("./services/storage");
const newNodes$ = new Subject();

async function init() {
  const url = process.env.URL;
  const userId = process.env.USER_ID;
  const reviewId = process.env.REVIEW_ID;
  const limit = process.env.LIMIT;
  const sortBy = process.env.SORT_BY;
  const allElements = [];

  await firestore.collection(`users/${userId}/reviews`).doc(reviewId).set(
    {
      url,
      userId,
      reviewId,
      limit,
      sortBy,
      createdAt: new Date(),
    },
    { merge: true }
  );

  console.log("Initializing...");
  const browser = await launchBrowser();
  const page = await openPage(browser, url);
  page.exposeFunction("newNodes", function (record) {
    newNodes$.next(record);
  });
  console.log(`Scraping reviews for ${url}...`);

  const title = await waitTitle(page);
  console.log("Title:", title);

  await firestore.collection(`users/${userId}/reviews`).doc(reviewId).set(
    {
      title,
      updatedAt: new Date(),
    },
    { merge: true }
  );

  let count = 0;

  const subscription = newNodes$
    .pipe(
      concatMap((record) =>
        interval(2000).pipe(
          take(1),
          map(() => record)
        )
      )
    )
    .subscribe(async (record) => {
      if (limit && count >= limit) {
        console.log("Limit reached...");
        const jsonFile = JSON.stringify(allElements, null, 2);
        const csvFile =
          Object.keys(allElements[0]).join(",") +
          "\n" +
          allElements
            .map((element) => Object.values(element).join(","))
            .join("\n");

        const csvUrl = await uploadFile(jsonFile, `json/${reviewId}.json`);
        const jsonUrl = await uploadFile(csvFile, `csv/${reviewId}.csv`);

        await batchWriteLargeArray(userId, reviewId, allElements);
        await firestore.collection(`users/${userId}/reviews`).doc(reviewId).set(
          {
            updatedAt: new Date(),
            completedAt: new Date(),
            status: "completed",
            csvUrl,
            jsonUrl,
            totalReviews: allElements.length,
          },
          { merge: true }
        );
        console.log("Completed...");
        console.log(`CSV URL: ${csvUrl}`);
        console.log(`JSON URL: ${jsonUrl}`);
        await browser.close();
        subscription.unsubscribe();
      } else {
        console.log(`Checked ${count} reviews`);
        await highLightElement(page, record);
        await handleElementActions(page, record);

        const user = await getUserDetails(page, record);
        console.log("User:", user);
        const timeComment = await getReviewDate(page, record);
        console.log("Time Comment:", timeComment);
        const rateComment = await getReviewRate(page, record);
        console.log("rateComment", rateComment);
        const reviewComment = await elementReviewComment(page, record);
        console.log("Review Comment:", reviewComment);
        const reviewQA = await elementReviewQA(page, record);
        console.log("Review QA:", reviewQA);
        const ownerResponse = await getOwnerResponse(page, record);
        console.log("Owner Response:", ownerResponse);
        const imgURLs = await getImgURLs(page, record);
        console.log("Img URLs:", imgURLs);

        allElements.push({
          id: record,
          review: reviewComment,
          date: timeComment,
          response: ownerResponse,
          responseTime: "",
          imageUrls: imgURLs,
          rating: rateComment,
          qa: reviewQA,
          user: user,
        });
      }

      count++;
    });

  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log("Opening review tab...");
  await openReviewTab(page);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log("Sorting reviews...");
  await sortReviews(page, sortBy);

  console.log("Getting initial reviews...");
  const initialReviews = await getInitialReviews(page);
  initialReviews.forEach((review) => newNodes$.next(review));

  watchNewReviews(page);
}

init();
