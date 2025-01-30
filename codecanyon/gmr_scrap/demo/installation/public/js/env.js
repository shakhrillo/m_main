loadEnvService().then((env) => {
  console.log(env);
  if (typeof env === "object" && Array.isArray(env)) {
    env.forEach((data) => {
      if (data.name === "stripe") {
        // document.querySelector("#stripeKey").value = data.env.STRIPE_KEY;
        // document.querySelector("#stripeSecret").value = data.env.STRIPE_SECRET;
      }

      if (data.name === "firebase") {
        document.querySelector("#firebaseEmulatorAuthentication").value =
          data.env.firebaseEmulatorAuthentication;
        document.querySelector("#firebaseEmulatorUI").value =
          data.env.firebaseEmulatorUI;
        document.querySelector("#firebaseEmulatorFunctions").value =
          data.env.firebaseEmulatorFunctions;
        document.querySelector("#firebaseEmulatorFirestore").value =
          data.env.firebaseEmulatorFirestore;
        document.querySelector("#firebaseEmulatorStorage").value =
          data.env.firebaseEmulatorStorage;
        document.querySelector("#firebaseEmulatorHub").value =
          data.env.firebaseEmulatorHub;
      }
    });
  }
});

const setupSaveButton = (formId, buttonId, type, saveService) => {
  const button = document.querySelector(buttonId);
  if (!button) return;

  button.addEventListener("click", async () => {
    const stripeForm = document.querySelector(formId);
    const formData = new FormData(stripeForm);
    const data = Object.fromEntries(formData.entries());

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
