require("dotenv").config();
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");

// Initialize Firebase Admin
admin.initializeApp()

// User created
exports.processUserCreated = functions.auth.user().onCreate((user) => {
    console.log("User created", user);
    return null;
});
