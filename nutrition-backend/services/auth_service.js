// services/auth_service.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/user_model');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || JWT_SECRET;
const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || '15m';
const REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL || '7d';
const SALT_ROUNDS = 10;

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

// Legacy: Login by name only (no password)
exports.loginOrRegisterByName = async (userName) => {
  if (!userName || !userName.trim()) {
    throw new Error('userName is required');
  }

  const trimmed = userName.trim();

  let user = await userModel.findUserByUserName(trimmed);

  if (!user) {
    user = await userModel.createUser(trimmed, null, null);
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

// New: Register with email and password
exports.registerWithEmail = async (userName, email, password) => {
  if (!userName || !email || !password) {
    throw new Error('userName, email, and password are required');
  }

  // Check if email already exists
  const existingUser = await userModel.findUserByEmail(email);
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user
  const user = await userModel.createUser(userName, email, passwordHash);

  await userModel.updateLastLogin(user.user_id);

  const tokens = generateTokens(user);

  return {
    userId: user.user_id,
    userName: user.user_name,
    email: user.email,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

// New: Login with email and password
exports.loginWithEmail = async (email, password) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const user = await userModel.findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.password_hash) {
    throw new Error('This account was created without a password. Please use name-based login.');
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  await userModel.updateLastLogin(user.user_id);

  const tokens = generateTokens(user);

  return {
    userId: user.user_id,
    userName: user.user_name,
    email: user.email,
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
    email: user.email,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};