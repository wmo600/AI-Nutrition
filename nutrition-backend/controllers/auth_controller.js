// controllers/auth_controller.js
const authService = require('../services/auth_service');

// Legacy: Login with name only
exports.login = async (req, res) => {
  try {
    const { userName } = req.body;

    const session = await authService.loginOrRegisterByName(userName);

    return res.json(session);
  } catch (err) {
    console.error('Auth login error:', err);
    return res.status(400).json({ error: err.message || 'Login failed' });
  }
};

// New: Register with email/password
exports.register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({ 
        error: 'userName, email, and password are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters' 
      });
    }

    const session = await authService.registerWithEmail(userName, email, password);

    return res.status(201).json(session);
  } catch (err) {
    console.error('Auth register error:', err);
    return res.status(400).json({ error: err.message || 'Registration failed' });
  }
};

// New: Login with email/password
exports.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    const session = await authService.loginWithEmail(email, password);

    return res.json(session);
  } catch (err) {
    console.error('Auth login error:', err);
    return res.status(401).json({ error: err.message || 'Login failed' });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const session = await authService.refreshTokens(refreshToken);

    return res.json(session);
  } catch (err) {
    console.error('Auth refresh error:', err);
    return res.status(401).json({ error: err.message || 'Refresh failed' });
  }
};