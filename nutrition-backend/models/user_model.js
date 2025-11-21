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

exports.createUser = async (userName) => {
  const userId = 'usr_' + crypto.randomBytes(6).toString('hex'); // e.g. usr_a1b2c3d4e5f6

  const result = await db.query(
    `INSERT INTO users (user_id, user_name, is_active)
     VALUES ($1, $2, TRUE)
     RETURNING *`,
    [userId, userName]
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
