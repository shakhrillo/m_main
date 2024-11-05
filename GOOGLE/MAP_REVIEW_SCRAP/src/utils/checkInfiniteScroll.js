/**
 * Checks for infinite scroll completion by evaluating the last child element of the reviews container.
 * 
 * @param {Puppeteer.ElementHandle} reviewsContainer - The Puppeteer ElementHandle representing the reviews container.
 * @returns {Promise<Object>} A promise that resolves to an object containing:
 *  - {Puppeteer.ElementHandle} lastChild: The last child element of the reviews container.
 *  - {boolean} completed: A boolean indicating whether the last child has no children (indicating scroll completion).
 * 
 * @throws {Error} Throws an error if the evaluation fails or if the last child cannot be determined.
 */
async function checkInfiniteScroll(reviewsContainer) {
  try {
    // Evaluate the last child element of the reviews container
    const lastChild = await reviewsContainer.evaluateHandle(el => {
      if (!el) {
        return null;
      }
      return el.lastChild;
    });

    // Check if lastChild is null
    if (!lastChild) {
      console.error('No last child found in the reviews container.');
    }

    // Get the children of the last child element
    const lastChildChildren = await lastChild.evaluate(el => {
      if (!el) {
        return [];
      }
      return Array.from(el.children)
    });

    // Return the last child and completion status
    return {
      lastChild,
      completed: lastChildChildren.length === 0,
    };
  } catch (error) {
    console.log('Failed to check infinite scroll:', error);
    throw new Error('Failed to check infinite scroll due to an evaluation error.');
  }
}

module.exports = checkInfiniteScroll;