const express = require("express");
const {
  createCheckoutSession,
  webhookHandler,
} = require("../controllers/stripeController");
const router = express.Router();

router.post("/", createCheckoutSession);
router.post("/webhook", webhookHandler);

module.exports = router;
