const { By } = require("selenium-webdriver");

async function beforeTheLastChildInsideParentChildren(parent, lastElementId = null) {
  const allElements = [];
  let lastValidElementId = lastElementId || null;
  let lastChildChildrenLength = 0;

  try {
    // Get the second-to-last child in the parent's children
    const lastChild = await parent.findElement(By.xpath("child::*[last()]"));
    const lastChildChildren = await lastChild.findElements(By.xpath("child::*"));
    lastChildChildrenLength = lastChildChildren.length;
    // const lastChild = await parent.findElement(By.xpath("child::*[last()]"));
    // lastChildChildren = await lastChild.findElements(By.xpath("child::*")).length;
    
    const beforeTheLastChild = await parent.findElement(By.xpath("child::*[last()-1]"));
    
    // Determine the starting element based on lastElementId or use the first child of beforeTheLastChild
    let startingElement = lastElementId
      ? await beforeTheLastChild.findElement(By.xpath(`child::*[@data-review-id="${lastElementId}"]`))
      : await beforeTheLastChild.findElement(By.xpath("child::*[1]"));
    
    // Check if startingElement exists and find the first following sibling
    let nextElement = startingElement
      ? await startingElement.findElement(By.xpath("following-sibling::*")).catch(() => null)
      : null;

    while (nextElement) {
      
      const elementId = await nextElement.getAttribute("data-review-id");
      if (elementId) {
        lastValidElementId = elementId;
        allElements.push({
          id: elementId,
          element: nextElement
        });
      }

      // Move to the next sibling, if it exists
      nextElement = await nextElement.findElement(By.xpath("following-sibling::*")).catch(() => null);
    }
  } catch (error) {
    console.error("Error finding elements:", error);
  }

  return {allElements, lastValidElementId, lastChildChildrenLength};
}

module.exports = beforeTheLastChildInsideParentChildren;