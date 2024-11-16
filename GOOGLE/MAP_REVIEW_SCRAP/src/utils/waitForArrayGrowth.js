async function waitForArrayGrowth(array, targetLength, timeout = 90000) {
  let initialLength = array.length;
  let stableDuration = 0;
  const checkInterval = 100; // Check every 100ms

  while (array.length <= targetLength) {
    if (array.length === initialLength) {
      stableDuration += checkInterval;
      if (stableDuration >= timeout) {
        console.log(
          "Timeout exceeded: Array length did not change for 10 seconds."
        );
        return;
      }
    } else {
      initialLength = array.length; // Update to new length if it changes
      stableDuration = 0; // Reset stable duration counter
    }

    await new Promise((resolve) => setTimeout(resolve, checkInterval));
  }

  console.log(
    `Array length exceeded the target. Current length: ${array.length}`
  );
}

module.exports = waitForArrayGrowth;
