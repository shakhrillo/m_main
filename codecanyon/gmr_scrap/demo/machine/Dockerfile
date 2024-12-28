FROM alpine:3.19

# Install necessary packages and Chromium with additional fonts
RUN apk upgrade --no-cache --available && \
    apk add --no-cache \
      chromium chromium-swiftshader chromium-chromedriver \
      ttf-freefont font-noto-emoji \
      --repository=https://dl-cdn.alpinelinux.org/alpine/edge/community font-wqy-zenhei && \
    apk add --no-cache tini make gcc g++ python3 git nodejs npm yarn && \
    node -v && npm -v && chromium-browser --version

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# COPY firebase.json firebasekeys.json ../
COPY . .
