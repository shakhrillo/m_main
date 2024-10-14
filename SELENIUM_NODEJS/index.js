const { Builder, By, until } = require('selenium-webdriver');

// Create a new instance of the Chrome driver
async function runTest() {
    // Connect to the Selenium server
    const driver = new Builder()
        .usingServer('http://localhost:4444/wd/hub')
        .forBrowser('chrome') // Change to 'firefox' if using Firefox
        .build();

    try {
        // Navigate to a website
        await driver.get("https://www.google.com/maps/place/Xo%CA%BBja+Peshku+jo'me+masjidi+(+%D0%BC%D0%B5%D1%87%D0%B5%D1%82%D1%8C)/@40.0400878,64.3845308,14146m/data=!3m1!1e3!4m6!3m5!1s0x3f5a9d89e8e223d9:0x13b6e6d2cc99685!8m2!3d40.0204137!4d64.328199!16s%2Fg%2F11s7c3l2t9?entry=ttu&g_ep=EgoyMDI0MTAwOS4wIKXMDSoASAFQAw%3D%3D");
        
        // const title = await driver.getTitle();
        // console.log('Page Title:', title);
    } finally {
        // Close the browser
        await driver.quit();
    }
}

runTest().catch(console.error);
