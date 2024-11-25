const { db } = require("../firebase");

function setDockerInfo(info) {
  const doc = db.collection("app").doc("docker");
  return doc.set({ info, updatedAt: new Date() }, { merge: true });
}

module.exports = {
  setDockerInfo,
};
