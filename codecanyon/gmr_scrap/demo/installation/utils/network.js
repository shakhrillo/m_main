const { localDocker } = require("./docker");

const createNetwork = async ({ emitMessage, env }) => {
  const networkName = "gmrs-network";
  const networkSubnet = env.NETWORK_SUBNET || "";

  try {
    const network = localDocker.getNetwork(networkName);
    const details = await network.inspect();

    // Disconnect active containers before removal
    if (details.Containers && Object.keys(details.Containers).length > 0) {
      emitMessage(`**Info:** Disconnecting containers from ${networkName}`);
      for (const containerId of Object.keys(details.Containers)) {
        try {
          await network.disconnect({ Container: containerId, Force: true });
          emitMessage(`**Info:** Disconnected container ${containerId}`);
        } catch (err) {
          console.error(`Error disconnecting container ${containerId}:`, err);
        }
      }
    }

    await network.remove();
    emitMessage(`**Info:** Removed existing network ${networkName}`);
  } catch (error) {
    if (error.statusCode !== 404) {
      console.error("Error removing network:", error);
    }
  }

  try {
    emitMessage("Checking for existing networks with the same subnet...");
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
