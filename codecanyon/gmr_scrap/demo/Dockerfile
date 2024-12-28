FROM node:18 AS build
WORKDIR /usr/src/app

# Install OpenJDK 17 (common version)
RUN apt-get update && apt-get install -y openjdk-17-jdk

# Copy Firebase configuration files
COPY firebase.json firestore.indexes.json firestore.rules package*.json storage.rules ./

# Copy the Service Account Key (make sure it is already present in the build context)
# COPY firebasekeys.json ./firebasekeys.json

# Install dependencies
RUN npm install

# Install Firebase CLI
RUN npm install -g firebase-tools

# Set environment variable for Google Cloud authentication using the service account key
# ENV GOOGLE_APPLICATION_CREDENTIALS=/usr/src/app/firebasekeys.json

# Copy and install functions dependencies
COPY functions ./functions
RUN cd functions && npm install --legacy-peer-deps && cd ..

EXPOSE 5001
EXPOSE 9100
EXPOSE 9199
EXPOSE 9099
EXPOSE 4000

# Run emulators
CMD ["firebase", "emulators:start", "--import=./data", "--export-on-exit", "--project", "fir-scrapp"]
