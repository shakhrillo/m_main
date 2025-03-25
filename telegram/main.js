const fs = require('fs');
const { Builder, Browser, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const results = [];

function extractSalary(text) {
  const salaryRegex = /\$\d+\+?/; // Matches "$" followed by digits and an optional "+"
  const match = text.match(salaryRegex);
  return match ? match[0] : null; // Return the matched salary or null if not found
}

function extractUzbekPhoneNumber(text) {
  const phoneRegex = /\+998\s\d{2}\s\d{3}\s\d{2}\s\d{2}/; // Matches Uzbek phone numbers in the format +998 XX XXX XX XX
  const match = text.match(phoneRegex);
  return match ? match[0] : null; // Return the matched phone number or null if not found
}

function extractTelegramUsername(text) {
  const usernameRegex = /@\w+/; // Matches "@" followed by word characters (letters, digits, or underscores)
  const match = text.match(usernameRegex);
  return match ? match[0] : null; // Return the matched username or null if not found
}

function extractTechnologies(text) {
  const techRegex = /📚 Texnologiya:\s(.+)/; // Matches the "📚 Texnologiya:" label followed by the technologies
  const match = text.match(techRegex);
  return match ? match[1].trim() : null; // Return the matched technologies or null if not found
}

function getYesterdayFormatted() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const options = { month: 'long', day: 'numeric' };
  return yesterday.toLocaleDateString('en-US', options);
}

function saveAsJSON(filename, data) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

(async function example() {
  // Configure Chrome options for headless mode
  const options = new chrome.Options();
  options.addArguments('--headless', '--disable-gpu', '--no-sandbox');

  // Initialize the WebDriver
  let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();

  try {
    // Navigate to the Telegram channel
    await driver.get('https://t.me/s/UstozShogird');

    // Find all message elements
    const messages = await driver.findElements(By.className('tgme_widget_message_wrap'));
    console.log(`Number of messages found: ${messages.length}`);

    // Iterate through the messages and log their text content
    for (let i = 0; i < messages.length; i++) {
      try {
        const message = messages[i];

        // Scroll into view to ensure the message is visible
        await driver.executeScript('arguments[0].scrollIntoView()', message);

        // Wait for the message to load
        await driver.sleep(100);

        const text = await message.getText();

        if (!text || !text.includes('Ish joyi kerak')) {
          console.log(`Skipping message ${i + 1} as it has no text content`);
          continue;
        }

        // Extract salary, phone number, username, and technologies from the message
        const salary = extractSalary(text);
        const phone = extractUzbekPhoneNumber(text);
        const username = extractTelegramUsername(text);
        const technologies = extractTechnologies(text);

        const job = { salary, phone, username, technologies };
        results.push(job);
      } catch (err) {
        console.error(`Error processing message ${i + 1}:`, err.message);
      }
    }
  } catch (err) {
    console.error('An error occurred:', err.message);
  } finally {
    // Save the extracted data as a JSON file
    saveAsJSON('jobs.json', results);

    // Quit the WebDriver
    await driver.quit();
  }
})();