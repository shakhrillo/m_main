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

  # Save the Firebase project ID
  gcloud firestore indexes composite list --project="$APP_FIREBASE_PROJECT_ID" --format=json > saved_indexes.json

  # Deploy the functions with a retry mechanism
  MAX_RETRIES=3
  for ((i=1; i<=MAX_RETRIES; i++)); do
    echo "Attempt $i of $MAX_RETRIES"

    # Delete all Cloud Functions sequentially if they exist
    FUNCTIONS=("processBuyCoins" "userTopUp" "processMachineWritten" "processContainerCreated" "processUserCreated" "processUserUpdated")
    for function in "${FUNCTIONS[@]}"; do
      if gcloud functions describe "$function" --region=us-central1 --project="$APP_FIREBASE_PROJECT_ID" &>/dev/null; then
        gcloud functions delete "$function" --region=us-central1 --project="$APP_FIREBASE_PROJECT_ID" --quiet || exit 1
        echo "Deleted function: $function"
      else
        echo "Function $function does not exist, skipping."
      fi
    done

    # Remove all indexes sequentially
    # gcloud firestore indexes composite list --project "$APP_FIREBASE_PROJECT_ID" --format json | jq -r '.indexes[] | .name' | while read -r index; do
    #   gcloud firestore indexes composite delete "$index" --project "$APP_FIREBASE_PROJECT_ID" --quiet || exit 1
    # done

    # Delete all Firestore collections (ensuring it completes before proceeding)
    # firebase firestore:delete --all-collections -r --force --project "$APP_FIREBASE_PROJECT_ID" || exit 1

    # Import the initial data into Firestore
    node firebase-deploy.js || exit 1

    # Deploy sequentially
    firebase deploy --only functions --project "$APP_FIREBASE_PROJECT_ID" || exit 1
    firebase deploy --only firestore:rules --project "$APP_FIREBASE_PROJECT_ID" || exit 1
    # firebase deploy --only firestore:indexes --project "$APP_FIREBASE_PROJECT_ID" --force || exit 1

    echo "Firebase initialization successful!"
    break  # Exit loop on success
  done
else
  # Set the Firebase service account credentials
  firebase emulators:start --project "demo-$APP_FIREBASE_PROJECT_ID" --import=./data --export-on-exit=./data || exit 1

  echo "Firebase initialization successful!"
fi
