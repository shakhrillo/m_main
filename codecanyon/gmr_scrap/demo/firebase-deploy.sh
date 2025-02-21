#!/bin/bash
if [ "$APP_ENVIRONMENT" = "production" ]; then
  # Remove package-lock.json if it exists
  if [ -f /usr/src/app/functions/package-lock.json ]; then
    rm -rf /usr/src/app/functions/package-lock.json
  fi

  # Set the Firebase service account credentials
  export GOOGLE_APPLICATION_CREDENTIALS="/usr/src/app/firebaseServiceAccount.json"

  # Authenticate gcloud with the service account
  gcloud auth activate-service-account --key-file="$GOOGLE_APPLICATION_CREDENTIALS"

  # Deploy the functions with a retry mechanism
  MAX_RETRIES=3
  for ((i=1; i<=MAX_RETRIES; i++)); do

    # Delete all Cloud Functions
    FUNCTIONS=("processBuyCoins" "userTopUp" "processMachineWritten" "processContainerCreated" "processUserCreated")
    for function in "${FUNCTIONS[@]}"; do
      gcloud functions delete "$function" --region=us-central1 --project="$APP_FIREBASE_PROJECT_ID" --quiet
    done

    # Remove all indexes
    gcloud firestore indexes composite list --project "$APP_FIREBASE_PROJECT_ID" --format json | jq -r '.indexes[] | .name' | while read -r index; do
      gcloud firestore indexes composite delete "$index" --project "$APP_FIREBASE_PROJECT_ID" --quiet
    done

    # Delete all Firestore collections
    firebase firestore:delete --all-collections -r --force --project "$APP_FIREBASE_PROJECT_ID"

    # Import the initial data into Firestore
    node firebase-deploy.js

    # Deploy
    firebase deploy --only functions --project "$APP_FIREBASE_PROJECT_ID"
    firebase deploy --only firestore:rules --project "$APP_FIREBASE_PROJECT_ID"
    firebase deploy --only firestore:indexes --project "$APP_FIREBASE_PROJECT_ID" --force

    # Echo success message
    echo "Firebase initialization successful!"
  done
else
  # Set the Firebase service account credentials
  firebase emulators:start --project "demo-$APP_FIREBASE_PROJECT_ID" --import=./data --export-on-exit=./data

  # Echo success message
  echo "Firebase initialization successful!"
fi
