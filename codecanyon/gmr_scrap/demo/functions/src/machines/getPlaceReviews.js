const axios = require("axios");
const { createToken } = require("../utils/jwtUtils");
const endPointURL = process.env.ENDPOINT_URL;

const getPlaceReview = async (event) => {
  const snapshot = event.data;

  if (!snapshot) {
    console.log("No data associated with the event");
    return;
  }

  const review = snapshot.data();
  const token = createToken({
    ...review,
    ...event.params,
  });

  await axios.post(`http://34.46.215.20/api/scrap`, review, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

module.exports = getPlaceReview;
