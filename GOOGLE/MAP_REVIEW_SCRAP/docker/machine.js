const { exec } = require("child_process");

// Function to execute a command and return a promise
function runCommand(command) {
  return new Promise((resolve, reject) => {
    const process = exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`exec error: ${error}`);
        return;
      }
      if (stderr) {
        reject(`stderr: ${stderr}`);
        return;
      }
      resolve(stdout); // Resolves when process is fully complete
    });

    // Optional: Log output while the process is running
    process.stdout.on("data", (data) => {
      console.log("--".repeat(20));
      console.log(data); // Show live build process output
      console.log("--".repeat(20));
    });

    process.stderr.on("data", (data) => {
      console.log("++".repeat(20));
      console.error(data); // Show any error output in real-time
      console.log("++".repeat(20));
    });
  });
}
// Build Docker image
async function buildAndRunDocker() {
  try {
    console.log("Building Docker image...");
    await runCommand(
      "docker build --platform linux/amd64 -t puppeteer-docker ."
    );
    console.log("Docker image built successfully!");

    // Run the Docker container after the build is complete
    // console.log("Running Docker container...");
    // await runCommand("docker run --platform linux/amd64 puppeteer-docker");
    // console.log("Docker container is running!");
  } catch (error) {
    console.error(`Error: ${error}`);
    console.log("**".repeat(20));
  }
}

// Call the function and wait for completion
buildAndRunDocker()
  .then(() => {
    console.log("Both build and run commands are completed.");
  })
  .catch((err) => {
    console.error("An error occurred:", err);
  });
