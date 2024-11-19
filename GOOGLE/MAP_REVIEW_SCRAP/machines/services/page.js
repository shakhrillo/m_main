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
async function waitTitle(page) {
  console.log("Waiting for title...");
  const title = await page.title();
  console.log("Title:", title);
  // await page.waitForFunction((title) => document.title !== title, {}, title);
  // console.log("Title changed");
  // const newTitle = await page.title();
  // console.log("New title:", newTitle);

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

module.exports = {
  highLightElement,
  waitTitle,
  openReviewTab,
  sortReviews,
  getInitialReviews,
  watchNewReviews,
};
