const { dockerInfo } = require("../utils/apiUtils");

const watchSettings = async (event) => {
  console.log("App init", event.params.appId);
  const appId = event.params.appId;
  const document = event.data.after.data();
  if (appId === "settings") {
    const info = await dockerInfo();
    console.log("Docker info", info);
  }
};

module.exports = watchSettings;
