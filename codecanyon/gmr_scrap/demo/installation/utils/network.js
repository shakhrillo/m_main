const { localDocker } = require("./docker");

const createNetwork = async (env) => {
  const networkName = "gmrs-network";
  const networkSubnet = env.NETWORK_SUBNET || "";
  const network = localDocker.getNetwork(networkName);
  try {
    await network.inspect();
    global.io.emit(
      `docker-build`,
      `✅ Docker network "${networkName}" found.\n`
    );
    return;
  } catch (error) {
    global.io.emit(
      `docker-build`,
      `⚠️ Docker network "${networkName}" not found. Creating...\n`
    );
  }

  await localDocker.createNetwork({
    Name: networkName,
    Driver: "bridge",
    IPAM: {
      Config: [
        {
          Subnet: networkSubnet,
        },
      ],
    },
  });

  global.io.emit(
    `docker-build`,
    `✅ Docker network "${networkName}" created.\n`
  );
};

module.exports = createNetwork;
