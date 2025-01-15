/**
 * Generate concise search keywords as an array of strings from a given text.
 * @param {string} text - The text to generate search keywords from.
 * @param {number} maxKeywords - Maximum number of keywords to return.
 * @returns {string[]} - The generated search keywords.
 */
function generateSearchKeywords(text, maxKeywords = 10) {
  const result = new Set();
  const words = text.toLowerCase().split(/\s+/); // Split input into words.

  // Add the first substring (up to 3 characters) and the full word for each word.
  words.forEach((word) => {
    if (word.length > 0) {
      result.add(word.slice(0, 3)); // Add the first 3 characters.
      result.add(word); // Add the full word.
    }
  });

  // Add the full input text as a single keyword.
  result.add(words.join(" "));

  // Convert the set back to an array, limit to maxKeywords, and return.
  return Array.from(result).slice(0, maxKeywords);
}

module.exports = generateSearchKeywords;
