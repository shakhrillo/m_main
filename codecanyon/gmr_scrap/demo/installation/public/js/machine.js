const toUpperSnakeCase = (str) => {
  return str.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase();
};

const saveEnv = async (formId, type) => {
  try {
    const stripeForm = document.querySelector(formId);
    const formData = new FormData(stripeForm);
    const data = [...formData.entries()].reduce((acc, [key, value]) => {
      acc[toUpperSnakeCase(key)] = value;
      return acc;
    }, {});

    await saveEnvService(type, data);
  } catch (error) {
    console.error("Error saving env:", error);
  }
};

document
  .querySelector("#buildDocker")
  .addEventListener("click", async (event) => {
    const btn = event.target;
    btn.disabled = true;
    btn.innerHTML = `<i class="ti ti-loader"></i> Processing...`;

    await saveEnv("#generalForm", "main");
    await saveEnv("#googleMapsForm", "maps");
    await saveEnv("#jwtForm", "jwt");
    await saveEnv("#stripeForm", "stripe");
    await saveEnv("#firebaseForm", "firebase");

    await new Promise((resolve) => setTimeout(resolve, 1000));

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

document
  .querySelector("#enableEmulator")
  .addEventListener("click", async (event) => {
    const appEnvionment = document.querySelector("#appEnvionment");
    const isChecked = event.target.checked;
    const firebaseForm = document.querySelector("#firebaseForm");
    const children = firebaseForm.querySelectorAll("input");

    // children.forEach((child) => {
    //   const id = child.getAttribute("id").toUpperCase();
    //   if (id.includes("EMULATOR")) {
    //     child.disabled = isChecked;
    //   }
    // });

    appEnvionment.value = isChecked ? "development" : "production";
  });
