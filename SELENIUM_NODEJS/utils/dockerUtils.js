const { exec } = require('child_process');

async function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error || stderr) {
        reject(`Error: ${error?.message || stderr}`);
      } else {
        resolve(stdout);
      }
    });
  });
}

async function waitForContainerLog(containerName, logMessage, timeout = 30000) {
  const start = Date.now();
  let logs = '';

  while (Date.now() - start < timeout) {
    try {
      logs = await execPromise(`docker logs ${containerName}`);
      console.log('-'.repeat(20));
      console.log('Checking logs:', logs);
      console.log('-'.repeat(20));
      if (logs.includes(logMessage)) {
        console.log('Container is ready!');
        return;
      }
    } catch (error) {
      console.error(`Error checking logs: ${error}`);
    }
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before checking again
  }

  throw new Error(`Timeout: Container did not output '${logMessage}' within ${timeout / 1000} seconds`);
}

async function startContainer(containerName, generatedPort, subPort, imageName) {
  const command = `docker run -d --name ${containerName} -p ${generatedPort}:4444 -p ${subPort}:7900 --shm-size="4g" ${imageName}`;

  try {
    const result = await execPromise(command);
    console.log(`Docker container started with ID: ${result.trim()}`);

    await waitForContainerLog(containerName, 'Started Selenium Standalone');
  } catch (error) {
    console.error(`Failed to start container: ${error}`);
  }
}

async function stopAndRemoveContainer(containerName) {
  const command = `docker stop ${containerName} && docker rm ${containerName}`;
  
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
