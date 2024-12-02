# Use a lightweight Node.js base image
FROM node:20

# Install required tools, dependencies for Chromium, and fonts
RUN apt-get update && apt-get install -y --no-install-recommends \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Chromium
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update && apt-get install -y --no-install-recommends google-chrome-stable \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set the path to the Chromium executable
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/google-chrome-stable"

# Set working directory
WORKDIR /usr/src/app

# log current directory
RUN pwd

COPY package*.json ./
RUN npm install

# Copy the application code
COPY . .

# Expose the app's port
# EXPOSE 3000

RUN node node_modules/puppeteer/install.mjs

# Default command
# CMD ["node", "info.js"]
