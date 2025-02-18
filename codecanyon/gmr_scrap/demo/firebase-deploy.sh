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

    # List existing indexes and delete them
    EXISTING_INDEXES=$(gcloud firestore indexes composite list --project="$APP_FIREBASE_PROJECT_ID" --format="value(name)")
    for index in $EXISTING_INDEXES; do
      gcloud firestore indexes composite delete "$index" --project="$APP_FIREBASE_PROJECT_ID" --quiet || echo "Ignoring index deletion conflict"
    done

    # Delete all Cloud Functions
    FUNCTIONS=("processBuyCoins" "userTopUp" "processMachineWritten" "processContainerCreated" "processUserCreated")
    for function in "${FUNCTIONS[@]}"; do
      gcloud functions delete "$function" --region=us-central1 --project="$APP_FIREBASE_PROJECT_ID" --quiet
    done

    # Delete all Firestore collections
    firebase firestore:delete --all-collections -r --force --project "$APP_FIREBASE_PROJECT_ID"

    # Import the initial data into Firestore
    node firebase-deploy.js

    # Deploy the Firebase project
    firebase deploy --project "$APP_FIREBASE_PROJECT_ID"
    DEPLOY_STATUS=$?

    if [ $DEPLOY_STATUS -eq 0 ]; then
      echo "Deployment succeeded!"
      break
    elif [ $DEPLOY_STATUS -eq 409 ]; then
      echo "Error: Index already exists (HTTP 409). Retrying deployment..."
      sleep 10
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
