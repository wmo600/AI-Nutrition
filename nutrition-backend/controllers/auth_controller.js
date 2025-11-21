// controllers/auth_controller.js
const authService = require('../services/auth_service');

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
