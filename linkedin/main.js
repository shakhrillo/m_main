const fs = require('fs');
const { Builder, By, Key, until } = require('selenium-webdriver');

const results = [];

(async function example() {
    let options = new (require('selenium-webdriver/chrome').Options)();
    options.addArguments('--no-sandbox', '--disable-dev-shm-usage', '--headless');

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    async function modalDismissButtonIsInteractable() {
        try {
            const modalDismissButtons = await driver.findElements(By.css('button.modal__dismiss'));
            if (modalDismissButtons.length > 0) {
                const modalDismissButton = modalDismissButtons[0];
                const isDisplayed = await modalDismissButton.isDisplayed();
                const isEnabled = await modalDismissButton.isEnabled();
                return isDisplayed && isEnabled;
            }
            return false;
        } catch {
            return false;
        }
    }

    try {
        await driver.get('https://www.linkedin.com/jobs/search/?currentJobId=4091308465&geoId=101165590&keywords=angular&origin=JOB_SEARCH_PAGE_LOCATION_AUTOCOMPLETE&refresh=true&start=75');

        // if (await modalDismissButtonIsInteractable()) {
        //     const modalDismissButton = (await driver.findElements(By.css('button.modal__dismiss')))[0];
        //     await modalDismissButton.click();
        // }

        const jobsSearchResultsList = await driver.wait(until.elementLocated(By.css('.jobs-search__results-list')), 5000);
        const liElements = await jobsSearchResultsList.findElements(By.css('li'));

        
        for (let i = 0; i < liElements.length; i++) {
            // Scroll to the element
            await driver.executeScript('arguments[0].scrollIntoView();', liElements[i]);
            await driver.sleep(1000);

            if (i > 5) break;

            try {
                const baseCardFullLinks = await liElements[i].findElements(By.css('.base-card__full-link'));
                if (baseCardFullLinks.length === 0) continue;

                const href = await baseCardFullLinks[0].getAttribute('href');
                console.log(`Job ${i + 1}: ${href}`);
                const jobUrl = href.split('?')[0];

                await driver.executeScript(`window.open('${jobUrl}', '_blank');`);
                const tabs = await driver.getAllWindowHandles();
                await driver.switchTo().window(tabs[tabs.length - 1]);

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

                const topcardTitles = await driver.findElements(By.css('h1.topcard__title'));
                const topcardTitle = topcardTitles.length > 0 ? await topcardTitles[0].getText() : 'N/A';

                const orgNameLinks = await driver.findElements(By.css('a.topcard__org-name-link'));
                const topcardOrgNameLink = orgNameLinks.length > 0 ? await orgNameLinks[0].getText() : 'N/A';
                const orgNameUrl = orgNameLinks.length > 0 ? await orgNameLinks[0].getAttribute('href') : 'N/A';

                const numApplicantsCaptions = await driver.findElements(By.css('.num-applicants__caption'));
                const numApplicantsCaption = numApplicantsCaptions.length > 0 ? await numApplicantsCaptions[0].getText() : 'N/A';

                const showMoreLessHtmlButtons = await driver.findElements(By.css('button.show-more-less-html__button'));
                if (showMoreLessHtmlButtons.length > 0) {
                    await driver.executeScript('arguments[0].click();', showMoreLessHtmlButtons[0]);
                }

                const showMoreLessHtmlMarkups = await driver.findElements(By.css('.show-more-less-html__markup'));
                const showMoreLessHtmlMarkup = showMoreLessHtmlMarkups.length > 0 ? await showMoreLessHtmlMarkups[0].getText() : 'N/A';

                results.push({
                    jobUrl,
                    title: topcardTitle,
                    orgName: topcardOrgNameLink.split('?')[0],
                    orgNameUrl,
                    numApplicants: numApplicantsCaption,
                    description: showMoreLessHtmlMarkup
                });

                await driver.close();
                await driver.switchTo().window(tabs[0]);
            } catch (error) {
                console.error(`Error processing job ${i + 1}:`, error.message);
            }
        }

        fs.writeFileSync('results.json', JSON.stringify(results, null, 2));
    } catch (error) {
        console.error('Error during execution:', error.message);
    } finally {
        await driver.quit();
    }
})();
