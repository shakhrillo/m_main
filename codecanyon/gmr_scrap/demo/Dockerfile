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

ARG CHROME_VERSION=google-chrome-stable

RUN --mount=type=cache,target=/var/cache/apt \
    --mount=type=cache,target=/var/lib/apt \
    CHROME_VERSION=google-chrome-stable \
    wget -qO - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /usr/share/keyrings/google-linux-keyring.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/google-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update -qqy \
    && if echo "${CHROME_VERSION}" | grep -qE "google-chrome-stable[_|=][0-9]*"; then \
        CHROME_VERSION=$(echo "$CHROME_VERSION" | tr '=' '_') \
        && wget -qO google-chrome.deb "https://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/${CHROME_VERSION}_$(dpkg --print-architecture).deb" \
        && apt-get -qqy --no-install-recommends install --allow-downgrades ./google-chrome.deb \
        && rm -f google-chrome.deb; \
    else \
        apt-get -qqy --no-install-recommends install ${CHROME_VERSION}; \
    fi \
    && rm -f /etc/apt/sources.list.d/google-chrome.list \
    && rm -rf /var/lib/apt/lists/*

ARG CHROME_DRIVER_VERSION

RUN --mount=type=cache,target=/var/cache/apt \
    --mount=type=cache,target=/var/lib/apt \
    CHROME_VERSION=google-chrome-stable \
    CHROME_DRIVER_VERSION= \
    DRIVER_ARCH=$(if [ "$(dpkg --print-architecture)" = "amd64" ]; then echo "linux64"; else echo "linux-aarch64"; fi) \
    && if [ -n "$CHROME_DRIVER_VERSION" ]; then \
        CHROME_DRIVER_URL="https://storage.googleapis.com/chrome-for-testing-public/$CHROME_DRIVER_VERSION/${DRIVER_ARCH}/chromedriver-${DRIVER_ARCH}.zip"; \
    else \
        CHROME_MAJOR_VERSION=$(google-chrome --version | sed -E "s/.* ([0-9]+)(\.[0-9]+){3}.*/\1/") \
        && echo "Fetching ChromeDriver version for Chrome $CHROME_MAJOR_VERSION" \
        && CHROME_DRIVER_VERSION=$(wget -qO- https://googlechromelabs.github.io/chrome-for-testing/LATEST_RELEASE_$CHROME_MAJOR_VERSION | sed 's/\r$//') \
        && CHROME_DRIVER_URL="https://storage.googleapis.com/chrome-for-testing-public/$CHROME_DRIVER_VERSION/${DRIVER_ARCH}/chromedriver-${DRIVER_ARCH}.zip"; \
    fi \
    && echo "Using ChromeDriver from: $CHROME_DRIVER_URL" \
    && echo "Using ChromeDriver version: $CHROME_DRIVER_VERSION" \
    && wget --no-verbose -O /tmp/chromedriver_${DRIVER_ARCH}.zip $CHROME_DRIVER_URL \
    && rm -rf /opt/selenium/chromedriver \
    && unzip /tmp/chromedriver_${DRIVER_ARCH}.zip -d /opt/selenium \
    && rm /tmp/chromedriver_${DRIVER_ARCH}.zip \
    && mv /opt/selenium/chromedriver-${DRIVER_ARCH}/chromedriver /opt/selenium/chromedriver-$CHROME_DRIVER_VERSION \
    && chmod 755 /opt/selenium/chromedriver-$CHROME_DRIVER_VERSION \
    && ln -fs /opt/selenium/chromedriver-$CHROME_DRIVER_VERSION /usr/bin/chromedriver

# Ensure ChromeDriver is in PATH
ENV PATH="/opt/selenium:${PATH}"

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY selenium_machine/package*.json ./
RUN npm install

# Copy the Firebase configuration files
COPY firebase.json firebasekeys.json ./

# Copy the application code
COPY selenium_machine .
