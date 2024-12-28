const axios = require("axios");
const { createToken } = require("../utils/jwtUtils");

const watchBuyCoins = async (event) => {
  const endpointURL = `http://${
    process.env.SERVER_IP || "host.docker.internal"
  }:${process.env.SERVER_PORT || 1337}`;

  const snapshot = event.data;

  if (!snapshot) {
    console.log("No data associated with the event");
    return;
  }

  const amount = snapshot.data().amount;
  const userId = event.params.userId;

  const token = createToken({
    userId,
    amount,
  });

  const data = await axios.post(
    `${endpointURL}/stripe`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const url = data.data.url;
  await snapshot.ref.update({ url });
};

module.exports = watchBuyCoins;
