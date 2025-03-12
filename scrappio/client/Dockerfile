FROM node:20 AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Ensure a clean npm cache
RUN npm cache clean --force

# Install dependencies with strict engine check disabled
RUN npm install --legacy-peer-deps --no-audit --progress=false --engine-strict=false

# Copy the rest of the app files
COPY . .