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
const newNodes$ = new Subject();

async function init({ url, userId, reviewId, limit, sortBy }) {
  console.log("Initializing...");
  const browser = await launchBrowser();
  const page = await openPage(browser, url);
  page.exposeFunction("newNodes", function (record) {
    newNodes$.next(record);
  });
  console.log(`Scraping reviews for ${url}...`);

  const title = await waitTitle(page);
  console.log("Title:", title);

  let count = 0;
  let isWait = false;

  newNodes$
    .pipe(
      concatMap((record) =>
        defer(async () => {
          // Wait for `isWait` to become false
          while (isWait) {
            await new Promise((resolve) => setTimeout(resolve, 100)); // Check every 100ms
          }
          return record;
        }).pipe(
          concatMap((record) =>
            interval(2000).pipe(
              take(1),
              map(() => record)
            )
          )
        )
      )
    )
    .subscribe(async (record) => {
      isWait = true;

      console.log(`Checked ${count} reviews`);
      await highLightElement(page, record);

      const url = await copyReviewURL(page, record);
      console.log("URL:", url);

      if (url) {
        const npage = await browser.newPage();
        await npage.goto(url, {
          waitUntil: "networkidle2",
          timeout: 60000,
        });

        // await handleElementActions(npage, record);
        // await new Promise((resolve) => setTimeoutresolve, 500));
        const reviewComment = await elementReviewComment(npage, record);
        console.log("Review Comment:", reviewComment);
        const reviewQA = await elementReviewQA(npage, record);
        console.log("Review QA:", reviewQA);

        await new Promise((resolve) => setTimeout(resolve, 3000));
        await npage.close();
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      isWait = false;
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
  userId: "MHKWy9QpFjfijMlKxeimUyOPYLt1",
  limit: 50000,
  sortBy: "Newest",
  iat: 1731987534,
  exp: 1732030734,
});
