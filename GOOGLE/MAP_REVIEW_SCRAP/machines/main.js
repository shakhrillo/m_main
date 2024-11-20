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

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function hideElements(page, selectors) {
  for (const selector of selectors) {
    const elements = await page.$$(selector);
    if (elements.length > 0) {
      await page.evaluate(
        (el) => (el.parentElement.style.display = "none"),
        elements[0]
      );
    }
    await wait(500);
  }
}

async function extractAriaLabel(page, selector) {
  const elements = await page.$$(selector);
  if (elements.length > 0) {
    return elements[0].evaluate((el) => el.getAttribute("aria-label"));
  }
  return null;
}

const { uploadFile } = require("./services/storage");

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
      pending: true,
    },
    { merge: true }
  );
  console.log("Initializing...");
  const browser = await launchBrowser();
  const page = await openPage(browser, url);
  const data = {};
  data.title = await page.title();
  const sidePanel = await page.$$(
    `button[aria-label*="Collapse side panel"][jsaction*="mouseover:drawer.showToggleTooltip"]`
  );
  for (const btn of sidePanel) {
    await btn.scrollIntoView();
    await btn.click();
    console.info("Side panel collapsed");
  }
  await page.waitForSelector(`button[jsaction*="zoom.onZoomOutClick"]`, {
    visible: true,
  });

  const zoomOutButton = await page.$$(
    `button[jsaction*="zoom.onZoomOutClick"]`
  );
  for (const btn of zoomOutButton) {
    for (let i = 0; i < 2; i++) {
      await btn.click();
      await wait(500);
      console.info("Zoomed out");
    }
  }

  await hideElements(page, [
    `button[jsaction*="minimap.main"]`,
    `.app-vertical-widget-holder`,
    `a[aria-label="Sign in"]`,
    `.app-horizontal-widget-holder`,
    `a[title="Google apps"]`,
    `button[aria-label*="Expand side panel"]`,
    `.scene-footer`,
  ]);

  const screenshot = await page.screenshot({ fullPage: true });
  const uniqueId = url.split("/").pop();
  data.screenshot = await uploadFile(
    screenshot,
    `${userId}/${uniqueId}/screenshot.png`
  );

  data.address = await extractAriaLabel(
    page,
    `button[data-item-id*="address"]`
  );
  data.phone = await extractAriaLabel(page, `[data-item-id*="phone"]`);
  data.website = await extractAriaLabel(page, `[data-item-id*="authority"]`);
  data.rating = await extractAriaLabel(
    page,
    `[role="img"][aria-label*="stars"]`
  );
  data.reviews = await extractAriaLabel(
    page,
    `button[jsaction*="moreReviews"]`
  );
  console.log("Data:", data);
  await page.close();
  await browser.close();
  await firestore
    .collection(`users/${userId}/reviews`)
    .doc(reviewId)
    .set(
      {
        ...data,
        pending: false,
      },
      { merge: true }
    );
  console.log("Done");
  // close docker container

  // page.exposeFunction("newNodes", function (record) {
  //   newNodes$.next(record);
  // });
  // console.log(`Scraping reviews for ${url}...`);

  // const title = await waitTitle(page);
  // console.log("Title:", title);

  // await firestore.collection(`users/${userId}/reviews`).doc(reviewId).set(
  //   {
  //     title,
  //     updatedAt: new Date(),
  //   },
  //   { merge: true }
  // );

  // let count = 0;

  // newNodes$
  //   .pipe(
  //     concatMap((record) =>
  //       interval(2000).pipe(
  //         take(1),
  //         map(() => record)
  //       )
  //     )
  //   )
  //   .subscribe(async (record) => {
  //     console.log(`Checked ${count} reviews`);
  //     await highLightElement(page, record);
  //     await handleElementActions(page, record);
  //     // await new Promise((resolve) => setTimeout(resolve, 500));
  //     const reviewComment = await elementReviewComment(page, record);
  //     console.log("Review Comment:", reviewComment);
  //     const reviewQA = await elementReviewQA(page, record);
  //     console.log("Review QA:", reviewQA);

  //     if (
  //       reviewComment.includes("More") ||
  //       reviewQA.find((qa) => qa.includes("More"))
  //     ) {
  //       console.error("More...");
  //       await new Promise((resolve) => setTimeout(resolve, 50000));
  //     }

  //     count++;
  //   });

  // await new Promise((resolve) => setTimeout(resolve, 2000));
  // console.log("Opening review tab...");
  // await openReviewTab(page);
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  // console.log("Sorting reviews...");
  // await sortReviews(page, sortBy);

  // console.log("Getting initial reviews...");
  // const initialReviews = await getInitialReviews(page);
  // initialReviews.forEach((review) => newNodes$.next(review));

  // watchNewReviews(page);

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
