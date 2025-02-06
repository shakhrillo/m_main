FROM node:18 AS build
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install --legacy-peer-deps --no-audit --progress=false
COPY . .
EXPOSE 4200

RUN echo "Starting start script"

CMD ["npm", "run", "build"]
