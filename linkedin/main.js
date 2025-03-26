const fs = require('fs');
const { Builder, By, until } = require('selenium-webdriver');

const results = [];

async function setupDriver() {
    let options = new (require('selenium-webdriver/chrome').Options)();
    options.addArguments('--no-sandbox', '--disable-dev-shm-usage', '--headless');
    return await new Builder().forBrowser('chrome').setChromeOptions(options).build();
}

async function openJobSearchPage(driver, url) {
    await driver.get(url);
    return await driver.wait(until.elementLocated(By.css('.jobs-search__results-list')), 5000);
}

async function processJobElement(driver, jobElement, index) {
    try {
        await driver.executeScript('arguments[0].scrollIntoView();', jobElement);
        await driver.sleep(1000);

        const baseCardFullLinks = await jobElement.findElements(By.css('.base-card__full-link'));
        if (baseCardFullLinks.length === 0) return;

        const href = await baseCardFullLinks[0].getAttribute('href');
        const jobUrl = href.split('?')[0];

        console.log(`Job ${index + 1}: ${jobUrl}`);

        await driver.executeScript(`window.open('${jobUrl}', '_blank');`);
        const tabs = await driver.getAllWindowHandles();
        await driver.switchTo().window(tabs[tabs.length - 1]);

        const jobDetails = await extractJobDetails(driver, jobUrl);
        results.push(jobDetails);

        await driver.close();
        await driver.switchTo().window(tabs[0]);
    } catch (error) {
        console.error(`Error processing job ${index + 1}:`, error.message);
    }
}

async function extractJobDetails(driver, jobUrl) {
    try {
        await driver.wait(until.elementLocated(By.css('button.show-more-less-html__button')), 10000);
    } catch {
        // do nothing
    }

    try {
        await driver.wait(until.elementLocated(By.css('.num-applicants__caption')), 10000);
    } catch {
        // do nothing
    }

    const topcardTitle = await getElementText(driver, 'h1.topcard__title');
    const orgNameLink = await getElementText(driver, 'a.topcard__org-name-link');
    const orgNameUrl = await getElementAttribute(driver, 'a.topcard__org-name-link', 'href');
    const numApplicantsCaption = await getElementText(driver, '.num-applicants__caption');

    const showMoreLessHtmlButtons = await driver.findElements(By.css('button.show-more-less-html__button'));
    if (showMoreLessHtmlButtons.length > 0) {
        await driver.executeScript('arguments[0].click();', showMoreLessHtmlButtons[0]);
    }

    const description = await getElementText(driver, '.show-more-less-html__markup');

    return {
        jobUrl,
        title: topcardTitle || 'N/A',
        orgName: orgNameLink ? orgNameLink.split('?')[0] : 'N/A',
        orgNameUrl: orgNameUrl || 'N/A',
        numApplicants: numApplicantsCaption || 'N/A',
        description: description || 'N/A'
    };
}

async function getElementText(driver, selector) {
    const elements = await driver.findElements(By.css(selector));
    return elements.length > 0 ? await elements[0].getText() : null;
}

async function getElementAttribute(driver, selector, attribute) {
    const elements = await driver.findElements(By.css(selector));
    return elements.length > 0 ? await elements[0].getAttribute(attribute) : null;
}

(async function main() {
    const driver = await setupDriver();
    try {
        const jobsSearchResultsList = await openJobSearchPage(driver, 'https://www.linkedin.com/jobs/search/?currentJobId=4091308465&geoId=101165590&keywords=angular&origin=JOB_SEARCH_PAGE_LOCATION_AUTOCOMPLETE&refresh=true&start=75');
        const liElements = await jobsSearchResultsList.findElements(By.css('li'));
        
        if (liElements.length === 0) return;

        let liElement = liElements[0];
        let i = 0;
        while (liElement) {
            await processJobElement(driver, liElement, i);
            try {
                liElement = await liElement.findElement(By.xpath('following-sibling::li'));
                // scroll to the next element
                await driver.executeScript('arguments[0].scrollIntoView();', liElement);
                await driver.sleep(
                    Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000 // Random sleep between 1 and 2 seconds
                );
            } catch {
                liElement = null; // No more sibling elements
                let retry = 0;
                const maxRetries = 10;
                while (retry < maxRetries) {
                    try {
                        // Scroll to bottom and click the show more button
                        await driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');
                        await driver.sleep(1000);
                        const showMoreButton = await driver.findElement(By.css('button.infinite-scroller__show-more-button'));
                        await driver.executeScript('arguments[0].scrollIntoView();', showMoreButton);
                        await driver.sleep(1000);
                        await driver.executeScript('arguments[0].click();', showMoreButton);
                        await driver.sleep(1000);
                        liElement = await jobsSearchResultsList.findElement(By.css('li:last-child'));
                        break;
                    } catch (error) {
                        retry++;
                        console.log(`Retry ${retry}/${maxRetries} to click the show more button...`);
                        if (retry === maxRetries) {
                            console.error('Max retries reached. Unable to click the show more button.');
                            liElement = null;
                            break;
                        }
                        const backoffTime = Math.pow(2, retry) * 100; // Exponential backoff
                        console.log(`Waiting for ${backoffTime}ms before retrying...`);
                        await driver.sleep(backoffTime);
                    }
                }
            }
            i++;
        }
    } catch (error) {
        console.error('Error during execution:', error.message);
    } finally {
        fs.writeFileSync('results.json', JSON.stringify(results, null, 2));
        await driver.quit();
    }
})();
