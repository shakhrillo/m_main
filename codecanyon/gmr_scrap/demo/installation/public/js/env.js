loadEnvService().then((env) => {
  console.log(env);
  if (typeof env === "object" && Array.isArray(env)) {
    env.forEach((data) => {
      if (data.name === "stripe") {
        document.querySelector("#stripeApiKey").value = data.env.STRIPE_API_KEY;
        document.querySelector("#stripeDeviceName").value =
          data.env.STRIPE_DEVICE_NAME;
        document.querySelector("#stripeSuccessUrl").value =
          data.env.STRIPE_SUCCESS_URL;
        document.querySelector("#stripeCancelUrl").value =
          data.env.STRIPE_CANCEL_URL;
      }

      if (data.name === "firebase") {
        document.querySelector("#firebaseEmulatorAuthentication").value =
          data.env.FIREBASE_EMULATOR_AUTHENTICATION;
        document.querySelector("#firebaseEmulatorUI").value =
          data.env.FIREBASE_EMULATOR_UI;
        document.querySelector("#firebaseEmulatorFunctions").value =
          data.env.FIREBASE_EMULATOR_FUNCTIONS;
        document.querySelector("#firebaseEmulatorFirestore").value =
          data.env.FIREBASE_EMULATOR_FIRESTORE;
        document.querySelector("#firebaseEmulatorStorage").value =
          data.env.FIREBASE_EMULATOR_STORAGE;
        document.querySelector("#firebaseEmulatorHub").value =
          data.env.FIREBASE_EMULATOR_HUB;
      }
    });
  }
});

const setupSaveButton = (formId, buttonId, type, saveService) => {
  const button = document.querySelector(buttonId);
  if (!button) return;

  const toUpperSnakeCase = (str) => {
    return str.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase();
  };

  button.addEventListener("click", async () => {
    const stripeForm = document.querySelector(formId);
    const formData = new FormData(stripeForm);
    const data = [...formData.entries()].reduce((acc, [key, value]) => {
      acc[toUpperSnakeCase(key)] = value;
      return acc;
    }, {});

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
