module.exports = {
  launch: {
    headless: true,               // Traditional headless mode for lower resource usage
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-session-crashed-bubble',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ],  // Reduces GPU and security features for lower CPU usage
    defaultViewport: null,         // Prevents resizing issues, helps reduce memory overhead
    timeout: 30000,                // Sets a reasonable timeout of 30 seconds
  },
  goto: {
    waitUntil: 'networkidle2'
  },
  viewport: {
    width: 1080,
    height: 1024,
  },
  waitTime: 5000,
};
