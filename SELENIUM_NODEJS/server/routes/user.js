// routes/user.js

const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Define routes for user operations
router.get('/:id', userController.getUserById); // Get user by ID
router.post('/', userController.createUser); // Create a new user

module.exports = router;
