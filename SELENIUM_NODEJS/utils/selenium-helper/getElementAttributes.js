async function getElementAttributes(element, attributes) {
  const attributeValues = {};

  // Loop through the list of attributes
  for (const attr of attributes) {
    try {
      // Get the attribute value
      attributeValues[attr] = await element.getAttribute(attr);
    } catch (error) {
      console.error(`Error getting attribute ${attr}:`, error);
      attributeValues[attr] = null; // or handle it as needed
    }
  }

  return attributeValues;
}

module.exports = getElementAttributes;