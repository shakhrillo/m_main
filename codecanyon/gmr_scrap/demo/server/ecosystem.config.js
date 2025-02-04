module.exports = {
  apps: [
    // Node.js API App
    {
      name: "node-api",
      script: "index.js", // Node.js app entry point
      instances: "max", // Number of instances (use 'max' for multi-core)
      exec_mode: "cluster", // Cluster mode for load balancing
      watch: false, // Automatically restart on file changes
      env: {
        NODE_ENV: "production", // Environment variable (production)
        PORT: 3000, // Set the port where the Node.js app runs
      },
    },
    // React App (for serving as static files through Nginx, not needed to run in PM2)
    // No need to add React app in PM2, since React is already served by Nginx.
  ],
};
