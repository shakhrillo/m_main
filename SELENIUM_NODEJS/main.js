const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function openWebsite(url) {
  // const driver = await new Builder().forBrowser('chrome').build();
  const driver = new Builder()
    .usingServer('http://localhost:4444/wd/hub')
    .forBrowser('chrome') // Change to 'firefox' if using Firefox
    .build();

  try {
    await driver.get(url);
    // await driver.wait(until.titleIs('Google Maps'), 10000); // Adjust this condition based on the expected title
    // await driver.sleep(5000);

    // const allButtons = await driver.findElements(By.xpath("//button[@role='tab']"));
    const allButtons = await driver.findElements(By.xpath("//button"));
    console.log(allButtons.length);
    
    for (const button of allButtons) {
      const dataTabIndex = await button.getAttribute('data-tab-index');
      if (dataTabIndex === '1') {
        console.log('clicking');
        await button.click();
        await driver.sleep(2000);
        break;
      }
    }

    const allDivs = await driver.findElements(By.xpath("//div[@tabindex='-1']"));
    let parentElm = null;

    for (const div of allDivs) {
      const jslog = await div.getAttribute('jslog');
      if (jslog && jslog.includes('mutable:true')) {
        parentElm = div;
        break;
      }
    }

    if (!parentElm) {
      return [];
    }

    let scrollHeight = await parentElm.getAttribute("scrollHeight");
    await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight", parentElm);
    await driver.sleep(2000);

    while (true) {
      await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight", parentElm);
      await driver.sleep(2000);
      const newScrollHeight = await parentElm.getAttribute("scrollHeight");
      if (newScrollHeight === scrollHeight) {
        break;
      }
      scrollHeight = newScrollHeight;
    }

    const allButtonsAgain = await driver.findElements(By.xpath("//button"));
    for (const button of allButtonsAgain) {
      const jsaction = await button.getAttribute('jsaction');
      if (jsaction && jsaction.includes('review.showMorePhotos')) {
        await button.click();
        await driver.sleep(2000);
        break;
      }
    }

    const allDataReviewId = await driver.findElements(By.xpath("//div[@data-review-id]"));
    const filteredReviews = [];

    for (const element of allDataReviewId) {
      const childElements = await element.findElements(By.xpath(".//div[@data-review-id]"));
      if (childElements.length === 1) {
        filteredReviews.push(element);
      }
    }

    const imagesDir = path.join(__dirname, 'images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir);
    }

    const messages = [];

    for (const element of filteredReviews) {
      const extractedImageUrls = [];
      const savedImages = [];
      const buttons = await element.findElements(By.xpath(".//button"));

      for (const button of buttons) {
        const jsaction = await button.getAttribute('jsaction');
        if (jsaction && jsaction.includes('review.openPhoto')) {
          const style = await button.getAttribute('style');
          const imageUrl = style.split('url("')[1].split('");')[0];
          extractedImageUrls.push(imageUrl);
          await driver.sleep(2000);
        }
      }

      for (const imageUrl of extractedImageUrls) {
        const formattedUrl = imageUrl.split('=')[0] + '=w1000';
        const response = await axios.get(formattedUrl, { responseType: 'arraybuffer' });
        const imageName = `${Date.now()}.png`;
        fs.writeFileSync(path.join(imagesDir, imageName), response.data);
        savedImages.push(imageName);
      }

      const reviewMyened = await element.findElements(By.className("MyEned"));
      if (reviewMyened.length > 0) {
        let reviewMyenedText = await reviewMyened[0].getText();
        reviewMyenedText = reviewMyenedText.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
        messages.push({
          content: reviewMyenedText,
          images: extractedImageUrls,
        });
      }
    }

    return messages;
  } catch (error) {
    console.error(`Error in openWebsite: ${error}`);
    return [];
  } finally {
    await driver.quit();
  }
}

// Usage example
(async () => {
  const url = "https://www.google.com/maps/place/Turizm+Park+K%C4%B1r+Lokantas%C4%B1/@36.2064546,29.6004618,401m/data=!3m1!1e3!4m6!3m5!1s0x14c1d082c291c985:0xe87095392c61a1cf!8m2!3d36.2057239!4d29.6004691!16s%2Fg%2F11c0vy1564?entry=ttu&g_ep=EgoyMDI0MTAwOS4wIKXMDSoASAFQAw%3D%3D";
  const messages = await openWebsite(url);
  console.log(messages);
})();
