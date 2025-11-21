// services/auth_service.js
const jwt = require('jsonwebtoken');
const userModel = require('../models/user_model');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || JWT_SECRET;
const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || '15m';
const REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL || '7d';

// Core: issue access + refresh tokens for a given user
function generateTokens(user) {
  const payload = { userId: user.user_id };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
  });

  const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_TTL,
  });

  return { accessToken, refreshToken };
}

exports.loginOrRegisterByName = async (userName) => {
  if (!userName || !userName.trim()) {
    throw new Error('userName is required');
  }

  const trimmed = userName.trim();

  // Try to find by user_name
  let user = await userModel.findUserByUserName(trimmed);

  if (!user) {
    user = await userModel.createUser(trimmed);
  }

  await userModel.updateLastLogin(user.user_id);

  const tokens = generateTokens(user);

  return {
    userId: user.user_id,
    userName: user.user_name,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

exports.refreshTokens = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error('refreshToken is required');
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, REFRESH_SECRET);
  } catch (err) {
    throw new Error('Invalid or expired refresh token');
  }

  const userId = decoded.userId;
  const user = await userModel.findUserByUserId(userId);
  if (!user) {
    throw new Error('User not found for refresh token');
  }

  const tokens = generateTokens(user);

  return {
    userId: user.user_id,
    userName: user.user_name,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};
