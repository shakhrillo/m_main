const { db } = require("../firebase");

function addMachineStatus(machineId, details) {
  // const doc = db.collection("machines").doc(machineId);
  // return doc.set({ ...details, createdAt: new Date() });
}

function updateMachineStatus(machineId, details) {
  // const doc = db.collection("machines").doc(machineId);
  // return doc.update({ ...details, updatedAt: new Date() });
}

module.exports = {
  addMachineStatus,
  updateMachineStatus,
};
