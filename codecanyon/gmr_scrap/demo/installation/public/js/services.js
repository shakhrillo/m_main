const fetchService = async (url, method = "POST", body) => {
  try {
    const response = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) throw new Error(await response.text());
    return Promise.resolve(
      response.headers.get("Content-Type").includes("application/json")
        ? response.json()
        : response.text()
    );
  } catch (error) {
    return Promise.reject(error.message);
  }
};

const buildDockerService = () => fetchService("/docker-build");
const startContainersService = () => fetchService("/containers-start");
const saveEnvService = (name, env) =>
  fetchService("/save-env", "POST", { name, env });
const loadEnvService = () => fetchService(`/load-env`, "GET");
