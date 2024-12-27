# Use an official Node.js LTS image as the base
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only the package files to leverage Docker's caching mechanism
COPY package*.json ./

# Install dependencies with specific flags to handle peer dependencies issues
RUN npm install --legacy-peer-deps --no-audit --progress=false

# Copy the server source code into the container
COPY . .

# Expose the application port
EXPOSE 1337

# Specify the default command to start the application
CMD ["npm", "start"]
