module.exports = {
  launch: {
    headless: !true,               // Traditional headless mode for lower resource usage
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ],
    defaultViewport: null,         // Prevents resizing issues, helps reduce memory overhead
    timeout: 60000,                // Sets a reasonable timeout of 30 seconds
  },
  goto: {
    waitUntil: 'networkidle2'
  },
  viewport: {
    width: 600,
    height: 800
  },
  waitTime: 5000,
};
