module.exports = {
  apps: [
    {
      name: "gmrs",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
