module.exports = {
  apps: [
    {
      name: "map-review-scraper",
      script: "npm",
      args: "run start",
      watch: true,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
