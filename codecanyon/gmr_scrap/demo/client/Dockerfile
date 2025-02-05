FROM node:18 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --legacy-peer-deps --no-audit --progress=false
COPY . .

# Set environment variable for production
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

# Conditionally run build or start based on NODE_ENV
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

EXPOSE 4200

# Set the default command based on NODE_ENV
CMD if [ "$NODE_ENV" = "production" ]; then npm run start; else npm run build; fi
