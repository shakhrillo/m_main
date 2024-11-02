module.exports = {
  launch: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ],
    defaultViewport: null,
    timeout: 30000
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
