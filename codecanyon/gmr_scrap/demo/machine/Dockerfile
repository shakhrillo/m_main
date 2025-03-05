FROM alpine:3.19

RUN apk upgrade --no-cache --available && \
    apk add --no-cache \
    chromium \
    chromium-swiftshader \
    chromium-chromedriver \
    ttf-freefont font-noto-emoji \
    font-wqy-zenhei \
    tini make gcc g++ python3 git nodejs npm yarn abseil-cpp

RUN node -v && npm -v && chromium-browser --version

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

COPY . .
CMD ["npm", "run", "init"]
