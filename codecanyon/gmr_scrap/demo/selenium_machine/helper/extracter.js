if (typeof window === "undefined") {
  console.log("Window is undefined");
  return;
}

let waitTime = 100;
// window.checkedIds = new Set();
// window.ids = [];
// window.extractedImages = [];
// window.extractedOwnerReviewCount = 0;
// window.extractedUserReviewCount = 0;

function scrollToLoader() {
  const targetParent = document.querySelector(".vyucnb")?.parentElement;

  if (targetParent) {
    const lastChild = targetParent.lastElementChild;
    lastChild?.scrollIntoView();
  }
}

/**
 * Extracts the user information from the review node
 * @param {HTMLElement} node
 * @returns {{url: string, name: string, info: string[]}}
 */
function getReviewUser(node) {
  const btnEl = node.querySelector('button[jsaction*="review.reviewerLink"]');

  if (btnEl) {
    return {
      url: btnEl.getAttribute("data-href"),
      name: btnEl.firstChild.textContent,
      info: btnEl.lastChild.textContent.split("·").map((item) => item.trim()),
    };
  }

  return {
    url: "",
    name: "",
    info: [],
  };
}

/**
 * Extracts the review date from the review node
 * @param {HTMLElement} node
 * @returns {string}
 * @example "2 days ago"
 */
function getReviewDate(node) {
  const match = node.innerText.match(/\b\d*\s?\w+\sago\b/g);

  if (match) {
    return match[0] || "";
  }

  return "";
}

/**
 * Extracts the review rate from the review node
 * @param {HTMLElement} node
 * @returns {number}
 * @example 4
 * @example 3.5
 */
function getReviewRate(node) {
  const spanEl = node.querySelector('span[role="img"][aria-label*="stars"]');

  if (spanEl) {
    const rating =
      spanEl?.getAttribute("aria-label")?.match(/(\d)/)?.[1] ||
      node.innerText.match(/(\d)\/5/)?.[1];

    return Number(rating) || 0;
  }

  return 0;
}

/**
 * Extracts the review comment from the review node
 * @param {HTMLElement} node
 * @returns {string}
 */
function getReviewComment(node) {
  let text = "";
  const divEls = node.querySelectorAll(".MyEned");
  for (const divEl of divEls) {
    const lastSpan = divEl.querySelector("span:last-of-type");
    const lastSpanText = lastSpan?.textContent?.trim() || "";

    if (lastSpanText.includes("Read more")) {
      const firstSpan = divEl.querySelector("span:first-of-type");
      text += firstSpan?.textContent?.trim() || "";
    } else {
      text += lastSpanText;
    }
  }

  return text;
}

/**
 * Extracts the review question and answer from the review node
 * @param {HTMLElement} node
 * @returns {string[]}
 * @example ["Q: Question 1", "A: Answer 1", "Q: Question 2", "A: Answer 2"]
 */
function getReviewQA(node) {
  const divEls = node.querySelectorAll(".MyEned");
  let qaEls = [];

  if (divEls.length) {
    const divElChildren = divEls[0].querySelectorAll(":scope > *");
    if (divElChildren.length >= 2) {
      qaEls = divElChildren[1].querySelectorAll(":scope > *");
    }
  } else {
    const rateEl = node.querySelector('span[role="img"][aria-label*="stars"]');
    if (rateEl) {
      const rateElParent =
        rateEl.parentElement?.nextElementSibling?.firstElementChild;
      if (rateElParent) {
        qaEls = rateElParent.querySelectorAll(":scope > *");
      }
    }
  }

  const extractedQA = Array.from(
    qaEls,
    (questionContainer) => questionContainer.innerText
  );

  return extractedQA;
}

/**
 * Extracts the review response from the review node
 * @param {HTMLElement} node
 * @returns {string}
 */
function getReviewResponse(node) {
  const spanEls = node.querySelectorAll("span");
  const spanEl = Array.from(spanEls).find((span) =>
    span.innerText.includes("Response from the owner")
  );

  if (spanEl) {
    return spanEl.parentElement?.nextElementSibling?.innerText || "";
  }

  return "";
}

/**
 * Extracts the review media from the review node
 * @param {HTMLElement} node
 * @returns {{thumb: string, videoUrl: string}[]}
 */
function getReviewMedia(node) {
  const nodes = [];
  const allButtons = node.querySelectorAll(
    `button[jsaction*="review.openPhoto"]`
  );

  for (const button of allButtons) {
    let data = {};
    const style = button.getAttribute("style");
    const textContent = button.textContent;
    if (!!textContent) {
      data["button"] = button;
    }
    if (style) {
      const urlMatch = style.split('url("')[1]?.split('");')[0];
      if (urlMatch) {
        data["thumb"] = urlMatch.split("=")[0] + "=w1200";
      }
    }
    if (Object.keys(data).length) {
      nodes.push(data);
    }
  }

  return nodes;
}

/**
 * Checks the node for review data and extracts it
 * @param {HTMLElement} node
 * @returns {Promise<void>}
 */
