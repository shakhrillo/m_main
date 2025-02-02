const { localDocker } = require("./docker");

const createNetwork = async (env) => {
  const networkName = "gmrs-network";
  const networkSubnet = env.NETWORK_SUBNET || "";

  try {
    const network = localDocker.getNetwork(networkName);
    await network.inspect();
    global.io.emit(
      "docker-build",
      `Docker network "${networkName}" already exists.\n`
    );

    return false;
  } catch {
    console.log("Network does not exist");
  }

  try {
    await localDocker.createNetwork({
      Name: networkName,
      Driver: "bridge",
      IPAM: { Config: [{ Subnet: networkSubnet }] },
    });
    global.io.emit(
      "docker-build",
      `Docker network "${networkName}" created.\n`
    );
  } catch (error) {
    global.io.emit("docker-build", error);
  }
};

module.exports = createNetwork;
