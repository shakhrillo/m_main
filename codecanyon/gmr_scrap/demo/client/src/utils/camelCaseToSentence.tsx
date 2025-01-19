/**
 * Convert camel case string to sentence
 * @param text - The camel case string
 * @returns The sentence string
 */
export const camelCaseToSentence = (text: string): string => {
  console.log("text", text);
  if (!text) {
    return "";
  }

  return text.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
};
