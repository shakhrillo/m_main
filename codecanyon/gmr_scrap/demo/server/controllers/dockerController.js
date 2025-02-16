const { getDocker } = require("../docker");

/**
 * Create and start a docker container.
 * 
 * @param {object} containerOptions - Container options
 * @returns {Promise<object>} - Container start data
 */
function createAndStartContainer(containerOptions) {
  return new Promise((resolve, reject) => {
    const docker = getDocker();

    console.log('-'.repeat(100));
    docker.createContainer(containerOptions, (createError, container) => {
      if (createError) {
        console.error("Error creating container:", createError);
        return reject(createError);
      }

      container.start((startError, startData) => {
        if (startError) {
          console.error("Error starting container:", startError);
          return reject(startError);
        }

        resolve(startData);
      });
    });
  });
}

module.exports = {
  createAndStartContainer,
};