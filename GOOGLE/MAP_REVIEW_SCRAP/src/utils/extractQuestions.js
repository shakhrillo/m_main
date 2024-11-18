// const logger = require('./logger');

/**
 * Extracts questions from the given review element.
 *
 * @param {ElementHandle} element - The review element from which to extract questions.
 * @returns {Promise<string[]>} - A promise that resolves to an array of extracted questions.
 */
async function extractQuestions(element) {
  const extractedQA = [];
  let rateElementParentNextSiblingLastChildChildren;

  try {
    // Find all elements with class MyEned
    const MyEned = await element.$$(".MyEned");

    if (MyEned.length) {
      // If MyEned elements are found, access their last children
      const MyEnedLastChildren = await MyEned[0].$$(":scope > *");
      if (MyEnedLastChildren.length < 2) {
        // logger.warn('Not enough children found in MyEned to extract questions.');
        return []; // Return empty array if not enough children are found
      }
      rateElementParentNextSiblingLastChildChildren =
        await MyEnedLastChildren[1].$$(":scope > *");
    } else {
      // If no MyEned elements, check for the star rating element
      let rateElement = await element.$$(
        'span[role="img"][aria-label*="stars"]'
      );
      if (rateElement.length > 0) {
        rateElement = rateElement[0];
      }
      if (!rateElement) {
        // logger.warn('No star rating element found.');
        return []; // Return empty array if no star rating element is found
      }

      // Get the parent element's next sibling's first child
      const rateElementParent = await rateElement.evaluateHandle(
        (el) => el.parentElement?.nextElementSibling?.firstElementChild
      );
      if (!rateElementParent || JSON.stringify(rateElementParent) === "{}") {
        // logger.warn('No valid parent element found for star rating.');
        rateElementParentNextSiblingLastChildChildren = [];
      } else {
        // Access the children of the parent element
        rateElementParentNextSiblingLastChildChildren =
          await rateElementParent.$$(":scope > *");
      }
    }

    // Extract inner text from each question container
    for (const questionContainer of rateElementParentNextSiblingLastChildChildren) {
      const question = await questionContainer.evaluate((el) => {
        if (!el) return "";
        return el.innerText;
      });
      extractedQA.push(question);
    }
  } catch (error) {
    // logger.error('Error extracting questions:', error);
  }

  return extractedQA;
}

module.exports = extractQuestions;
