// import puppeteer from 'puppeteer';
// import functions from '@google-cloud/functions-framework';
const puppeteer = require('puppeteer');
const functions = require('@google-cloud/functions-framework');

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

functions.cloudEvent('pupgo', async cloudEvent => {
  console.log(`Function triggered by event on: ${cloudEvent.source}`);
  console.log(`Event type: ${cloudEvent.type}`);

  const browser = await puppeteer.launch({ headless: 'new', timeout: 0 });
  const page = await browser.newPage();

  console.log('Opening page...');
  await page.goto('https://maps.app.goo.gl/xjwvxFpSWXXWzMN5A', { waitUntil: 'networkidle2' });
  await page.setViewport({ width: 1080, height: 1024 });
  await page.waitForSelector('button[role="tab"][aria-selected="false"]');
  await wait(2000);

  const title = await page.title();
  console.log('Page title:', title);
  const allButtons = await page.$$('button[role="tab"][aria-selected="false"]');
  for (const button of allButtons) {
    const tabText = await button.evaluate(el => el.textContent);
    if (tabText.toLowerCase().includes('reviews')) {
      console.log('Opening review tab');
      await button.click();
      break;
    }
  }

  await wait(5000);

  const vyucnb = await page.$$('.vyucnb');
  let parentElm;

  if (vyucnb.length) {
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

  const uniqueElements = allElements.filter((element, index, self) =>
    index === self.findIndex((t) => (
      t.id === element.id
    ))
  );

  console.log('Unique elements:', uniqueElements.length);
  console.log('All elements:', allElements.length);
  console.log('First text:', uniqueElements[0].text);

  await browser.close();
});