// routes/auth_route.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');

// Legacy name-based login (keep for backward compatibility)
router.post('/login', authController.login);

// New email/password endpoints
router.post('/register', authController.register);
router.post('/login-email', authController.loginWithEmail);

// Refresh token
router.post('/refresh', authController.refresh);

module.exports = router;