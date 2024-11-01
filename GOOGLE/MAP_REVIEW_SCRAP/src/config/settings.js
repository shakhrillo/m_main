module.exports = {
  launch: {
    headless: true,               // Traditional headless mode for lower resource usage
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'

      // '--auto-open-devtools-for-tabs'
    ],
    defaultViewport: null,         // Prevents resizing issues, helps reduce memory overhead
    timeout: 30000,                // Sets a reasonable timeout of 30 seconds
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