// let pn = 0;
async function checkNode(node) {
  const id = node.getAttribute("data-review-id");
  if (id && !checkedIds.has(id)) {
    checkedIds.add(id);
    console.log("id:", id);
    const buttonSelectors = [
      `button[jsaction*="review.showReviewInOriginal"]`,
      `button[jsaction*="review.showOwnerResponseInOriginal"]`,
      `button[jsaction*="review.expandReview"]`,
      `button[jsaction*="review.expandOwnerResponse"]`,
      `button[jsaction*="review.showMorePhotos"]`,
    ];

    for (const selector of buttonSelectors) {
      let button = node.querySelector(selector);

      if (button) {
        button.scrollIntoView();
        button.click();

        // Wait until the button is removed from the DOM
        while (node.querySelector(selector)) {
          await new Promise((resolve) => setTimeout(resolve, 100)); // Polling interval
        }
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const review = getReviewComment(node);
    if (!!review) {
      extractedUserReviewCount += 1;
    }

    const response = getReviewResponse(node);
    if (!!response) {
      extractedOwnerReviewCount += 1;
    }

    const media = [];
    const nodeMedia = getReviewMedia(node);

    if (nodeMedia.length) {
      for (const { thumb, button } of nodeMedia) {
        let videoUrl = "";
        if (button) {
          button.click();

          await new Promise((resolve) => setTimeout(resolve, 500));
          const iframe = document.querySelector("iframe");
          if (iframe) {
            const iframeDoc = iframe.contentWindow?.document;
            if (iframeDoc) {
              const video = iframeDoc.querySelector("video");
              if (video) {
                videoUrl = video.src;
              }
            }
          }
        }

        media.push({
          thumb,
          videoUrl,
        });
      }
    }

    extractedImages.push(...media);

    return {
      id,
      review,
      user: getReviewUser(node),
      date: getReviewDate(node),
      rating: getReviewRate(node),
      qa: getReviewQA(node),
      response,
      media,
      time: +Date.now(),
    };

    // try {
    //   const data = {
    //     id,
    //     review,
    //     user: getReviewUser(node),
    //     date: getReviewDate(node),
    //     rating: getReviewRate(node),
    //     qa: getReviewQA(node),
    //     response,
    //     media,
    //     time: +Date.now(),
    //   };
    // } catch (error) {
    //   console.error("Error: ", error);
    // }

    // pn += 1;
    // await db.doc(`machines/${tag}`).update({
    //   pn,
    // });

    // ids.push({
    //   id,
    //   review,
    //   user: getReviewUser(node),
    //   date: getReviewDate(node),
    //   rating: getReviewRate(node),
    //   qa: getReviewQA(node),
    //   response,
    //   media,
    //   time: +Date.now(),
    // });

    // console.log("ids:", ids.length);
  }

  return null;
}

// const ins = async () => {
//   // Store the observer globally to avoid multiple subscriptions
//   if (window.activeObserver) {
//     console.log("Disconnecting previous observer...");
//     window.activeObserver.disconnect();
//     window.activeObserver = null; // Clear the reference
//   }

//   const parentEl = document.querySelector(".vyucnb")?.parentElement;
//   if (!parentEl) {
//     console.error("Parent element not found!");
//     return;
//   }

//   const observerCallback = async (records) => {
//     console.log("Records:", records);
//     try {
//       for (const record of records) {
//         if (record.type === "childList" && record.addedNodes.length > 0) {
//           for (const node of record.addedNodes) {
//             try {
//               await checkNode(node);
//             } catch (error) {
//               console.error("Error processing node:", error);
//             }
//           }
//           await new Promise((resolve) => setTimeout(resolve, 400));
//           scrollToLoader();
//         }
//       }
//     } catch (error) {
//       console.error("Error processing records:", error);
//     }
//   };

//   // Initialize a new MutationObserver
//   const observer = new MutationObserver(observerCallback);

//   const targetEl = parentEl.children[parentEl.children.length - 2];
//   if (!targetEl) {
//     console.error("Target element not found!");
//     return;
//   }

//   observer.observe(targetEl, {
//     childList: true,
//   });

//   // Save the active observer to prevent duplicate subscriptions
//   window.activeObserver = observer;

//   const scrollEl =
//     document.querySelector(".vyucnb")?.parentElement?.lastChild
//       ?.previousSibling;
//   if (!scrollEl || !scrollEl.children) {
//     console.error("Scroll element not found!");
//     return;
//   }

//   const scrollElChildren = scrollEl.children;
//   for (const node of scrollElChildren) {
//     try {
//       await checkNode(node);
//     } catch (error) {
//       console.error("Error processing node:", error);
//     }
//   }

//   scrollToLoader();
// };

// window.init();
async function getVisibleEls() {
  const elements = [];
  const scrollEl =
    document.querySelector(".vyucnb")?.parentElement?.lastChild
      ?.previousSibling;

  if (!scrollEl || !scrollEl.children) {
    console.error("Scroll element or its children not found.");
    return;
  }

  // Convert children to an array
  const scrollElChildren = Array.from(scrollEl.children);

  let startIndex = 0;

  console.log(
    "Number of nodes to process:",
    scrollElChildren.length - startIndex
  );

  // Process nodes from startIndex onward
  for (let i = startIndex; i < scrollElChildren.length; i++) {
    const node = scrollElChildren[i];
    try {
      const element = await checkNode(node);
      if (element) {
        elements.push(element);
      }
      // remove the node from the DOM
      node.remove();
    } catch (error) {
      console.error("Error processing node:", error);
    }
  }

  return elements;
}

window.getVisibleEls = getVisibleEls;

// getVisibleEls();
