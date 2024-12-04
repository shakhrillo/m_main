(function () {
  if (typeof window === "undefined") {
    return;
  }

  function extractUser(node) {
    const user = {};
    const reviewerButton = node.querySelectorAll(
      'button[jsaction*="review.reviewerLink"]'
    );
    if (reviewerButton.length > 1) {
      user.url = reviewerButton[1].getAttribute("data-href");
      user.name = reviewerButton[1].firstChild.textContent;
      user.info = reviewerButton[1].lastChild.textContent
        .split("·")
        .map((item) => item.trim());
    }

    return user;
  }

  function getReviewDate(node) {
    const match = node.innerText.match(/(\b.+?\b ago)/);
    if (match) {
      return match[0];
    }
    return "";
  }

  function getReviewRate(node) {
    const rateElement = node.querySelector(
      'span[role="img"][aria-label*="stars"]'
    );

    if (!rateElement) {
      return 0;
    }

    const rating =
      rateElement?.getAttribute("aria-label")?.match(/(\d)/)?.[1] ||
      node.innerText.match(/(\d)\/5/)?.[1];

    return Number(rating) || 0;
  }

  function elementReviewComment(node) {
    let reviewText = "";
    const reviewContainers = node.querySelectorAll(".MyEned");
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
  }

  function elementReviewQA(node) {
    const reviewContainers = node.querySelectorAll(".MyEned");

    let rateElementParentNextSiblingLastChildChildren = [];

    if (reviewContainers.length) {
      const MyEnedLastChildren =
        reviewContainers[0].querySelectorAll(":scope > *");
      if (MyEnedLastChildren.length >= 2) {
        rateElementParentNextSiblingLastChildChildren =
          MyEnedLastChildren[1].querySelectorAll(":scope > *");
      }
    } else {
      const rateElement = node.querySelector(
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
  }

  function getOwnerResponse(node) {
    const reviewElementSpans = node.querySelectorAll("span");
    const ownerResponseSpan = Array.from(reviewElementSpans).find((span) =>
      span.innerText.includes("Response from the owner")
    );

    if (ownerResponseSpan) {
      return (
        ownerResponseSpan.parentElement?.nextElementSibling?.innerText || ""
      );
    }

    return "";
  }

  function getImgURLs(node) {
    const imageURLs = [];
    const allButtons = node.querySelectorAll(
      `button[jsaction*="review.openPhoto"]`
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
  }

  const parentEl = document.querySelector(".vyucnb").parentElement;
  const lastCheckedReviewsLength = 0;
  const observerCallback = (records) => {
    if (window.ids === undefined) {
      window.ids = [];
      window.scrollContainerChilds = [];
    }
    const scrollContainer = parentEl.children[parentEl.children.length - 2];
    window.scrollContainerChilds = Array.from(scrollContainer.children);

    if (window.scrollContainerChilds.length > 300) {
      const middle = window.scrollContainerChilds.slice(10, 200);
      for (const elm of middle) {
        elm.remove();
      }
    }

    // scroll to scrollContainer top
    // scrollContainer.scrollTop = 0;
    const firstChild = scrollContainer.children[0];
    firstChild.scrollIntoView();

    let waitTime = 100;
    if (lastCheckedReviewsLength === window.ids.length) {
      waitTime = 5000;
    } else {
      waitTime = 100;
    }

    setTimeout(() => {
      for (const record of records) {
        console.log("Record:", record);
        if (record.type === "childList") {
          Array.from(record.addedNodes).map((node, i) => {
            const id = node.getAttribute("data-review-id");
            // if latest review
            if (Array.from(record.addedNodes).length - 1 === i) {
              node.scrollIntoView();
            }

            if (id) {
              node.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
              });
              node.scrollIntoView();
              ids.push({
                id,
                review: elementReviewComment(node),
                user: extractUser(node),
                date: getReviewDate(node),
                rating: getReviewRate(node),
                qa: elementReviewQA(node),
                response: getOwnerResponse(node),
                imageUrls: getImgURLs(node),
              });
            }
          });
        }
      }
      lastCheckedReviewsLength = window.ids.length;
    }, waitTime);
  };
  new MutationObserver(observerCallback).observe(
    parentEl.children[parentEl.children.length - 2],
    {
      childList: true,
    }
  );
})();
