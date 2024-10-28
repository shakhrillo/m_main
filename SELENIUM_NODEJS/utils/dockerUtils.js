const { exec } = require('child_process');

const execPromise = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${stderr}`);
      } else {
        resolve(stdout);
      }
    });
  });
};

async function startContainer(containerName, generatedPort, subPort, imageName) {
  const res = new Promise((resolve, reject) => {
    const deployCommand = `gcloud run deploy ${containerName} \
    --image ${imageName} \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --port 4444 \
    --cpu 8 \
    --memory 8Gi`;

    exec(deployCommand, (error, stdout, stderr) => {
        if (error) {
            return reject(`Error deploying service: ${stderr}`);
        }

        // Retrieve the service URL
        const urlCommand = `gcloud run services describe ${containerName} --region us-central1 --format "value(status.url)"`;
        exec(urlCommand, (err, urlStdout, urlStderr) => {
            if (err) {
                return reject(`Error retrieving service URL: ${urlStderr}`);
            }
            resolve(urlStdout.trim());
        });
    });
  });

  return res;
}

async function stopAndRemoveContainer(containerName) {
  console.log('Stopping and removing container:', containerName);
  const command = `gcloud run services delete ${containerName} --platform managed --region us-central1 --quiet`;
  
  try {
    const result = await execPromise(command);
    console.log(`Docker container ${containerName} stopped and removed: ${result}`);
  } catch (error) {
    console.error(`Failed to stop and remove container ${containerName}:`, error);
  }
}

module.exports = {
  startContainer,
  stopAndRemoveContainer,
};
