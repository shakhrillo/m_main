FROM node:18 AS build
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install --legacy-peer-deps --no-audit --progress=false
COPY . .
EXPOSE 4200

# Remove the .vite cache to avoid issues with the build
RUN rm -rf node_modules/.vite

RUN echo "Starting start script"

CMD ["npm", "run", "start"]
