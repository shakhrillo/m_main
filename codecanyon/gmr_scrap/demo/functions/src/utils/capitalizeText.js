/**
 * Capitalize the first letter of a string
 * @param {string} text
 * @returns {string}
 */
function capitalizeText(text) {
  if (typeof text !== "string") return "";

  return text.charAt(0).toUpperCase() + text.slice(1);
}

module.exports = capitalizeText;
