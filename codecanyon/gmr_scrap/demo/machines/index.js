require("dotenv").config();

const isInfo = process.env.IS_INFO === "true";
const initInfo = require("./info");
const initMain = require("./main");

console.log(`Running ${isInfo ? "info" : "main"} script`);

if (isInfo) {
  initInfo.init();
} else {
  initMain.init();
}
