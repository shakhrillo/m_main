const { db } = require("../firebase");

function setDockerInfo(info) {
  const doc = db.collection("app").doc("info");
  // enable undefined fields to be deleted
  return doc.set({ info, updatedAt: new Date() }, { merge: true });
}

module.exports = {
  setDockerInfo,
};
