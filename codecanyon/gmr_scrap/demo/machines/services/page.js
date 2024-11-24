async function highLightElement(page, record) {
  await page.evaluate(async (record) => {
    const randomHEX = Math.floor(Math.random() * 16777215).toString(16);
    const reviewElement = document.querySelector(
      `div[data-review-id="${record}"]`
    );
    if (reviewElement) {
      reviewElement.style.backgroundColor = `#${randomHEX}`;
      reviewElement.style.border = `2px solid #${randomHEX}`;
      reviewElement.scrollIntoView();
    }
  }, record);
}

async function copyReviewURL(page, record) {
  return await page.evaluate(async (record) => {
    let url = null;
    const button = document.querySelector(
      `button[data-review-id="${record}"][jsaction*="review.actionMenu"]`
    );

    if (button) {
      button.click();
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    const menuItem = document.querySelector(`
      div[role="menuitemradio"][data-index="0"][aria-checked="false"]
    `);

    if (menuItem) {
      menuItem.click();
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    const input = document.querySelector(`input[jsaction*="clickInput"]`);
    if (input) {
      url = input.value;
    }

    const buttonClose = document.querySelector(
      `button[jsaction*="modal.close"]`
    );
    if (buttonClose) {
      buttonClose.click();
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return url;
  }, record);
}

async function handleElementActions(page, record) {
  await page.evaluate(async (record) => {
    const reviewElement = document.querySelector(
      `div[data-review-id="${record}"]`
    );

    const buttonActions = [
      {
        selector: `button[data-review-id="${record}"][jsaction*="review.showReviewInOriginal"]`,
      },
      {
        selector: `button[data-review-id="${record}"][jsaction*="review.showOwnerResponseInOriginal"]`,
      },
      {
        selector: `button[data-review-id="${record}"][jsaction*="review.expandReview"]`,
      },
      {
        selector: `button[data-review-id="${record}"][jsaction*="review.expandOwnerResponse"]`,
      },
      {
        selector: `button[data-review-id="${record}"][jsaction*="review.showMorePhotos"]`,
      },
    ];

    for (const { selector } of buttonActions) {
      const button = reviewElement.querySelector(selector);
      if (button) {
        button.click();
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }, record);
}

async function getUserDetails(page, record) {
  return await page.evaluate(async (record) => {
    const user = {};
    const reviewElement = document.querySelector(
      `div[data-review-id="${record}"]`
    );
    const reviewerButton = reviewElement.querySelectorAll(
      `button[jsaction*="review.reviewerLink"]`
    );
    if (reviewerButton.length > 1) {
      user.url = reviewerButton[1].getAttribute("data-href");
      user.name = reviewerButton[1].firstChild.textContent;
      user.info = reviewerButton[1].lastChild.textContent
        .split("·")
        .map((item) => item.trim());
    }

    return user;
  }, record);
}

async function elementReviewComment(page, record) {
  return await page.evaluate(async (record) => {
    const reviewElement = document.querySelector(
      `div[data-review-id="${record}"]`
    );

    let reviewText = "";
    const reviewContainers = reviewElement.querySelectorAll(".MyEned");
    for (const reviewContainer of reviewContainers) {
      const lastSpan = reviewContainer.querySelector("span:last-of-type");
      const lastSpanText = lastSpan?.textContent?.trim() || "";

      if (lastSpanText.includes("Read more")) {
        const firstSpan = reviewContainer.querySelector("span:first-of-type");
        reviewText += firstSpan?.textContent?.trim() || "";
      } else {
        reviewText += lastSpanText;
      }
    }

    return reviewText;
  }, record);
}

async function elementReviewQA(page, record) {
  return await page.evaluate(async (record) => {
    const reviewElement = document.querySelector(
      `div[data-review-id="${record}"]`
    );

    const reviewContainers = reviewElement.querySelectorAll(".MyEned");

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
          rateElement.parentElement?.nextElementSibling?.firstElementChild;
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

    return extractedQA;
  }, record);
}

async function getOwnerResponse(page, record) {
  return await page.evaluate(async (record) => {
    const reviewElement = document.querySelector(
      `div[data-review-id="${record}"]`
    );

    // span inner text includes "Response from the owner"
    const reviewElementSpans = reviewElement.querySelectorAll("span");
    const ownerResponseSpan = Array.from(reviewElementSpans).find((span) =>
      span.innerText.includes("Response from the owner")
    );

    if (ownerResponseSpan) {
      return (
        ownerResponseSpan.parentElement?.nextElementSibling?.innerText || ""
      );
    }

    return "";
  }, record);
}

async function getImgURLs(page, record) {
  return await page.evaluate(async (record) => {
    const imageURLs = [];
    const reviewElement = document.querySelector(
      `div[data-review-id="${record}"]`
    );

    const allButtons = reviewElement.querySelectorAll(
      `button[data-review-id="${record}"][jsaction*="review.openPhoto"]`
    );

    for (const button of allButtons) {
      const style = button.getAttribute("style");
      if (style) {
        const urlMatch = style.split('url("')[1]?.split('");')[0];
        if (urlMatch) {
          imageURLs.push(urlMatch.split("=")[0] + "=w1200");
        }
      }
    }

    return imageURLs;
  }, record);
}

async function getReviewDate(page, record) {
  return await page.evaluate(async (record) => {
    const reviewElement = document.querySelector(
      `div[data-review-id="${record}"]`
    );

    const match = reviewElement.innerText.match(/(\b.+?\b ago)/);

    if (match) {
      return match[0];
    }

    return "";
  }, record);
}

async function getReviewRate(page, record) {
  return await page.evaluate(async (record) => {
    const reviewElement = document.querySelector(
      `div[data-review-id="${record}"]`
    );
    const rateElement = reviewElement?.querySelector(
      'span[role="img"][aria-label*="stars"]'
    );

    const rating =
      rateElement?.getAttribute("aria-label")?.match(/(\d)/)?.[1] ||
      reviewElement.innerText.match(/(\d)\/5/)?.[1];

    return Number(rating) || 0;
  }, record);
}

async function waitTitle(page) {
  console.log("Waiting for title...");
  const title = await page.title();
  return title;
}

async function openReviewTab(page) {
  await page.evaluate(() => {
    const allButtons = document.querySelectorAll('button[role="tab"]');
    if (!allButtons.length) {
      throw new Error("No tab buttons found");
    }

    for (const button of allButtons) {
      const tabText = button.textContent?.trim().toLowerCase() || "";
      if (tabText.includes("reviews")) {
        button.click();
        return;
      }
    }

    throw new Error("Review tab not found");
  });
}

async function sortReviews(page, sortBy = "Newest") {
  await page.waitForSelector(
    'button[aria-label="Sort reviews"], button[aria-label="Most relevant"]'
  );

  await page.evaluate(async (sortBy) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const sortButton = document.querySelector(
      'button[aria-label="Sort reviews"], button[aria-label="Most relevant"]'
    );
    if (!sortButton) {
      throw new Error("Sort button not found");
    }
    sortButton.click();
    await delay(1000);

    const menuItems = Array.from(
      document.querySelectorAll('[role="menuitemradio"]')
    );
    const targetItem = menuItems.find(
      (item) => item.textContent.trim() === sortBy
    );

    if (!targetItem) {
      throw new Error(`${sortBy} menu item not found`);
    }

    targetItem.click();
  }, sortBy);
}

async function getInitialReviews(page) {
  await page.waitForSelector(".vyucnb", { visible: true });
  return await page.evaluate(async () => {
    const elements = [];

    const getReviewIds = () => {
      const reviewsContainer =
        document.querySelector(".vyucnb")?.parentElement?.lastChild
          ?.previousSibling;
      if (!reviewsContainer) return [];

      const reviewIds = [];
      const reviewsContainerChildren = reviewsContainer.children;
      for (const reviewElm of reviewsContainerChildren) {
        const reviewId = reviewElm.getAttribute("data-review-id");
        if (reviewId) {
          reviewIds.push(reviewId);
        }
      }
      return reviewIds;
    };

    await new Promise((resolve) => {
      const interval = setInterval(() => {
        const reviewIds = getReviewIds();
        if (reviewIds.length > 0) {
          clearInterval(interval);
          elements.push(...reviewIds);
          resolve();
        }
      }, 1000);
    });

    return elements;
  });
}

async function watchNewReviews(page) {
  page.evaluate(() => {
    const observerCallback = (records) => {
      for (const record of records) {
        console.log("Record:", record);
        if (record.type === "childList") {
          Array.from(record.addedNodes).map((node) => {
            const reviewId = node.getAttribute("data-review-id");
            if (reviewId) {
              newNodes(reviewId);
            } else {
              // scroll to view
              node.scrollIntoView();
            }
          });
        }
      }
    };

    const parentEl = document.querySelector(".vyucnb").parentElement;
    new MutationObserver(observerCallback).observe(
      parentEl.children[parentEl.children.length - 2],
      {
        childList: true,
      }
    );
  });
}

async function scrollToBottom(page) {
  await page.evaluate(async () => {
    const scrollContainer =
      document.querySelector(".vyucnb").parentElement.lastChild;
    scrollContainer.scrollIntoView();
  });
}

module.exports = {
  highLightElement,
  copyReviewURL,
  handleElementActions,
  getReviewRate,
  getReviewDate,
  getUserDetails,
  elementReviewComment,
  elementReviewQA,
  getOwnerResponse,
  getImgURLs,
  waitTitle,
  openReviewTab,
  sortReviews,
  getInitialReviews,
  watchNewReviews,
  scrollToBottom,
};
