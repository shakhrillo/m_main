const { log } = require("./logger");
const { localDocker } = require("./docker");

const createNetwork = async () => {
  const networkName = "gmrs-network";
  const networkSubnet = process.env.NETWORK_SUBNET || "";

  try {
    const network = localDocker.getNetwork(networkName);
    const details = await network.inspect();

    // Disconnect active containers before removal
    if (details.Containers && Object.keys(details.Containers).length > 0) {
      log(`**Info:** Disconnecting containers from ${networkName}`);
      for (const containerId of Object.keys(details.Containers)) {
        try {
          await network.disconnect({ Container: containerId, Force: true });
          log(`**Info:** Disconnected container ${containerId}`);
        } catch (err) {
          log(`Error disconnecting container ${containerId}:`, err);
        }
      }
    }

    await network.remove();
    log(`**Info:** Removed existing network ${networkName}`);
  } catch (error) {
    if (error.statusCode !== 404) {
      log("Error removing network:", error);
    }
  }

  try {
    log("Checking for existing networks with the same subnet...");
    const existingNetworks = await localDocker.listNetworks();
    const overlappingNetwork = existingNetworks.find((net) =>
      net.IPAM?.Config?.some((cfg) => cfg.Subnet === networkSubnet)
    );

    if (overlappingNetwork) {
      log(
        `Error: Subnet ${networkSubnet} is already used by ${overlappingNetwork.Name}`
      );
      return;
    }

    log("**Info:** Creating network...");
    await localDocker.createNetwork({
      Name: networkName,
      Driver: "bridge",
      IPAM: { Config: networkSubnet ? [{ Subnet: networkSubnet }] : [] },
    });
    log(`**Info:** Network ${networkName} created`);
  } catch (error) {
    log("> Error creating network:", error);
  }
};

module.exports = createNetwork;
