# Use an official Node.js runtime as the base image
FROM node:18

# Install dependencies for downloading and installing Google Chrome
RUN apt-get update && \
    apt-get install -y wget gnupg apt-transport-https ca-certificates && \
    wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    apt-get install -y ./google-chrome-stable_current_amd64.deb && \
    rm google-chrome-stable_current_amd64.deb && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create and set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables for Chrome
ENV CHROME_BIN=/usr/bin/google-chrome

# Define the command to run the app
CMD ["npm", "start"]
