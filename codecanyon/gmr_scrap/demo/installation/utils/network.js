const { localDocker } = require("./docker");

const createNetwork = async ({ emitMessage, env }) => {
  const networkName = "gmrs-network_ss";
  const networkSubnet = env.NETWORK_SUBNET || "";

  try {
    const network = localDocker.getNetwork(networkName);
    await network
      .inspect()
      .then(() => network.remove())
      .catch(() => {});
    emitMessage(`**Info:** Removing existing network ${networkName}`);
  } catch (error) {
    console.error("Error removing network:", error);
  }

  try {
    emitMessage("> Checking for existing networks with the same subnet...");
    const existingNetworks = await localDocker.listNetworks();
    const overlappingNetwork = existingNetworks.find((net) =>
      net.IPAM?.Config?.some((cfg) => cfg.Subnet === networkSubnet)
    );

    if (overlappingNetwork) {
      console.error(
        `Error: Subnet ${networkSubnet} is already used by ${overlappingNetwork.Name}`
      );
      return;
    }

    emitMessage("**Info:** Creating network...");
    await localDocker.createNetwork({
      Name: networkName,
      Driver: "bridge",
      IPAM: { Config: networkSubnet ? [{ Subnet: networkSubnet }] : [] },
    });
    emitMessage(`**Info:** Network ${networkName} created`);
  } catch (error) {
    console.error("> Error creating network:", error);
  }
};

module.exports = createNetwork;
