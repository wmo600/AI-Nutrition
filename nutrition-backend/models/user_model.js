// models/user_model.js
const db = require('../services/db');
const crypto = require('crypto');

exports.findUserByUserId = async (userId) => {
  const result = await db.query(
    'SELECT * FROM users WHERE user_id = $1 LIMIT 1',
    [userId]
  );
  return result.rows[0] || null;
};

exports.findUserByUserName = async (userName) => {
  const result = await db.query(
    'SELECT * FROM users WHERE user_name = $1 LIMIT 1',
    [userName]
  );
  return result.rows[0] || null;
};

exports.findUserByEmail = async (email) => {
  const result = await db.query(
    'SELECT * FROM users WHERE email = $1 LIMIT 1',
    [email]
  );
  return result.rows[0] || null;
};

exports.createUser = async (userName, email = null, passwordHash = null) => {
  const userId = 'usr_' + crypto.randomBytes(6).toString('hex');
  
  const authProvider = email ? 'local' : 'name';

  const result = await db.query(
    `INSERT INTO users (user_id, user_name, email, password_hash, auth_provider, is_active)
     VALUES ($1, $2, $3, $4, $5, TRUE)
     RETURNING *`,
    [userId, userName, email, passwordHash, authProvider]
  );

  return result.rows[0];
};

exports.updateLastLogin = async (userId) => {
  await db.query(
    `UPDATE users
     SET last_login = NOW()
     WHERE user_id = $1`,
    [userId]
  );
};