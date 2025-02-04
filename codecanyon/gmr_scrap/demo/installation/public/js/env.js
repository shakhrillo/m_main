loadEnvService().then((env) => {
  if (typeof env === "object" && Array.isArray(env)) {
    env.forEach((data) => {
      if (data.name === "main") {
        document
          .querySelector("#enableEmulator")
          .setAttribute("checked", data.env.APP_ENVIONMENT === "development");

        document.querySelector("#appEnvionment").value =
          data.env.APP_ENVIONMENT;
        document.querySelector("#appId").value = data.env.APP_ID;
        document.querySelector("#appDockerPort").value =
          data.env.APP_DOCKER_PORT;
        document.querySelector("#appClientPort").value =
          data.env.APP_CLIENT_PORT;
        document.querySelector("#appServerPort").value =
          data.env.APP_SERVER_PORT;
      }

      if (data.name === "maps") {
        document.querySelector("#googleMapsApiKey").value =
          data.env.GOOGLE_MAPS_API_KEY;
      }

      if (data.name === "jwt") {
        document.querySelector("#jwtSecret").value = data.env.JWT_SECRET;
      }

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
          data.env.FIREBASE_EMULATOR_AUTHENTICATION || 9099;
        document.querySelector("#firebaseEmulatorUI").value =
          data.env.FIREBASE_EMULATOR_UI || 4000;
        document.querySelector("#firebaseEmulatorFunctions").value =
          data.env.FIREBASE_EMULATOR_FUNCTIONS || 5001;
        document.querySelector("#firebaseEmulatorFirestore").value =
          data.env.FIREBASE_EMULATOR_FIRESTORE || 8080;
        document.querySelector("#firebaseEmulatorStorage").value =
          data.env.FIREBASE_EMULATOR_STORAGE || 9199;
        document.querySelector("#firebaseEmulatorHub").value =
          data.env.FIREBASE_EMULATOR_HUB || 4400;
      }
    });
  }
});

loadJSONService("client/firebaseConfig.json").then((json) => {
  if (typeof json === "object") {
    document.querySelector("#firebaseConfig").value = JSON.stringify(
      json,
      null,
      2
    );
  }
});

loadJSONService("firebaseServiceAccount.json").then((json) => {
  if (typeof json === "object") {
    document.querySelector("#firebaseServiceAccount").value = JSON.stringify(
      json,
      null,
      2
    );
  }
});
