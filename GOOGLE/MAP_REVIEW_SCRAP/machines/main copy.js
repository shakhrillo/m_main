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
} = require("./services/page");
const { Subject, concatMap, interval, take, map, defer } = require("rxjs");
const { firestore } = require("./services/firebase");
const newNodes$ = new Subject();

async function init({ url, userId, reviewId, limit, sortBy }) {
  console.log("Setting up...");
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

  newNodes$
    .pipe(
      concatMap((record) =>
        interval(2000).pipe(
          take(1),
          map(() => record)
        )
      )
    )
    .subscribe(async (record) => {
      console.log(`Checked ${count} reviews`);
      await highLightElement(page, record);
      await handleElementActions(page, record);
      // await new Promise((resolve) => setTimeout(resolve, 500));
      const reviewComment = await elementReviewComment(page, record);
      console.log("Review Comment:", reviewComment);
      const reviewQA = await elementReviewQA(page, record);
      console.log("Review QA:", reviewQA);

      if (
        reviewComment.includes("More") ||
        reviewQA.find((qa) => qa.includes("More"))
      ) {
        console.error("More...");
        await new Promise((resolve) => setTimeout(resolve, 50000));
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

  // await page.close();
  // await browser.close();
}

init({
  url: "https://maps.app.goo.gl/mccerYhUvrcA8tdCA",
  reviewId: "xJuwdTi7mbb5lPWbj5sF",
  userId: "83gDir7H21dnNXyk06BvGHN13v72",
  limit: 50000,
  sortBy: "Newest",
  iat: 1732062432,
  exp: 1732105632,
});
