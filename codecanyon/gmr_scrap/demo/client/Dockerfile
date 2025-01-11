# Use an official Node.js LTS image as the base for the build stage
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy only package.json and package-lock.json to leverage Docker layer caching
COPY package*.json ./

# Install dependencies with a specific flag for peer dependency issues
RUN npm install --legacy-peer-deps --no-audit --progress=false

# Copy the rest of the application source code
COPY . .

# Expose the default port for development
EXPOSE 4200

# Use a more explicit command to ensure the app starts as intended
CMD ["npm", "run", "start"]
