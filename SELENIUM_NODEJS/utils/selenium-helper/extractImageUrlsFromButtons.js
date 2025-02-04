const findElementsByXPath = require('./findElementsByXPath');
const getElementAttributes = require('./getElementAttributes');

async function extractImageUrlsFromButtons(element) {
  const extractedImageUrls = [];
  const allButtons = await findElementsByXPath(element, ".//button");
  const attributesToExtract = ['jsaction', 'style'];

  for (const button of allButtons) {
    const { 'jsaction': jsaction, 'style': style } = await getElementAttributes(button, attributesToExtract);
    if (jsaction && jsaction.includes('review.openPhoto')) {
      let imageUrl = style.split('url("')[1]?.split('");')[0];

      if (imageUrl) {
        imageUrl = imageUrl.split('=')[0] + '=w1200';
        extractedImageUrls.push(imageUrl);
      }
    }
  }

  return extractedImageUrls;
}

module.exports = extractImageUrlsFromButtons;