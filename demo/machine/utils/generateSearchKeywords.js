/**
 * Generate concise search keywords as an array of strings from a given text.
 * @param {string} text - The text to generate search keywords from.
 * @param {number} maxKeywords - Maximum number of keywords to return.
 * @returns {string[]} - The generated search keywords.
 */
function generateSearchKeywords(input, maxKeywords = 10) {
  const keywords = new Set();
  const words = input.toLowerCase().split(/\s+/).filter(Boolean); // Split into words

  // Generate substrings for each word (minimum length 3)
  for (const word of words) {
    for (let i = 0; i < word.length; i++) {
      for (let j = i + 1; j <= word.length; j++) {
        const substring = word.slice(i, j);
        if (substring.length >= 3) {
          keywords.add(substring);
        }
      }
    }
  }

  // Generate substrings across words (minimum length 3)
  for (let i = 0; i < words.length; i++) {
    let phrase = words[i];
    if (phrase.length >= 3) keywords.add(phrase); // Add the individual word if length >= 3
    for (let j = i + 1; j < words.length; j++) {
      phrase += ` ${words[j]}`;
      if (phrase.length >= 3) keywords.add(phrase); // Add phrases if length >= 3
    }
  }

  return Array.from(keywords).slice(0, maxKeywords);
}

module.exports = generateSearchKeywords;
