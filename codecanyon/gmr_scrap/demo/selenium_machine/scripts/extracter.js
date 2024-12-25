if (typeof window === "undefined") {
  console.log("Window is undefined");
  return;
}

window.checkedIds = new Set();

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
    if (!!textContent && gmrScrap["extractVideoUrls"]) {
      data["button"] = button;
    }
    if (style) {
      const urlMatch = style.split('url("')[1]?.split('");')[0];
      if (urlMatch) {
        data["thumb"] = urlMatch.split("=")[0] + "=w1200";
      }
    }
    if (Object.keys(data).length) {
      if (data["button"] && gmrScrap["extractVideoUrls"]) {
        nodes.push(data);
      } else if (gmrScrap["extractImageUrls"]) {
        nodes.push(data);
      }
    }
  }

  return nodes;
}

/**
 * Waits until the element is removed from the DOM
 * @param {HTMLElement} node
 * @param {string} selector
 * @param {number} timeout
 * @returns {Promise<void>}
 * @throws {Error} Timeout: Selector "${selector}" still exists.
 */
const waitUntilNoElement = async (node, selector, timeout = 5000) => {
  const start = Date.now();
  while (node.querySelector(selector)) {
    if (Date.now() - start > timeout) {
      throw new Error(`Timeout: Selector "${selector}" still exists.`);
    }
    await new Promise((resolve) => setTimeout(resolve, 100)); // Polling interval
  }
};

/**
 * Scrolls the element into view and waits for the scroll event to finish
 * @param {HTMLElement} element
 * @param {ScrollIntoViewOptions} [options]
 * @returns {Promise<void>}
 * @throws {Error} Timeout: Scroll event not fired.
 */
function scrollIntoViewAndWait(
  element,
  options = { behavior: "instant", block: "start", inline: "nearest" }
) {
  return new Promise((resolve) => {
    // Listen for the 'scroll' event
    let isScrolling;

    const onScroll = () => {
      clearTimeout(isScrolling);
      isScrolling = setTimeout(() => {
        window.removeEventListener("scroll", onScroll);
        resolve();
      }, 100); // Wait 100ms after the last scroll event
    };

    // Attach the event listener
    window.addEventListener("scroll", onScroll);

    // Start the scroll
    element.scrollIntoView(options);

    // Fallback in case no scroll event is fired (e.g., already in view)
    setTimeout(() => {
      window.removeEventListener("scroll", onScroll);
      resolve();
    }, 1000); // Adjust timeout if necessary
  });
}

/**
 * Checks the node for review data and extracts it
 * @param {HTMLElement} node
 * @returns {Promise<void>}
 */
async function validateNode(node) {
  const id = node.getAttribute("data-review-id");
  if (id && !checkedIds.has(id)) {
    checkedIds.add(id);
    const buttonSelectors = [
      `button[jsaction*="review.showReviewInOriginal"]`,
      `button[jsaction*="review.expandReview"]`,
    ];

    if (gmrScrap["ownerResponse"]) {
      buttonSelectors.push(
        'button[jsaction*="review.showOwnerResponseInOriginal"]',
        'button[jsaction*="review.expandOwnerResponse"]'
      );
    }

    if (gmrScrap["extractImageUrls"] || gmrScrap["extractVideoUrls"]) {
      buttonSelectors.push('button[jsaction*="review.showMorePhotos"]');
    }

    for (const selector of buttonSelectors) {
      let button = node.querySelector(selector);

      if (button) {
        let retries = 0;
        while (retries < 3) {
          try {
            await scrollIntoViewAndWait(button);
            button.click();
            await waitUntilNoElement(node, selector);
            break;
          } catch (error) {
            retries++;
            console.error(`Attempt ${retries}: Error clicking button -`, error);

            if (retries >= 3) {
              console.error("Max retries reached. Failed to click the button.");
            }
          }
        }
      }
    }

    const review = getReviewComment(node);
    if (!!review) {
      gmrScrap["extractedUserReviewCount"] = !gmrScrap[
        "extractedUserReviewCount"
      ]
        ? 1
        : gmrScrap["extractedUserReviewCount"] + 1;
    }

    const response = getReviewResponse(node);
    if (!!response) {
      gmrScrap["extractedOwnerReviewCount"] = !gmrScrap[
        "extractedOwnerReviewCount"
      ]
        ? 1
        : gmrScrap["extractedOwnerReviewCount"] + 1;
    }

    const imageUrls = [];
    const videoUrls = [];
    if (gmrScrap["extractImageUrls"] || gmrScrap["extractVideoUrls"]) {
      let nodeMedia = getReviewMedia(node);

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

          if (videoUrl) {
            videoUrls.push({
              thumb,
              videoUrl,
            });
          } else {
            imageUrls.push({ thumb });
          }
        }
      }
    }

    gmrScrap["extractedVideoUrls"].push(...videoUrls);
    gmrScrap["extractedImageUrls"].push(...imageUrls);

    return {
      id,
      review,
      user: getReviewUser(node),
      date: getReviewDate(node),
      rating: getReviewRate(node),
      qa: getReviewQA(node),
      response,
      imageUrls,
      videoUrls,
      time: +Date.now(),
    };
  }

  return null;
}

/**
 * Fetches visible elements from the page.
 * @returns {Promise<GmrScrap>}
 */
window.fetchVisibleElements = async () => {
  const scrollContainer =
    document.querySelector(".vyucnb")?.parentElement?.lastChild
      ?.previousSibling;

  if (!scrollContainer || !scrollContainer.children) {
    console.error("Scroll element or its children not found.");
    return;
  }

  const childNodes = Array.from(scrollContainer.children);
  for (const node of childNodes) {
    try {
      const validatedElement = await validateNode(node);
      if (validatedElement) {
        gmrScrap.extractedReviews.push(validatedElement);
      }
    } catch (error) {
      console.error("Error processing node:", error);
    }
  }

  return gmrScrap.extractedReviews;
};
