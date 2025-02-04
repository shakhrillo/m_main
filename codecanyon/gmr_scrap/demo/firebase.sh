#!/bin/sh

# Load .env.main file
if [ -f .env.main ]; then
    echo ".env.main found. Loading variables..."
    set -o allexport
    while IFS= read -r line || [ -n "$line" ]; do
        if [ -n "$line" ] && [ "${line#"#"}" = "$line" ]; then
            eval "export $line"
        fi
    done < .env.main
    set +o allexport
else
    echo "Error: .env.main not found!"
    exit 1
fi

# Load .env.firebase file
if [ -f .env.firebase ]; then
    echo ".env.firebase found. Loading variables..."
    set -o allexport
    while IFS= read -r line || [ -n "$line" ]; do
        if [ -n "$line" ] && [ "${line#"#"}" = "$line" ]; then
            eval "export $line"
        fi
    done < .env.firebase
    set +o allexport
else
    echo "Error: .env.firebase not found!"
    exit 1
fi

# Check firebaseServiceAccount.json file exists
if [ ! -f "/usr/src/app/firebaseServiceAccount.json" ]; then
    echo "Error: firebaseServiceAccount.json not found!"
    exit 1
fi

echo "Starting Firebase Emulator with project: $FIREBASE_PROJECT_ID"

if [ "$APP_ENVIRONMENT" = "production" ]; then
    GOOGLE_APPLICATION_CREDENTIALS="/usr/src/app/firebaseServiceAccount.json" firebase deploy --project "$FIREBASE_PROJECT_ID"
    exit 1
else
    firebase emulators:start --import=./data --export-on-exit --project "$FIREBASE_PROJECT_ID"
fi
