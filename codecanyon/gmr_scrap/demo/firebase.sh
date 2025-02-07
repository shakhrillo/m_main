#!/bin/bash

if [ "$APP_ENVIRONMENT" = "production" ]; then
    GOOGLE_APPLICATION_CREDENTIALS="/usr/src/app/firebaseServiceAccount.json" firebase deploy
    GOOGLE_APPLICATION_CREDENTIALS="/usr/src/app/firebaseServiceAccount.json" firebase deploy --project "$FIREBASE_PROJECT_ID"
    exit 1
else
    firebase emulators:start --import=./data --export-on-exit --project "$FIREBASE_PROJECT_ID"
fi
