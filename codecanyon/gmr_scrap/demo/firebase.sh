#!/bin/bash

# Ensure required environment variables are set
if [ -z "$APP_FIREBASE_PROJECT_ID" ]; then
    echo "Error: APP_FIREBASE_PROJECT_ID is not set"
    exit 1
fi

if [ "$APP_ENVIRONMENT" = "production" ]; then
    echo "Deploying to Firebase Production..."
    GOOGLE_APPLICATION_CREDENTIALS="/usr/src/app/firebaseServiceAccount.json" firebase deploy --project "$APP_FIREBASE_PROJECT_ID"
    
    # Exit with success
    exit 0
else
    # echo "Starting Firebase Emulator..."

    # cd /usr/src/app/functions
    # npm install --legacy-peer-deps
    # cd ../

    # if [ -d "./data" ]; then
    #     firebase emulators:start --import=./data --export-on-exit --project "demo-$APP_FIREBASE_PROJECT_ID"
    # else
    firebase emulators:start --project "demo-$APP_FIREBASE_PROJECT_ID"
    # fi
fi
