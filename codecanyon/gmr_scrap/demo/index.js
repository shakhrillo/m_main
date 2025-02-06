const dockerBuild = require("./installation/services/dockerBuild");

(async () => {
  // const ora = (await import("ora")).default;
  // global.spinner = ora({
  //   spinner: "dots",
  //   color: "cyan",
  // }).start("Building Docker containers...");

  try {
    await dockerBuild();
  } catch (err) {
    console.error(err);
  } finally {
    console.log("Docker build completed.");
  }
})();
