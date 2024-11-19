const { launchBrowser, openPage } = require("./services/browser");
const {
  waitTitle,
  openReviewTab,
  getInitialReviews,
  watchNewReviews,
  highLightElement,
  sortReviews,
} = require("./services/page");
const { Subject, concatMap, interval, take, map } = require("rxjs");
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
  newNodes$
    .pipe(
      concatMap((record) =>
        interval(100).pipe(
          take(1),
          map(() => record)
        )
      )
    )
    .subscribe(async (record) => {
      console.log(`Checked ${count} reviews`);
      highLightElement(page, record);
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
  iat: 1731930035,
  exp: 1731973235,
});
