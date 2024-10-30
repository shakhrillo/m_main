import puppeteer from 'puppeteer';
import functions from '@google-cloud/functions-framework';
const protobuf = require('protobufjs');

async function decodeFirestoreData(DocumentEventData, data) {
  console.log('Decoding data...');
  return DocumentEventData.decode(data);
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function beforeTheLastChildInsideParentChildren(parent) {
  let elements = [];
  try {
    const parentChildren = await parent.$$(':scope > *');
    const beforeTheLastChild = parentChildren[parentChildren.length - 2];
    const beforeTheLastChildChildren = await beforeTheLastChild.$$(':scope > *');

    elements = await Promise.all(beforeTheLastChildChildren.map(async (child) => {
      const elementId = await child.evaluate(el => el.getAttribute('data-review-id'));
      if (elementId) {
        return {
          id: elementId,
          element: child,
          text: await child.evaluate(el => el.textContent),
        };
      }
    })).then(results => results.filter(Boolean));

  } catch (error) {
    console.error("Error finding elements:", error);
  }

  return elements;
}

functions.cloudEvent('puppeteertest', async cloudEvent => {
  console.log(`Function triggered by event on: ${cloudEvent.source}`);
  console.log(`Event type: ${cloudEvent.type}`);

  const DocumentEventData = await loadProto();
  const firestoreReceived = await decodeFirestoreData(DocumentEventData, cloudEvent.data);

  console.log('\nOld value:', JSON.stringify(firestoreReceived.oldValue, null, 2));
  console.log('\nNew value:', JSON.stringify(firestoreReceived.value, null, 2));

  const pushId = firestoreReceived.value.name.split('/').pop();
  console.log('Push ID:', pushId);

  let reviewURL = firestoreReceived.value.fields.url.stringValue;
  console.log('Review URL:', reviewURL);

  let uid = firestoreReceived.value.fields.uid.stringValue;
  console.log('UID:', uid);

  const browser = await puppeteer.launch({ headless: 'new', timeout: 0});
  const page = await browser.newPage();

  console.log('Opening page...');

  // Navigate the page to a URL
  await page.goto('https://maps.app.goo.gl/xjwvxFpSWXXWzMN5A', { waitUntil: 'networkidle2' });

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  await page.waitForSelector('button[role="tab"][aria-selected="false"]');
  await wait(2000);

  const title = await page.title();
  console.log('Page title:', title);
  const allButtons = await page.$$('button[role="tab"][aria-selected="false"]');
  console.log('All buttons:', allButtons.length);
  for (const button of allButtons) {
    const tabText = await button.evaluate(el => el.textContent);
    if (tabText.toLowerCase().includes('reviews')) {
      console.log('Opening review tab');
      await button.click();
      break;
    }
  }

  const vyucnb = await page.$$('.vyucnb');
  let parentElm;

  if (vyucnb.length) {
    // Get the parent element using evaluateHandle
    parentElm = await page.evaluateHandle(el => el.parentElement, vyucnb[0]);
  }

  let isScrollFinished = false;
  let allElements = [];
  while (!isScrollFinished) {

    const elements = await beforeTheLastChildInsideParentChildren(parentElm);
    allElements.push(...elements);

    let lastChild = await parentElm.evaluateHandle(el => el.lastElementChild);
    const lastChildChildren = await lastChild.evaluate(el => Array.from(el.children));
    if (lastChildChildren.length === 0) {
      isScrollFinished = true;
      break;
    }

    await page.evaluate(el => el.scrollIntoView(), lastChild);
  }

  // Filter duplicate elements by id
  const uniqueElements = allElements.filter((element, index, self) =>
    index === self.findIndex((t) => (
      t.id === element.id
    ))
  );

  console.log('Unique elements:', uniqueElements.length);
  console.log('All elements:', allElements.length);
  console.log('First text:', uniqueElements[0].text);

  // Close the browser
  await browser.close();
});