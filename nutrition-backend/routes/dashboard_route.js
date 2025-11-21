const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard_controller');

// GET /api/dashboard/:userId
router.get('/:userId', dashboardController.getDashboard);

module.exports = router;
