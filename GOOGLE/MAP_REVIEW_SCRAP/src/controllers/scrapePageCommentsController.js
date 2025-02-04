const { launchBrowser, openPage } = require("../services/browserService");
const wait = require("../utils/wait");
const logger = require("../config/logger");
const clickReviewTab = require("../utils/clickReviewTab");
const sortReviews = require("../utils/sortReviews");
const {
  scrollAndCollectElements,
} = require("../utils/scrollAndCollectElements");
const fetchReviewDetails = require("../utils/fetchReviewDetails");
const waitForArrayGrowth = require("../utils/waitForArrayGrowth");
const {
  addComments,
  updateReview,
  batchWriteLargeArray,
} = require("./reviewController");

const { Subject, concatMap, interval, take, map } = require("rxjs");
const newNodes$ = new Subject();

const browser = {};
const page = {};
const elements = {};
let limitIsReached = {};

async function scrapePageComments(
  { url, userId, reviewId, limit, sortBy },
  port,
  containerName
) {
  browser[containerName] = await launchBrowser(port);
  page[containerName] = await openPage(browser[containerName], url);
  elements[containerName] = [];
  limitIsReached[containerName] = false;

  // await page[containerName].setCacheEnabled(false);

  // page[containerName].on("close", () => {
  //   logger.error("Page closed unexpectedly");
  //   limitIsReached[containerName] = true;
  // });

  await page[containerName].setDefaultTimeout(60000); // 60 seconds
  await page[containerName].setDefaultNavigationTimeout(60000);

  page[containerName].on("error", (error) => {
    console.error("Page error:", error);
    limitIsReached[containerName] = true;
  });
  // page[containerName].on("pageerror", (error) =>
  //   console.error("Uncaught error:", error)
  // );

  page[containerName].exposeFunction("logger", async function log(message) {
    logger.info(message);
  });

  newNodes$
    .pipe(
      // Map each item to a 1-second interval observable
      concatMap((record) =>
        interval(1000).pipe(
          take(1),
          map(() => record) // Map the interval to emit the current record
        )
      )
    )
    .subscribe(async (record) => {
      console.log("Record:", record);
      await page[containerName].evaluate(async (record) => {
        try {
          const reviewElement = document.querySelector(
            `div[data-review-id="${record}"]`
          );
          if (reviewElement) {
            reviewElement.style.border = "2px solid red";
            reviewElement.scrollIntoView();
          }

          const expandReviewButton = reviewElement.querySelector(
            `button[data-review-id="${record}"][jsaction*="review.expandReview"]`
          );
          if (expandReviewButton) {
            expandReviewButton.style.border = "2px solid blue";
            expandReviewButton.click();
          }

          const showReviewInOriginalButton = reviewElement.querySelector(`
            button[data-review-id="${record}"][jsaction*="review.showReviewInOriginal"]
          `);

          if (showReviewInOriginalButton) {
            showReviewInOriginalButton.style.border = "2px solid green";
            showReviewInOriginalButton.click();
          }

          const expandOwnerResponseButton = reviewElement.querySelector(`
            button[data-review-id="${record}"][jsaction*="review.expandOwnerResponse"]
          `);

          if (expandOwnerResponseButton) {
            expandOwnerResponseButton.style.border = "2px solid yellow";
            expandOwnerResponseButton.click();
          }

          const showOwnerResponseInOriginalButton =
            reviewElement.querySelector(`
            button[data-review-id="${record}"][jsaction*="review.showOwnerResponseInOriginal"]
          `);

          if (showOwnerResponseInOriginalButton) {
            showOwnerResponseInOriginalButton.style.border = "2px solid orange";
            showOwnerResponseInOriginalButton.click();
          }

          // wait 2 sec
          await new Promise((resolve) => setTimeout(resolve, 2000));

          let reviewText = "";
          const reviewContainers = reviewElement.querySelectorAll(".MyEned");
          for (const reviewContainer of reviewContainers) {
            const lastSpan = reviewContainer.querySelector("span:last-of-type");
            const lastSpanText = lastSpan?.textContent?.trim() || "";

            // Check for "Read more" and fallback to the first span if needed
            if (lastSpanText.includes("Read more")) {
              const firstSpan =
                reviewContainer.querySelector("span:first-of-type");
              reviewText += firstSpan?.textContent?.trim() || "";
            } else {
              reviewText += lastSpanText;
            }
          }

          let rateElementParentNextSiblingLastChildChildren = [];

          if (reviewContainers.length) {
            const MyEnedLastChildren =
              reviewContainers[0].querySelectorAll(":scope > *");
            if (MyEnedLastChildren.length >= 2) {
              rateElementParentNextSiblingLastChildChildren =
                MyEnedLastChildren[1].querySelectorAll(":scope > *");
            }
          } else {
            const rateElement = reviewElement.querySelector(
              'span[role="img"][aria-label*="stars"]'
            );
            if (rateElement) {
              const rateElementParent =
                rateElement.parentElement?.nextElementSibling
                  ?.firstElementChild;
              if (rateElementParent) {
                rateElementParentNextSiblingLastChildChildren =
                  rateElementParent.querySelectorAll(":scope > *");
              }
            }
          }

          const extractedQA = Array.from(
            rateElementParentNextSiblingLastChildChildren,
            (questionContainer) => questionContainer.innerText
          );

          const result = {
            id: record,
            reviewText,
            extractedQA,
          };

          // logger(`Result: ${JSON.stringify(result)}`);

          // elements[containerName].push(result);
          pushElm(result);

          // const result = {
          //   id: reviewId,
          //   element: reviewElement,
          //   review: await extractReviewText(reviewElement),
          //   date: await getReviewDate(reviewElement, reviewId),
          //   response: await getOwnerResponse(reviewElement),
          //   responseTime: await getOwnerResponseTime(reviewElement),
          //   imageUrls: await extractImageUrlsFromButtons(page, reviewId),
          //   rating: await extractReviewRating(reviewElement, reviewId),
          //   qa: await extractQuestions(reviewElement),
          //   user: await extractReviewer(reviewElement, reviewId),
          // };
        } catch (error) {
          logger(`Error evaluating record: ${error}`);
        }
      }, record);
    });

  page[containerName].exposeFunction("pushElm", function (record) {
    elements[containerName].push(record);
  });
  page[containerName].exposeFunction(
    "puppeteerMutationListener",
    async function puppeteerMutationListener(records, uid, reviewId) {
      console.log("Record:", records.length);
      console.log("Saved:", elements[containerName].length);

      if (limitIsReached[containerName]) {
        return;
      }

      for (const record of records) {
        newNodes$.next(record);
        // await page[containerName].evaluate((record) => {
        //   const reviewElement = document.querySelector(
        //     `button[jsaction*="review.reviewerLink"][data-review-id="${record}"]`
        //   );
        //   console.log("Review element:", reviewElement);
        //   if (reviewElement) {
        //     reviewElement.scrollIntoView();
        //   }
        // }, record);
        // await fetchReviewDetails(page[containerName], record)
        //   .then(async (result) => {
        //     if (result) {
        //       elements[containerName].push(result);
        //     }
        //   })
        //   .catch((error) => {
        //     console.error("Error fetching review details:", error);
        //   });
      }
    }
  );

  await page[containerName].evaluate(
    ({ uid, reviewId }) => {
      window.uid = uid;
      window.reviewId = reviewId;
    },
    { uid: userId, reviewId: reviewId }
  );

  logger.info(`Pushing to ${reviewId} page`);

  const title = await page[containerName].title();

  await updateReview(userId, reviewId, {
    status: "in_progress",
    createdAt: new Date(),
    title,
  });

  await clickReviewTab(page[containerName]);
  await wait(2000);
  await sortReviews(page[containerName], sortBy);
  await wait(2000);

  await page[containerName].evaluate(() => {
    const reviewsContainer = document.querySelector(".vyucnb")?.parentElement;
    if (reviewsContainer?.lastChild) {
      reviewsContainer.lastChild.scrollIntoView();
      logger("Scrolled to the bottom of the page");
    }
  });

  page[containerName].evaluate(() => {
    let lastLogTime = Date.now();
    // let lastNodeId = null;

    const observerCallback = (records) => {
      for (const record of records) {
        console.log("Record:", record);
        // logger(`Mutation type: ${JSON.stringify(record)}`);
        if (record.type === "childList") {
          // logger("Child list mutation detected");
          // logger`Added nodes: ${record.addedNodes.length}`;
          const addedNodeIds = Array.from(record.addedNodes)
            .map((node) => node.getAttribute("data-review-id"))
            .filter(Boolean);
          puppeteerMutationListener(addedNodeIds, window.uid, window.pushId);
          // lastNodeId = addedNodeIds[addedNodeIds.length - 1];
        }
      }
      lastLogTime = Date.now();
    };

    // setInterval(() => {
    //   try {
    //     log(`Last log time: ${lastLogTime}`);
    //     if (Date.now() - lastLogTime > 5000) {
    //       log("No new records in the last 5 seconds. Stopping...");
    //       const vyuCnb = document.querySelector(".vyucnb");
    //       if (!vyuCnb) {
    //         log("No .vyucnb element found");
    //       } else {
    //         log(
    //           document.querySelector(".vyucnb").parentElement.firstElementChild
    //         );
    //         if (lastNodeId) {
    //           document
    //             .querySelector(`[data-review-id="${lastNodeId}"]`)
    //             .scrollIntoView();
    //         }
    //         setTimeout(() => {
    //           document
    //             .querySelector(".vyucnb")
    //             .parentElement.lastChild.scrollIntoView();
    //         }, 2000);
    //       }
    //     }
    //   } catch (error) {
    //     log("Error scrolling to the top of the page", error);
    //   }
    // }, 5000);

    const parentEl = document.querySelector(".vyucnb").parentElement;
    new MutationObserver(observerCallback).observe(
      parentEl.children[parentEl.children.length - 2],
      {
        childList: true,
      }
    );
  });

  // const currentUrl = page[containerName].url();
  // page[containerName].on("framenavigated", async (frame) => {
  //   console.log("Frame navigated", frame.url());
  //   if (
  //     frame === page[containerName].mainFrame() &&
  //     frame.url() !== currentUrl
  //   ) {
  //     logger.error(`Navigated to URL: ${currentUrl}`);
  //     // await frame.goto(currentUrl, {
  //     //   // ...config.goto,
  //     //   timeout: 30000,
  //     // });
  //     // await wait(2000);
  //     // go back to the previous page
  //     // check if there is history
  //     // await page[containerName].goBack();
  //   }
  // });

  // Disable opening new tabs/windows
  // await page[containerName].evaluateOnNewDocument(() => {
  //   window.open = () => {
  //     console.warn("Prevented a new tab from opening.");
  //     return null;
  //   };
  // });

  // page[containerName].on("popup", async (popup) => {
  //   console.log("Popup prevented and closed:", await popup.url());
  //   await popup.close();
  // });

  // await page[containerName].goto("https://example.com");

  // const initialElements = await scrollAndCollectElements(
  //   page[containerName],
  //   userId,
  //   reviewId,
  //   limit
  // );
  // elements[containerName].push(...initialElements);

  await waitForArrayGrowth(elements[containerName], limit);

  limitIsReached[containerName] = true;

  await updateReview(userId, reviewId, {
    status: "completed",
    completedAt: new Date(),
    totalReviews: elements[containerName].length,
    title,
  });

  batchWriteLargeArray(userId, reviewId, elements[containerName]);
  await wait(1000);

  await page[containerName].close();
  await browser[containerName].close();

  return {
    ...{ url, userId, reviewId, limit, sortBy },
    port,
    containerName,
    title,
    elements: elements[containerName],
  };
}

module.exports = scrapePageComments;
