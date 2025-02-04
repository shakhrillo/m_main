#!/bin/sh

# Debugging: Check if file exists
if [ -f .env.firebase ]; then
    echo ".env.firebase found. Loading variables..."
    export $(grep -v '^#' .env.firebase | xargs)
else
    echo "Error: .env.firebase not found!"
    exit 1
fi

echo "Starting Firebase Emulator with project: $FIREBASE_PROJECT_ID"

firebase emulators:start --import=./data --export-on-exit --project "$FIREBASE_PROJECT_ID"
