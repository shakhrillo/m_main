const fs = require('fs');
const { Builder, By, until } = require('selenium-webdriver');

const results = [];

async function setupDriver() {
    let options = new (require('selenium-webdriver/chrome').Options)();
    options.addArguments('--no-sandbox', '--disable-dev-shm-usage', '--headed');
    const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    // Add cookies for authentication
    // const cookies = [
    //     { name: 'li_at', value: 'AQEDAUz1ug4FbWANAAABldT9PpoAAAGV-QnCmk0AKCetDKMCIIRok4XjYLue4rLX2GZMPekNris3zLpH05i8ozQOEnAAFG-Sv5JK0MP9ybZJ3uX-M8Z5vbzg3SLLu0WZRhhPHdD1IkmGWICf0uYEq6GM', domain: '.linkedin.com' }
    // ];
    // await driver.get('https://www.linkedin.com'); // Navigate to LinkedIn to set cookies
    // for (const cookie of cookies) {
    //     await driver.manage().addCookie(cookie);
    // }

    return driver;
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
        console.log(`l`, tabs.length);
        console.log(`Job tab: ${tabs[tabs.length - 1]}`);
        const _title = await driver.getTitle();
        console.log(`_title: ${_title}`);

        const jobDetails = await extractJobDetails(driver, jobUrl);

        // await driver.sleep(1000);
        
        // await driver.close();
        // await driver.switchTo().window(tabs[0]);
        
        // Extract organization details
        await driver.executeScript(`window.open('${jobDetails.orgNameUrl}', '_blank');`);
        const orgTabs = await driver.getAllWindowHandles();
        await driver.switchTo().window(orgTabs[orgTabs.length - 1]);
        console.log(`l`, orgTabs.length);
        console.log(`Org tab: ${orgTabs[orgTabs.length - 1]}`);
        const title = await driver.getTitle();
        console.log(`title: ${title}`);
        await driver.sleep(1000);

        jobDetails.orgDetails = await extractOrgDetails(driver);

        // await driver.sleep(1000)
        for (let i = 0; i < orgTabs.length; i++) {
            await driver.switchTo().window(orgTabs[i]);
            if (i > 0) {
                await driver.close();
            }
        }

        results.push(jobDetails);

        return jobUrl;
    } catch (error) {
        console.error(`Error processing job ${index + 1}:`, error.message);
        return null;
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

async function extractOrgDetails(driver) {
    let element = await driver.findElement(By.css('a[data-tracking-control-name="about_website"]'));
    let tgex = await element.getText();
    console.log(`element: ${tgex}`);
        
    const orgWebsiteUrl = await getElementText(driver, 'a[data-tracking-control-name="about_website"]');
    const orgIndustry = await getElementText(driver, 'div[data-test-id="about-us__industry"]');
    const orgSize = await getElementText(driver, 'div[data-test-id="about-us__size"]');
    const orgHeadquarters = await getElementText(driver, 'div[data-test-id="about-us__headquarters"]');
    const orgType = await getElementText(driver, 'div[data-test-id="about-us__organizationType"]');
    const orgFoundedOn = await getElementText(driver, 'div[data-test-id="about-us__foundedOn"]');
    const orgSpecialties = await getElementText(driver, 'div[data-test-id="about-us__specialties"]');
    // const orgAddress = await getElementText('address-0', 'id');

    console.log(`orgWebsiteUrl: ${orgWebsiteUrl}`);

    return {
        orgWebsiteUrl,
        orgIndustry,
        orgSize,
        orgHeadquarters,
        orgType,
        orgFoundedOn,
        orgSpecialties,
        // orgAddress
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

async function scrapeLinkedInJobs({
    geoId = 101165590,
    keywords = 'angular',
    limit = 5
}) {
    const driver = await setupDriver();
    try {
        const url = new URL('https://www.linkedin.com/jobs/search/');
        url.searchParams.append('geoId', geoId);
        url.searchParams.append('keywords', keywords);
        const jobsSearchResultsList = await openJobSearchPage(driver, url.href);
        const liElements = await jobsSearchResultsList.findElements(By.css('li'));
        
        if (liElements.length === 0) return;
        
        let liElement = liElements[liElements.length - 1];
        let i = 0;
        let lastCheckedUrl = '';
        while (liElement) {
            const checkedUrl = await processJobElement(driver, liElement, i);

            try {
                liElement = await liElement.findElement(By.xpath('following-sibling::li')); // get the next sibling element
                // scroll to the next element
                await driver.executeScript('arguments[0].scrollIntoView();', liElement);
                await driver.sleep(
                    Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000 // Random sleep between 1 and 2 seconds
                );
            } catch {
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
                        // liElement = await liElement.findElement(By.xpath('following-sibling::li')); // get the next sibling element
                        try {
                            liElement = await liElement.findElement(By.xpath('following-sibling::li'));
                        } catch {
                            liElement = null;
                        }
                        console.log('Clicked the show more button successfully.');
                        break;
                    } catch (error) {
                        console.error(error);
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
            lastCheckedUrl = checkedUrl;

            if(i === limit) {
                break;
            }
        }
    } catch (error) {
        console.error('Error during execution:', error.message);
    } finally {
        fs.writeFileSync('results.json', JSON.stringify(results, null, 2));
        await driver.quit();
    }
}

try {
    scrapeLinkedInJobs({
        geoId: 101165590, // Geo ID for United Kingdom (UK)
        keywords: 'angular', // Search keyword
        limit: 2 // Number of jobs to scrape
    });
} catch (error) {
    console.error('Error during execution:', error.message);
} finally {
    console.log('Execution completed.');
}

