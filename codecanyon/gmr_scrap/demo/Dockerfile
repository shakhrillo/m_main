FROM node:18 AS build
WORKDIR /usr/src/app

# Install OpenJDK 17 (common version)
RUN apt-get update && apt-get install -y openjdk-17-jdk

# Copy Firebase configuration files
# COPY .env.firestore .env.firestore
COPY .env.firebase .env.main firebaseServiceAccount.json firebase.json firestore.indexes.json firestore.rules package*.json storage.rules ./

# Copy the Service Account Key (make sure it is already present in the build context)
# COPY firebasekeys.json ./firebasekeys.json

# Install dependencies
RUN npm install --legacy-peer-deps

# Install Firebase CLI
RUN npm install -g firebase-tools

# Set environment variable for Google Cloud authentication using the service account key
# ENV GOOGLE_APPLICATION_CREDENTIALS=/usr/src/app/firebasekeys.json

# COPY data ./data

# Copy and install functions dependencies
COPY functions ./functions
# Delete node_modules to avoid conflicts
RUN rm -rf functions/node_modules
# Remove package-lock.json to avoid conflicts
RUN cd functions && npm install --legacy-peer-deps && cd ..


RUN rm package-lock.json
RUN rm functions/package-lock.json

# Copy env to workdir
# COPY .env.firebase .env

COPY firebase.sh /usr/src/app/firebase.sh
RUN chmod +x /usr/src/app/firebase.sh
CMD ["/usr/src/app/firebase.sh"]

# Run emulators
# CMD ["firebase", "emulators:start", "--import=./data", "--export-on-exit", "--project", "demo-${process.env.APP_ID}"]
