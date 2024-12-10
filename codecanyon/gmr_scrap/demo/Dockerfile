FROM alpine:3.19

# Installs latest Chromium package.
RUN apk upgrade --no-cache --available \
    && apk add --no-cache \
      chromium-swiftshader \
      ttf-freefont \
      font-noto-emoji \
    && apk add --no-cache \
      --repository=https://dl-cdn.alpinelinux.org/alpine/edge/community \
      font-wqy-zenhei

# USER root
RUN apk add --no-cache \
    tini make gcc g++ python3 git nodejs npm yarn

# chromedriver installation
RUN apk add --no-cache chromium-chromedriver

# USER chrome
# Verify installation
RUN node -v && npm -v

# Set working directory
WORKDIR /usr/src/app

ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/

# Autorun chrome headless
ENV CHROMIUM_FLAGS="--disable-software-rasterizer --disable-dev-shm-usage"

# Install dependencies
COPY selenium_machine/package*.json ./
RUN npm install

# Copy the Firebase configuration files
COPY firebase.json firebasekeys.json ./

# Copy the application code
COPY selenium_machine .
