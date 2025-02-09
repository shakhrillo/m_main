FROM node:20 AS build
WORKDIR /usr/src/app

# Install required system dependencies
RUN apt-get update && apt-get install -y openjdk-17-jdk

RUN npm install -g firebase-tools

# Copy Firebase-related config files
COPY firebaseServiceAccount.json firebase.json firestore.indexes.json firestore.rules storage.rules ./

# Move to functions directory and install dependencies
WORKDIR /usr/src/app/functions
COPY functions/package.json ./
RUN npm install --legacy-peer-deps

# Copy the actual function source files
COPY functions/src ./

# Move back to the root directory
WORKDIR /usr/src/app

# Entrypoint command
CMD ["/usr/src/app/firebase.sh"]
