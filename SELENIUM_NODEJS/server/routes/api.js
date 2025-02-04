// routes/api.js

const express = require('express');
const apiController = require('../controllers/apiController');

const router = express.Router();

// Define routes and map them to controller functions
router.get('/items', apiController.getAllItems); // Get all items
router.post('/items', apiController.createItem); // Create a new item
router.get('/items/:id', apiController.getItemById); // Get item by ID
router.put('/items/:id', apiController.updateItem); // Update item by ID
router.delete('/items/:id', apiController.deleteItem); // Delete item by ID

module.exports = router;
