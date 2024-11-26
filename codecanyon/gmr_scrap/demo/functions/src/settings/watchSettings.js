const {
  dockerInfo,
  dockerUsageInfo,
  clearCache,
} = require("../utils/apiUtils");

const watchSettings = async (event) => {
  const appId = event.params.appId;
  const document = event.data.after.data();
  console.log("calling...");
  if (document.refresh) {
    console.log("Refreshing app", appId);
    dockerInfo();
    dockerUsageInfo();
    const ref = event.data.after.ref;
    await ref.update({
      refresh: false,
    });
  }

  if (document.clearCache) {
    console.log("Clearing cache for app", appId);
    const ref = event.data.after.ref;
    await clearCache({});
    await ref.update({
      clearCache: false,
    });
  }
};

module.exports = watchSettings;
