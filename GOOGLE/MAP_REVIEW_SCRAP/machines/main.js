const puppeteer = require("puppeteer");
const { setTimeout } = require("timers/promises");
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
  const browser = await launchBrowser();
  const page = await openPage(browser, url);
  page.exposeFunction("newNodes", function (record) {
    newNodes$.next(record);
  });

  const title = await waitTitle(page);
  console.log("Title:", title);

  let count = 0;
  newNodes$
    .pipe(
      concatMap((record) =>
        interval(1000).pipe(
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

  await openReviewTab(page);
  await sortReviews(page, sortBy);

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
