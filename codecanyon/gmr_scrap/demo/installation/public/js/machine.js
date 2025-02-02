const handleButtonAction = async (btn, serviceFn, statusContainer) => {
  try {
    btn.disabled = true;
    btn.innerHTML = `<i class="ti ti-loader"></i> Processing...`;
    await serviceFn();
    btn.disabled = false;
    btn.innerHTML = `<i class="ti ti-circle-check"></i> Done`;
  } catch (error) {
    btn.disabled = false;
    btn.classList.replace("btn-primary", "btn-danger");
    btn.innerHTML = `<i class="ti ti-circle-x"></i> Rerun`;
    const statusContainerInnerHtml =
      document.querySelector(statusContainer).innerHTML;
    document.querySelector(
      statusContainer
    ).innerHTML = `${statusContainerInnerHtml}<li class="list-group
    -item text-danger small p-1">${error}</li>`;
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
