const toUpperSnakeCase = (str) => {
  return str.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase();
};

const saveEnv = async (formId, type) => {
  const stripeForm = document.querySelector(formId);
  const formData = new FormData(stripeForm);
  const data = [...formData.entries()].reduce((acc, [key, value]) => {
    acc[toUpperSnakeCase(key)] = value;
    return acc;
  }, {});

  await saveEnvService(type, data);
};

document
  .querySelector("#buildDocker")
  .addEventListener("click", async (event) => {
    const btn = event.target;
    btn.disabled = true;
    btn.innerHTML = `<i class="ti ti-loader"></i> Processing...`;

    await saveEnv("#stripeForm", "stripe");
    await saveEnv("#firebaseForm", "firebase");

    try {
      await buildDockerService();
      btn.innerHTML = `<i class="ti ti-circle-check"></i> Done`;
    } catch (error) {
      console.error("Error building Docker:", error);
      btn.disabled = false;
      btn.classList.replace("btn-primary", "btn-danger");
      btn.innerHTML = `<i class="ti ti-circle-x"></i> Rerun`;
    }
  });
