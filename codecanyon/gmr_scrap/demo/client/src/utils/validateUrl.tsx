/**
 * Validate URL
 * @param url URL to validate
 * @returns boolean
 */
function validateUrl(url: string) {
  if (!url) return false
  const regex = /^https:\/\/maps\.app\.goo\.gl\/[\w-]+$/
  return regex.test(url)
}

export default validateUrl
