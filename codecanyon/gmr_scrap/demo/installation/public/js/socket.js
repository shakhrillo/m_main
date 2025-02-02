const socket = io();
let logsDockerBuild = [];

/**
 * Update logs in the DOM.
 * @param {string} selector - The selector of the container.
 * @param {Array} logs - The logs array.
 * @param {string} log - The log to add.
 * @returns {void}
 */
const updateLogs = (selector, logs, log) => {
  const container = document.querySelector(selector);
  if (!container) return;

  const isUserAtBottom =
    container.scrollHeight - container.scrollTop === container.clientHeight;

  // logs.push(log);

  // const fragment = document.createDocumentFragment();
  // const logItem = document.createElement("span");
  // logItem.className = "d-block small";
  // logItem.textContent = log;
  // fragment.appendChild(document.createTextNode(`${log}\n`));

  // container.appendChild(fragment);

  container.textContent += log + "\n";

  if (isUserAtBottom) {
    container.scrollTop = container.scrollHeight;
  }

  // const codeElement = document.getElementById("dockerStats");
  delete container.dataset.highlighted;
  hljs.highlightElement(container);
};

socket.on("docker-build", (log) =>
  updateLogs("#dockerStats", logsDockerBuild, log)
);
