// routes/inventory_route.js
const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory_controller');

router.post('/add-from-vision', inventoryController.addFromVision);

module.exports = router;
