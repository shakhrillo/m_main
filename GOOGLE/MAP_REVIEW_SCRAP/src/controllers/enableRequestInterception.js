/**
 * Enables request interception on a Puppeteer page and filters out specified request types.
 * 
 * @param {import('puppeteer').Page} pageInstance - The Puppeteer page instance to enable request interception on.
 * @param {Array<string>} requestPatternsToAbort - An array of URL patterns for requests to be aborted.
 * 
 * @example
 * const puppeteer = require('puppeteer');
 * (async () => {
 *   const browser = await puppeteer.launch();
 *   const page = await browser.newPage();
 *   const requestPatternsToAbort = [
 *     'googleusercontent',
 *     'preview',
 *     'analytics',
 *     'ads',
 *     'fonts',
 *     '/maps/vt'
 *   ];
 *   await enableRequestInterception(page, requestPatternsToAbort);
 *   await page.goto('https://example.com');
 *   await browser.close();
 * })();
 */
async function enableRequestInterception(pageInstance, requestPatternsToAbort) {
  // Enable request interception
  await pageInstance.setRequestInterception(true);

  // Filter out requests for specified patterns
  pageInstance.on('request', (request) => {
    if (requestPatternsToAbort.some((pattern) => request.url().includes(pattern))) {
      request.abort();
    } else {
      request.continue();
    }
  });
}

module.exports = enableRequestInterception;