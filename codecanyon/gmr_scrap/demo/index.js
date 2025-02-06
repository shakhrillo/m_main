const dockerBuild = require("./installation/services/dockerBuild");

(async () => {
  try {
    await dockerBuild();
  } catch (err) {
    console.error(err);
  } finally {
    console.log("Docker build completed.");
  }
})();
