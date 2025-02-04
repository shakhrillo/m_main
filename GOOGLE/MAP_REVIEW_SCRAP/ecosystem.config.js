module.exports = {
  apps: [
    {
      name: "map-review-scraper",
      script: "npm",
      args: "run start",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
