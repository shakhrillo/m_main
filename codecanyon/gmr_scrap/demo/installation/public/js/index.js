// ------------------------------------------------
// ----------------- Event Listeners --------------
// ------------------------------------------------
const handleButtonAction = async (btn, serviceFn, statusContainer) => {
  try {
    btn.disabled = true;
    btn.innerHTML = `<i class="ti ti-loader"></i> Processing...`;
    await serviceFn();
    btn.innerHTML = `<i class="ti ti-circle-check"></i> Done`;
  } catch (error) {
    btn.disabled = false;
    btn.classList.replace("btn-primary", "btn-danger");
    btn.innerHTML = `<i class="ti ti-circle-x"></i> Rerun`;
    document.querySelector(
      statusContainer
    ).innerHTML = `<li class="list-group-item text-danger small p-1">${error}</li>`;
  }
};

document
  .querySelector("#buildDocker")
  .addEventListener("click", () =>
    handleButtonAction(
      document.querySelector("#buildDocker"),
      buildDockerService,
      "#dockerStats"
    )
  );

document
  .querySelector("#startContainers")
  .addEventListener("click", () =>
    handleButtonAction(
      document.querySelector("#startContainers"),
      startContainersService,
      "#containerStats"
    )
  );

// ------------------------------------------------
// ----------------- Socket.io ---------------------
// ------------------------------------------------
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

//  ------------------------------------------------
// ----------------- Save .env ---------------------
// -------------------------------------------------
const setupSaveButton = (formId, buttonId, type, saveService) => {
  const button = document.querySelector(buttonId);
  if (!button) return;

  const stripeForm = document.querySelector(formId);
  const formData = new FormData(stripeForm);
  const data = Object.fromEntries(formData.entries());

  button.addEventListener("click", async () => {
    try {
      button.disabled = true;
      button.innerHTML = `<i class="ti ti-loader"></i> Saving...`;
      await saveService(type, data);
      button.innerHTML = `<i class="ti ti-circle-check"></i> Saved`;
      button.classList.replace("btn-primary", "btn-success");
    } catch (error) {
      console.error(error);
      button.classList.replace("btn-primary", "btn-danger");
      button.innerHTML = `<i class="ti ti-circle-x"></i> Retry`;
    } finally {
      button.disabled = false;
    }
  });
};

setupSaveButton("#stripeForm", "#saveStripe", "stripe", saveEnvService);
setupSaveButton("#firebaseForm", "#saveFirebase", "firebase", saveEnvService);
