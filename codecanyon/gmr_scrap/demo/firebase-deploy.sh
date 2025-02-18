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
    echo "Deployment attempt $i..."

    # Delete all Firestore indexes
    gcloud firestore indexes composite list --project="$APP_FIREBASE_PROJECT_ID" --format="value(name)" | xargs -I {} gcloud firestore indexes composite delete {} --project="$APP_FIREBASE_PROJECT_ID" --quiet

    # Delete all Cloud Functions
    FUNCTIONS=("processBuyCoins" "userTopUp" "processMachineWritten" "processContainerCreated" "processUserCreated")

    for function in "${FUNCTIONS[@]}"; do
      gcloud functions delete "$function" --region=us-central1 --project="$APP_FIREBASE_PROJECT_ID" --quiet
    done

    # Delete all Firestore collections
    firebase firestore:delete --all-collections -r --force --project "$APP_FIREBASE_PROJECT_ID"

    # Import the initial data into Firestore
    node firebase-deploy.js

    if firebase deploy --project "$APP_FIREBASE_PROJECT_ID"; then
      echo "Deployment succeeded!"
      break
    elif [ "$i" -eq "$MAX_RETRIES" ]; then
      echo "Deployment failed after $MAX_RETRIES attempts."
      exit 1
    else
      echo "Deployment failed, retrying in 10 seconds..."
      sleep 10
    fi
  done
else
  firebase emulators:start --project "demo-$APP_FIREBASE_PROJECT_ID" --import=./data --export-on-exit=./data
fi