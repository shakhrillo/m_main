const { dinDocker, localDocker } = require("./docker");

const checkMachine = async () => {
  try {
    const machineBuildImageName = process.env.MACHINE_BUILD_IMAGE_NAME;
    if (!machineBuildImageName) {
      throw new Error("MACHINE_BUILD_IMAGE_NAME not set");
    }

    const image = dinDocker.getImage(machineBuildImageName);
    const imageDetails = await image.inspect();

    const imageMachine = localDocker.getContainer(
      process.env.MACHINE_CONTAINER_NAME
    );
    const imageDetailsMachine = await imageMachine.inspect();
    const isStopped = imageDetailsMachine.State.Status === "exited";

    if (isStopped && imageDetails.RepoTags[0].includes(machineBuildImageName)) {
      return true;
    }

    return false;
  } catch (error) {
    throw new Error(`Error checking machine: ${error}`);
  }
};

module.exports = checkMachine;
