const { db } = require("../firebase");

function setDockerInfo(info) {
  const doc = db.collection("app").doc("info");
  return doc.set({ info, updatedAt: new Date() }, { merge: true });
}

function setDockerUsage(usage) {
  const doc = db.collection("app").doc("usage");
  return doc.set({ usage, updatedAt: new Date() }, { merge: true });
}

module.exports = {
  setDockerInfo,
  setDockerUsage,
};
