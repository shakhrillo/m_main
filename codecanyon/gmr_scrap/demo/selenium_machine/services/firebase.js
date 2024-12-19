const { Storage } = require("@google-cloud/storage");
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const environment = process.env.NODE_ENV || "development";
const firebaseProjectId = process.env.FIREBASE_PROJECT_ID;
const firebaseUrl = process.env.FIREBASE_URL || "127.0.0.1";

console.log("firebaseUrl:", firebaseUrl);
console.log("Firebase environment:", environment);

const firebasekeysPath = path.resolve(__dirname, "../../firebasekeys.json");

console.log("Firebase project ID:", firebaseProjectId);

admin.initializeApp({
  projectId: firebaseProjectId,
  ...(environment === "production" && {
    credential: admin.credential.cert(firebasekeysPath),
    storageBucket: `gs://${firebaseProjectId}.firebasestorage.app`,
  }),
});

const db = admin.firestore();
const auth = admin.auth();

let firestoreEmulatorPort;
let storageEmulatorPort;
let authEmulatorPort;
if (environment === "development") {
  const serviceAccountPath = path.resolve(__dirname, "../../firebase.json");
  let serviceAccountJson = {};

  if (fs.existsSync(serviceAccountPath)) {
    serviceAccountJson = JSON.parse(
      fs.readFileSync(serviceAccountPath, "utf8")
    );
  } else {
    console.log("\x1b[31m%s\x1b[0m", "Firebase service account file not found");
  }

  firestoreEmulatorPort = serviceAccountJson.emulators?.firestore?.port || 9100;
  storageEmulatorPort = serviceAccountJson.emulators?.storage?.port || 9199;
  authEmulatorPort = serviceAccountJson.emulators?.auth?.port || 9099;

  db.settings({ host: `${firebaseUrl}:${firestoreEmulatorPort}`, ssl: false });
}

const uploadFile = async (fileBuffer, destination) => {
  if (process.env.NODE_ENV === "development") {
    const storage = new Storage({
      apiEndpoint: `http://${firebaseUrl}:${storageEmulatorPort}`,
    });

    const bucket = storage.bucket(`${firebaseProjectId}.appspot.com`);
    const file = bucket.file(destination);

    try {
      await file.save(fileBuffer, {
        resumable: false,
        public: "yes",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }

    const publicUrl = file.publicUrl() || "";
    if (publicUrl.includes("localhost")) {
      return publicUrl;
    }

    return publicUrl.replace(`${firebaseUrl}`, `localhost`);
  } else {
    return new Promise((resolve, reject) => {
      const bucket = admin.storage().bucket();
      const file = bucket.file(destination);
      const stream = file.createWriteStream({
        metadata: {
          contentType: "application/octet-stream",
        },
      });

      stream.on("error", (error) => {
        console.error("Error uploading file:", error);
        reject(error);
      });

      stream.on("finish", async () => {
        console.log(`${destination} uploaded to Firebase Storage`);

        try {
          const [url] = await file.getSignedUrl({
            action: "read",
            expires: "03-09-2491",
          });
          resolve(url);
        } catch (error) {
          console.error("Error generating signed URL:", error);
          reject(error);
        }
      });

      stream.end(fileBuffer);
    });
  }
};

async function batchWriteLargeArray(collectionPath, data) {
  let collectionRef = db.collection(collectionPath);
  // empty collection
  const query = await collectionRef.get();
  for (const doc of query.docs) {
    await doc.ref.delete();
  }
  console.log("Collection emptied");

  const chunkSize = 500;
  const batches = [];

  for (let i = 0; i < data.length; i += chunkSize) {
    const batch = db.batch();
    const chunk = data.slice(i, i + chunkSize);

    chunk.forEach((doc) => {
      const docRef = collectionRef.doc();
      batch.set(docRef, doc);
    });

    batches.push(batch.commit()); // store each batch commit promise
  }

  // Wait for all batches to commit sequentially
  for (const batch of batches) {
    await batch;
  }
}

async function getMachineData(tag) {
  const ref = db.collection("machines").doc(tag);
  const snapshot = await ref.get();
  const data = snapshot.data();

  return data;
}

async function updateMachineData(tag, data) {
  const ref = db.collection("machines").doc(tag);
  await ref.update(data);
}

module.exports = {
  admin,
  db,
  getMachineData,
  updateMachineData,
  uploadFile,
  batchWriteLargeArray,
};
