// routes/vision_route.js
const express = require('express');
const router = express.Router();
const visionController = require('../controllers/vision_controller');

router.post('/analyze', visionController.analyze);

module.exports = router;
