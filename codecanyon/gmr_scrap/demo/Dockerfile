FROM node:20 AS build
WORKDIR /usr/src/app

# Install OpenJDK 17 and Google Cloud SDK
RUN apt-get update && apt-get install -y openjdk-17-jdk apt-transport-https ca-certificates gnupg curl && \
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && \
    apt-get update && apt-get install -y google-cloud-cli

# Install Firebase CLI
RUN npm install -g firebase-tools

# Install project dependencies
COPY ./package.json .
RUN npm install --legacy-peer-deps

# Copy necessary project files
COPY ./firebase-deploy.js .
COPY ./initial-data.json .
COPY ./firebaseServiceAccount.json . 
COPY ./firebase.json .
COPY ./firestore.indexes.json .
COPY ./firestore.rules .
COPY ./storage.rules .
COPY ./functions ./functions
COPY ./.env ./functions/.env

# Install function dependencies
WORKDIR /usr/src/app/functions
RUN npm install --legacy-peer-deps

# Go back to the root project directory
WORKDIR /usr/src/app
