# Description: Dockerfile for the server
# Author: Shakhrillo

FROM node:18 AS build

WORKDIR /usr/src/app
COPY . .
RUN npm install --legacy-peer-deps --no-audit --progress=false

CMD ["npm", "run", "start"]
