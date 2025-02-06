const dockerBuild = require("./installation/services/dockerBuild");

(async () => {
  try {
    await dockerBuild();
  } catch (err) {
    console.error(err);
  }
})();
