/**
 * @fileoverview Firebase service for handling Firestore and Firebase Storage operations.
 *
 * Dependencies:
 * - `@google-cloud/storage` - For handling Firebase Storage operations.
 * - `firebase-admin` - For Firestore operations.
 * - `fs` - For file system operations.
 * - `path` - For path operations.
 *
 * Environment Variables:
 * - `NODE_ENV` - Specifies the environment mode.
 * - `FIREBASE_PROJECT_ID` - Specifies the Firebase project ID.
 * - `FIREBASE_URL` - Specifies the Firebase URL.
 * - `FIREBASE_KEYS_PATH` - Specifies the path to the Firebase keys file.
 *
 * Version History:
 * - 1.0.0: Initial release with Firestore and Firebase Storage operations.
 *
 * Author: Shakhrillo
 * License: CodeCanyon Standard License
 *
 * @version 1.0.0
 * @since 1.0.0
 * @license CodeCanyon Standard License
 */

"use strict";

// Import dependencies
const { Storage } = require("@google-cloud/storage");
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Constants
const environment = process.env.NODE_ENV || "development";
const firebaseProjectId = process.env.FIREBASE_PROJECT_ID;
const firebaseUrl = process.env.FIREBASE_URL || "127.0.0.1";
const firebasekeysPath = path.resolve(__dirname, "../firebasekeys.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  projectId: firebaseProjectId,
  ...(environment === "production" && {
    credential: admin.credential.cert(firebasekeysPath),
    storageBucket: `gs://${firebaseProjectId}.firebasestorage.app`,
  }),
});

// Initialize Firestore
const db = admin.firestore();
let serviceAccountJson = {};

// Load Firebase keys for development environment
if (environment === "development") {
  const serviceAccountPath = path.resolve(__dirname, "../firebase.json");

  if (fs.existsSync(serviceAccountPath)) {
    serviceAccountJson = JSON.parse(
      fs.readFileSync(serviceAccountPath, "utf8")
    );
  } else {
    throw new Error("Firebase keys file not found");
  }

  const firestoreEmulatorPort =
    serviceAccountJson.emulators?.firestore?.port || 9100;
  db.settings({ host: `${firebaseUrl}:${firestoreEmulatorPort}`, ssl: false });
}

/**
 * Uploads a file to Firebase Storage.
 *
 * @param {Buffer} fileBuffer - The file buffer to upload.
 * @param {string} destination - The destination path to upload the file.
 * @returns {Promise<string>} - The public URL of the uploaded file.
 */
async function uploadFile(fileBuffer, destination) {
  try {
    if (environment === "development") {
      const storageEmulatorPort =
        serviceAccountJson.emulators?.storage?.port || 9199;
      const storage = new Storage({
        apiEndpoint: `http://${firebaseUrl}:${storageEmulatorPort}`,
      });

      const bucket = storage.bucket(`${firebaseProjectId}.appspot.com`);
      const file = bucket.file(destination);

      await file.save(fileBuffer, { resumable: false, public: true });

      const publicUrl = file.publicUrl();
      return publicUrl.includes("localhost")
        ? publicUrl
        : publicUrl.replace(`${firebaseUrl}`, `localhost`);
    }

    const bucket = admin.storage().bucket();
    const file = bucket.file(destination);

    await new Promise((resolve, reject) => {
      const stream = file.createWriteStream({
        metadata: { contentType: "application/octet-stream" },
      });

      stream.on("error", reject);
      stream.on("finish", resolve);
      stream.end(fileBuffer);
    });

    const [url] = await file.getSignedUrl({
      action: "read",
      expires: "03-09-2491",
    });

    return url;
  } catch (error) {
    throw new Error(`Error uploading file: ${error.message}`);
  }
}

/**
 * Writes a large array of data to Firestore using batch writes.
 * Splits the data into chunks and writes them sequentially.
 *
 * @param {string} collectionPath - The Firestore collection path.
 * @param {Array<object>} data - The data to write.
 * @returns {Promise<void>}
 */
async function batchWriteLargeArray(collectionPath, data) {
  const collectionRef = db.collection(collectionPath);
  const chunkSize = 500;

  for (let i = 0; i < data.length; i += chunkSize) {
    const batch = db.batch();
    data.slice(i, i + chunkSize).forEach((doc) => {
      batch.set(collectionRef.doc(), doc);
    });
    await batch.commit(); // Commit each batch before starting the next
  }
}

/**
 * Fetches machine data from Firestore by tag.
 * @param {string} tag - The machine tag.
 * @returns {Promise<{
 *  url: string,
 *  limit: number,
 *  sortBy: string,
 *  extractVideoUrls: boolean,
 *  extractImageUrls: boolean,
 *  ownerResponse: boolean,
 *  createdAt: number,
 *  userId: string,
 *  reviewId: string
 * } | undefined>}
 */
async function getMachineData(tag) {
  const collectionRef = db.collection("containers");
  const doc = await collectionRef.doc(tag).get();
  const data = doc.data();
  const id = doc.id;
  return { ...data, id };
}

/**
 * Updates machine data in Firestore by tag.
 * @param {string} tag - The machine tag.
 * @param {object} data - The data to update.
 * @returns {Promise<void>}
 */
async function updateMachineData(tag, data) {
  return db.collection("containers").doc(tag).update(data);
}

module.exports = {
  uploadFile,
  batchWriteLargeArray,
  getMachineData,
  updateMachineData,
};
