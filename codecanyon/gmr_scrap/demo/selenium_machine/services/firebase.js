const { Storage } = require("@google-cloud/storage");
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const isTest = process.env.NODE_ENV === "production";
let firebaseUrl = "127.0.0.1";
// if (!isTest) {
firebaseUrl = "host.docker.internal";
// }

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
if (!FIREBASE_PROJECT_ID) {
  throw new Error("FIREBASE_PROJECT_ID not found in environment variables");
}

let serviceAccountPath;
if (process.env.NODE_ENV === "development") {
  serviceAccountPath = path.resolve(
    __dirname,
    isTest ? "../../firebase.json" : "../firebase.json"
  );
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error("firebase.json not found");
  }
}

const firebasekeysPath = path.resolve(
  __dirname,
  isTest ? "../firebasekeys.json" : "../firebasekeys.json"
);
if (
  process.env.NODE_ENV !== "development" &&
  !fs.existsSync(firebasekeysPath)
) {
  throw new Error("firebasekeys.json not found");
}

admin.initializeApp(
  process.env.NODE_ENV === "development"
    ? { projectId: FIREBASE_PROJECT_ID }
    : {
        credential: admin.credential.cert(firebasekeysPath),
        storageBucket: process.env.STORAGE_BUCKET,
        projectId: FIREBASE_PROJECT_ID,
      }
);

const db = admin.firestore();
const bucket = admin.storage().bucket();

if (process.env.NODE_ENV === "development") {
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
  } else {
    return new Promise((resolve, reject) => {
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
