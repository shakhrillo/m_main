const dockerBuild = require("./installation/dockerBuild");

(async () => {
  try {
    await dockerBuild();
  } catch (err) {
    console.error(err);
  } finally {
    console.log("Docker build completed.");
  }
})();
