require("dotenv").config({
  path: require("path").resolve(__dirname, ".env.main"),
});
const { exec } = require("child_process");
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
  scrollToBottom,
} = require("./services/page");
const { Subject, concatMap, interval, take, map, defer } = require("rxjs");
const { firestore, batchWriteLargeArray } = require("./services/firebase");
const { uploadFile } = require("./services/storage");
const newNodes$ = new Subject();
const allElements = [];
let lastRecordTime = new Date();
const url = process.env.URL;
const userId = process.env.USER_ID;
const reviewId = process.env.REVIEW_ID;
const limit = process.env.LIMIT;
const sortBy = process.env.SORT_BY;

let browser;

async function complete() {
  const jsonFile = JSON.stringify(allElements, null, 2);
  const csvFile =
    Object.keys(allElements[0]).join(",") +
    "\n" +
    allElements.map((element) => Object.values(element).join(",")).join("\n");

  const csvUrl = await uploadFile(jsonFile, `json/${reviewId}.json`);
  const jsonUrl = await uploadFile(csvFile, `csv/${reviewId}.csv`);

  console.log(`CSV URL: ${csvUrl}`);
  console.log(`JSON URL: ${jsonUrl}`);

  await batchWriteLargeArray(userId, reviewId, allElements);

  console.log("Uploading to Firestore...");

  try {
    await firestore.collection(`users/${userId}/reviews`).doc(reviewId).update({
      updatedAt: new Date(),
      completedAt: new Date(),
      status: "completed",
      csvUrl,
      jsonUrl,
      totalReviews: allElements.length,
    });
  } catch (error) {
    console.log("Error:", error);
  }
  console.log("Completed...");
  console.log(`CSV URL: ${csvUrl}`);
  console.log(`JSON URL: ${jsonUrl}`);

  if (browser) {
    await browser.close();
  }
}

async function init() {
  console.log("Initializing...");
  browser = await launchBrowser();
  const page = await openPage(browser, url);
  page.exposeFunction("newNodes", function (record) {
    newNodes$.next(record);
  });
  console.log(`Scraping reviews for ${url}...`);

  const title = await waitTitle(page);
  console.log("Title:", title);

  await firestore.collection(`users/${userId}/reviews`).doc(reviewId).update({
    title,
    updatedAt: new Date(),
  });

  let count = 0;
  let isFirstTime = true;

  const intervalRecordTime = setInterval(async () => {
    if (new Date() - lastRecordTime > 25000) {
      if (isFirstTime) {
        console.log("Scrolling to bottom...");
        isFirstTime = false;
        await scrollToBottom(page);
        lastRecordTime = new Date();
      } else {
        console.log("No new reviews...");
        clearInterval(intervalRecordTime);
        count = limit;
        console.log("Limit reached...");
        newNodes$.next("end");
      }
    }
  }, 1000);

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
      lastRecordTime = new Date();
      isFirstTime = true;
      if (limit && count >= limit) {
        console.log("Limit reached...");
        // if (intervalRecordTime) {
        //   clearInterval(intervalRecordTime);
        // }
        await complete();
        // await browser.close();
        subscription.unsubscribe();
        console.log("Unsubscribed...");
        // exec(`docker stop ${process.env.HOSTNAME}`);
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

      if (count % 10 === 0) {
        await firestore
          .collection(`users/${userId}/reviews`)
          .doc(reviewId)
          .update({
            updatedAt: new Date(),
            totalReviews: count,
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

try {
  init();
} catch (error) {
  complete();
  console.log("Error:", error);
}
