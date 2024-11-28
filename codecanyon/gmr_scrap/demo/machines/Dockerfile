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

# Set working directory
WORKDIR /usr/src/app

# log current directory
RUN pwd

COPY package*.json ./
RUN npm install

# Copy the application code
COPY . .

# Expose the app's port
EXPOSE 3000

RUN node node_modules/puppeteer/install.mjs

# Default command
CMD ["node", "index.js"]
