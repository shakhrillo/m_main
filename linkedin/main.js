const fs = require('fs');
const { Builder, By, Key, until } = require('selenium-webdriver');

const results = [];

(async function example() {
    let options = new (require('selenium-webdriver/chrome').Options)();
    // options.addArguments('--headless'); // Run in headless mode
    options.addArguments('--no-sandbox'); // Recommended for running in containers
    options.addArguments('--disable-dev-shm-usage'); // Prevent crashes in Docker

    // open with console
    // options.addArguments('--auto-open-devtools-for-tabs');

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    function modalDismissButtonIsInteractable() {
        return new Promise((resolve, reject) => {
            driver.findElement(By.css('button.modal__dismiss')).then(modalDismissButton => {
                modalDismissButton.isDisplayed().then(isDisplayed => {
                    modalDismissButton.isEnabled().then(isEnabled => {
                        resolve(isDisplayed && isEnabled);
                    });
                });
            }).catch(error => {
                reject(error);
            });
        });
    }

    try {
        // Navigate to Google
        await driver.get('https://www.linkedin.com/jobs/search/?currentJobId=4091308465&geoId=101165590&keywords=angular&origin=JOB_SEARCH_PAGE_LOCATION_AUTOCOMPLETE&refresh=true&start=75');
        
        try {
            await modalDismissButtonIsInteractable();
        } catch (error) {
            console.error('Error interacting with modal dismiss button:', error.message);
        }

        // Wait for .jobs-search__results-list to be visible
        const jobsSearchResultsList = await driver.wait(until.elementLocated(By.css('.jobs-search__results-list')), 5000);
        const liElements = await jobsSearchResultsList.findElements(By.css('li'));
        console.log(`Number of jobs: ${liElements.length}`);
        
        for (let i = 0; i < liElements.length; i++) {
            // Wait for .base-card__full-link to be interactable
            const baseCardFullLink = await driver.wait(until.elementIsVisible(liElements[i].findElement(By.css('.base-card__full-link'))), 5000);
            const href = await baseCardFullLink.getAttribute('href');
            console.log(`Job ${i + 1}: ${href}`);

            // Open the job in a new tab
            await driver.executeScript(`window.open('${href}', '_blank');`);
            await driver.sleep(1000);

            // Switch to the new tab
            const tabs = await driver.getAllWindowHandles();
            console.log(`Number of tabs: ${tabs.length}`);
            await driver.switchTo().window(tabs[1]);

            await driver.sleep(1000);
            
            // h1.topcard__title
            const topcardTitle = await driver.findElement(By.css('h1.topcard__title')).getText();

            // a.topcard__org-name-link
            const topcardOrgNameLink = await driver.findElement(By.css('a.topcard__org-name-link')).getText();
            const orgNameUrl = await driver.findElement(By.css('a.topcard__org-name-link')).getAttribute('href');

            // span.num-applicants__caption
            const numApplicantsCaption = await driver.findElement(By.css('span.num-applicants__caption')).getText();

            // button.show-more-less-html__button
            const showMoreLessHtmlButton = await driver.findElement(By.css('button.show-more-less-html__button'));
            await driver.executeScript('arguments[0].click();', showMoreLessHtmlButton);
            
            await driver.sleep(1000);

            // .show-more-less-html__markup
            const showMoreLessHtmlMarkup = await driver.findElement(By.css('.show-more-less-html__markup')).getText();

            results.push({
                title: topcardTitle,
                orgName: topcardOrgNameLink,
                orgNameUrl,
                numApplicants: numApplicantsCaption,
                description: showMoreLessHtmlMarkup
            });
            
            // Close the tab
            await driver.close();
            await driver.switchTo().window(tabs[0]);
        }

        // wait 10s
        await driver.sleep(100000);
    } finally {
        // Close the browser
        await driver.quit();

        // save results to a file
        fs.writeFileSync('results.json', JSON.stringify(results, null, 2));
    }
})();
