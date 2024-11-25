# Use a lightweight Node.js base image
FROM node:slim

# Install required tools, dependencies for Chromium, and fonts
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget gnupg ca-certificates \
    fonts-liberation \
    libasound2 libatk1.0-0 libcups2 libdbus-1-3 libx11-xcb1 \
    libxcomposite1 libxdamage1 libxrandr2 \
    libgbm-dev libgtk-3-0 libpango-1.0-0 libcairo2 \
    libnss3 libxtst6 xdg-utils \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Optional: Set environment variable to skip Chromium download if already present in `node_modules`
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json, then install dependencies
COPY package*.json ./
RUN npm install

# Copy the application code
COPY . .

# Expose the app's port
EXPOSE 3000

RUN node node_modules/puppeteer/install.mjs

# Default command
CMD ["node", "main.js"]
