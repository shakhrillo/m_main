const express = require("express");
const {
  createCheckoutSession,
  webhookHandler,
} = require("../controllers/stripeController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, createCheckoutSession);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webhookHandler
);

module.exports = router;
