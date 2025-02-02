const fs = require("fs");
const path = require("path");
const { localDocker } = require("./docker");
const sourcePath = path.resolve(__dirname, "../../");
const stripeSecretsPath = path.join(sourcePath, "stripe-secrets");

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
