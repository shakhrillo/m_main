Firebase emulators can be started by running `firebase emulators:start` in the root directory of the project.

<!-- firebase emulators:start --import=./data --export-on-exit=./data --project "demo-gmrs-6638f" -->
```bash
firebase emulators:start --import=./data --export-on-exit=./data --project "$FIREBASE_PROJECT_ID"
```