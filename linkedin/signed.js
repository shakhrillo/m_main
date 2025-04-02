const fs = require('fs');
const { Builder, By, until } = require('selenium-webdriver');

const results = [];

async function setupDriver() {
    let options = new (require('selenium-webdriver/chrome').Options)();
    options.addArguments('--no-sandbox', '--disable-dev-shm-usage', '--headed');
    const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    // Add cookies for authentication
    const cookies = [
        { name: 'li_at', value: 'AQEDAUz1ug4FbWANAAABldT9PpoAAAGV-QnCmk0AKCetDKMCIIRok4XjYLue4rLX2GZMPekNris3zLpH05i8ozQOEnAAFG-Sv5JK0MP9ybZJ3uX-M8Z5vbzg3SLLu0WZRhhPHdD1IkmGWICf0uYEq6GM', domain: '.linkedin.com' }
    ];
    await driver.get('https://www.linkedin.com'); // Navigate to LinkedIn to set cookies
    for (const cookie of cookies) {
        await driver.manage().addCookie(cookie);
    }

    return driver;
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
        await driver.get(url);
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

