FROM node:20 AS build
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install --legacy-peer-deps --no-audit --progress=false
COPY . .