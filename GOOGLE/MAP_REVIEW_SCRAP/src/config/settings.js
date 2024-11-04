module.exports = {
  launch: {
    headless: true,
    args: [
      '--no-sandbox',                // Bypasses sandbox, which can slow down VMs
      '--disable-setuid-sandbox',
      '--disable-gpu',                // No GPU in many VMs, so this saves overhead
      '--disable-dev-shm-usage',      // Avoids `/dev/shm` usage, which is limited on VMs
      '--single-process',             // Runs Chrome in a single process, useful for limited CPU
      '--no-zygote',                  // Speeds up launch by skipping zygote process
      '--disable-accelerated-2d-canvas', // Reduces CPU load by avoiding unnecessary canvas rendering
      '--no-first-run',               // Skips initial setup checks
      '--no-default-browser-check'    // Bypasses default browser check
    ],
    defaultViewport: null,
    timeout: 30000
  },
  goto: {
    waitUntil: 'networkidle2',
    timeout: 30000
  },
  viewport: {
    width: 600,
    height: 800
  },
  waitTime: 5000,
};
