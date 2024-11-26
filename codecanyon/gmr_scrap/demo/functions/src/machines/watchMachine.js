const { deleteMachine } = require("../utils/apiUtils");

const watchMachine = async (event) => {
  const machineId = event.params.machineId;
  const previousDocument = event.data.before.data();
  const document = event.data.after.data();
  const status = document.status;

  if (status === "remove" && previousDocument.status !== "remove") {
    console.log("Removing machine", machineId);
    await deleteMachine({
      buildTag: machineId,
    });
  }
};

module.exports = watchMachine;
