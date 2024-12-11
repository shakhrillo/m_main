const { Storage } = require("@google-cloud/storage");
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const isTest = process.env.NODE_ENV === "test";
let firebaseUrl = "localhost";
if (!isTest) {
  firebaseUrl = "host.docker.internal";
}

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
if (!FIREBASE_PROJECT_ID) {
  throw new Error("FIREBASE_PROJECT_ID not found in environment variables");
}

const serviceAccountPath = path.resolve(
  __dirname,
  isTest ? "../../firebase.json" : "../firebase.json"
);
if (!fs.existsSync(serviceAccountPath)) {
  throw new Error("firebase.json not found");
}

const firebasekeysPath = path.resolve(
  __dirname,
  isTest ? "../../firebasekeys.json" : "../firebasekeys.json"
);
if (
  process.env.NODE_ENV !== "development" &&
  !fs.existsSync(firebasekeysPath)
) {
  throw new Error("firebasekeys.json not found");
}

admin.initializeApp(
  process.env.NODE_ENV === "development" || isTest
    ? { projectId: FIREBASE_PROJECT_ID }
    : {
        credential: admin.credential.cert(firebasekeysPath),
        storageBucket: process.env.STORAGE_BUCKET,
        projectId: FIREBASE_PROJECT_ID,
      }
);

const db = admin.firestore();

if (process.env.NODE_ENV === "development" || isTest) {
  const serviceAccountJson = JSON.parse(
    fs.readFileSync(serviceAccountPath, "utf8")
  );
  const firestorePort = serviceAccountJson.emulators?.firestore?.port;
  if (firestorePort) {
    db.settings({ host: `${firebaseUrl}:${firestorePort}`, ssl: false });
  } else {
    console.warn("Firestore emulator port not found in firebase.json");
  }
}

const uploadFile = async (fileBuffer, destination) => {
  if (process.env.NODE_ENV === "development") {
    const serviceAccountJson = JSON.parse(
      fs.readFileSync(serviceAccountPath, "utf8")
    );
    const storagePort = serviceAccountJson.emulators?.storage?.port;
    const storage = new Storage({
      apiEndpoint: `http://${firebaseUrl}:${storagePort}`,
    });

    const bucket = storage.bucket(`${FIREBASE_PROJECT_ID}.appspot.com`);
    const file = bucket.file(destination);

    try {
      await file.save(fileBuffer, {
        resumable: false,
        public: "yes",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }

    const publicUrl = file.publicUrl();
    return publicUrl.replace(`${firebaseUrl}`, `localhost`);
  }
};

async function batchWriteLargeArray(uid, pushId, data) {
  let collectionRef = firestore.collection(
    `users/${uid}/reviews/${pushId}/reviews`
  );
  const chunkSize = 500;
  const batches = [];

  for (let i = 0; i < data.length; i += chunkSize) {
    const batch = firestore.batch();
    const chunk = data.slice(i, i + chunkSize);

    chunk.forEach((doc) => {
      if (doc && doc.id) {
        const docRef = collectionRef.doc(doc.id);
        batch.set(docRef, doc);
      }
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

module.exports = {
  admin,
  db,
  getMachineData,
  uploadFile,
  batchWriteLargeArray,
};
