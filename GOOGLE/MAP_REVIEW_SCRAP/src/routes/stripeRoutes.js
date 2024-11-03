const express = require('express');
const { createCheckoutSession } = require('../controllers/stripeController');
const router = express.Router();

router.post('/', createCheckoutSession);

module.exports = router;