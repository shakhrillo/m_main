const socket = io({
  path: "/setup/socket.io",
});

const updateLogs = (selector, log) => {
  const container = document.querySelector(selector);
  if (!container) return;

  const isUserAtBottom =
    container.scrollHeight - container.scrollTop === container.clientHeight;
  container.textContent += log + "\n";

  if (isUserAtBottom) {
    container.scrollTop = container.scrollHeight;
  }

  delete container.dataset.highlighted;
  hljs.highlightElement(container);
};

socket.on("docker-build", (log) => updateLogs("#dockerStats", log));
