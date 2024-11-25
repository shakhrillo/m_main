const watchSettings = async ({ params: { appId }, data }) => {
  console.log("App init", appId);
  const afterData = data.value.fields;
  console.log("Changes", afterData);
};

module.exports = watchSettings;
