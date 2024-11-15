const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto("https://google.com");
  const title = await page.title();
  console.log("Title:", title);
  // Do other things...
  await browser.close();
})();
