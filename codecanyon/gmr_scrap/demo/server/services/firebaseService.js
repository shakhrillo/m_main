const { db } = require("../firebase");
const { Timestamp } = require("firebase-admin/firestore");

async function createMachine(docId, data) {
  try {
    await db.collection("machines").doc(docId).set(data);
  } catch (error) {
    console.error("Error creating machine:", error);
  }
}

// async function updateImages(data) {
//   try {
//     const batch = db.batch();
//     const imagesCollection = db.collection("images");
//     data.forEach(({ image, details, layers }) => {
//       // console.log("Updating image:", image.Id);
//       // console.log("Details:", details);
//       // console.log("Layers:", layers);

//       const docRef = imagesCollection.doc(image.Id);
//       const imageDetailsRef = db
//         .collection("images")
//         .doc(image.Id)
//         .collection("details");
//       const imageLayersRef = db
//         .collection("images")
//         .doc(image.Id)
//         .collection("layers");

//       batch.set(
//         imageDetailsRef.doc("details"),
//         {
//           ...details,
//           updatedAt: Timestamp.now(),
//         },
//         { merge: true }
//       );

//       layers.forEach(async (layer) => {
//         const layerRef = imageLayersRef.doc(layer.Id);
//         batch.set(
//           layerRef,
//           {
//             ...layer,
//             updatedAt: Timestamp.now(),
//           },
//           { merge: true }
//         );
//       });

//       batch.set(
//         docRef,
//         {
//           ...image,
//           updatedAt: Timestamp.now(),
//         },
//         { merge: true }
//       );
//     });

//     await batch.commit();
//   } catch (error) {
//     console.error("Error updating images:", error);
//   }
// }

async function updateMachine(docId, data) {
  try {
    await db
      .collection("machines")
      .doc(docId)
      .set(
        {
          ...data,
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );
  } catch (error) {
    console.error("Error updating machine:", error);
  }
}

/**
 * Add image history to machine history collection
 * @param {string} docId
 * @param {Docker.ImageInspectInfo} imgHistory
 */
async function updateMachineHistory(docId, imgHistory) {
  if (!imgHistory) return;

  try {
    const batch = db.batch();
    const historyCollection = db
      .collection("machines")
      .doc(docId)
      .collection("history");

    imgHistory.forEach((history) => {
      const historyRef = historyCollection.doc(history.Id);
      batch.set(
        historyRef,
        {
          ...history,
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );
    });

    await batch.commit();
  } catch (error) {
    console.error("Error updating machine history:", error);
  }
}

async function addMachineStats(docId, stats) {
  try {
    await db
      .collection("machines")
      .doc(docId)
      .collection("stats")
      .add({
        ...stats,
        updatedAt: Timestamp.now(),
      });
  } catch (error) {
    console.error("Error updating machine stats:", error);
  }
}

async function addMachineLogs(docId, logs) {
  try {
    await db.collection("machines").doc(docId).collection("logs").add({
      logs,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating machine logs:", error);
  }
}

async function addDockerInfo({ data, type, imageId }) {
  try {
    const { id } = await db.collection("docker").add({
      data: JSON.stringify(data),
      updatedAt: Timestamp.now(),
      type,
      ...(imageId && { imageId }),
    });

    return id;
  } catch (error) {
    console.error("Error saving Docker info:", error);
  }
}

async function updateDockerImageInfo(info) {
  try {
    await db
      .collection("docker")
      .doc("image")
      .set(
        { info: JSON.stringify(info), updatedAt: Timestamp.now() },
        { merge: true }
      );
  } catch (error) {
    console.error("Error saving Docker info:", error);
  }
}

module.exports = {
  createMachine,
  updateMachine,
  addDockerInfo,
  updateDockerImageInfo,
  addMachineStats,
  updateMachineHistory,
  addMachineLogs,
};
