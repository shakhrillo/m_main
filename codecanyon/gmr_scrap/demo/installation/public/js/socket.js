const socket = io();
let logsDockerBuild = "";
let logsDockerStart = "";

const updateLogs = (selector, logs, log) => {
  logs += log;
  document.querySelector(selector).innerHTML = logs
    .split("\n")
    .filter((line) => line)
    .map((line) => `<li class="list-group-item small p-1">${line}</li>`)
    .join("");
  document.querySelector(selector).scrollTop =
    document.querySelector(selector).scrollHeight;
};

socket.on("docker-build", (log) => {
  logsDockerBuild += log;
  updateLogs("#dockerStats", logsDockerBuild, log);
});

socket.on("containers-start", (log) => {
  logsDockerStart += log;
  updateLogs("#containerStats", logsDockerStart, log);
});
