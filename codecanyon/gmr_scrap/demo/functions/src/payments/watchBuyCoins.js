const axios = require("axios");
const { createToken } = require("../utils/jwtUtils");

const watchBuyCoins = async (event) => {
  const isEmulator = process.env.FUNCTIONS_EMULATOR;
  let endpointURL = "https://api.gmrscrap.store";
  if (isEmulator) {
    endpointURL = "http://localhost:1337";
  }

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
