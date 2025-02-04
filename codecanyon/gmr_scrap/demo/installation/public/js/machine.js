const toUpperSnakeCase = (str) => {
  return str.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase();
};

function convertToJson(jsonString) {
  // Regular expression to find unquoted keys and wrap them with double quotes
  const validJsonString = jsonString.replace(
    /([a-zA-Z0-9_]+)(?=\s*:)/g,
    '"$1"'
  );

  try {
    const jsonObject = JSON.parse(validJsonString); // Parse the corrected JSON string
    console.log(jsonObject); // Outputs the JSON object
    return jsonObject;
  } catch (error) {
    console.error("Invalid JSON format:", error);
    return null;
  }
}

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

const saveJSON = async (formId, type) => {
  try {
    const stripeForm = document.querySelector(formId);
    const value = stripeForm.querySelector("textarea").value;

    const regex = /const firebaseConfig = ({.*});/s;
    const match = value.match(regex);

    if (match || value.startsWith("{")) {
      let extractedJson = value;
      if (match) {
        extractedJson = match[1];
        extractedJson = `${extractedJson.replace(/(\w+): /g, '"$1": ')}`;
      }
      await saveJSONService(type, JSON.parse(extractedJson));
    } else {
      console.log("No match found!");
    }
  } catch (error) {
    console.error("Error saving JSON:", error);
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
    await saveEnv("#firebaseEmulatorForm", "firebase");
    await saveJSON("#firebaseConfigForm", "client/firebaseConfig.json");
    await saveJSON(
      "#firebaseServiceAccountForm",
      "firebaseServiceAccount.json"
    );

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
    const appEnvionment = document.querySelector("#appEnvironment");
    const isChecked = event.target.checked;
    // const firebaseForm = document.querySelector("#firebaseForm");
    // const children = firebaseForm.querySelectorAll("input");

    // children.forEach((child) => {
    //   const id = child.getAttribute("id").toUpperCase();
    //   if (id.includes("EMULATOR")) {
    //     child.disabled = isChecked;
    //   }
    // });

    appEnvionment.value = isChecked ? "development" : "production";
  });
