// routes/auth_route.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/refresh
router.post('/refresh', authController.refresh);

module.exports = router;
