// models/inventory_model.js
const db = require('../services/db');

exports.insertItemsFromVision = async (userId, items) => {
  const insertQuery = `
    INSERT INTO user_inventory (
      user_id,
      food_item,
      quantity,
      unit,
      added_via
    )
    VALUES ($1, $2, $3, $4, 'vision');
  `;

  for (const item of items) {
    const { item: name, quantity = 1, unit = 'units' } = item;
    await db.query(insertQuery, [userId, name, quantity, unit]);
  }
};

// Get all available items for a user
exports.getAvailableInventory = async (userId) => {
  const result = await db.query(
    `
    SELECT
      food_item,
      quantity,
      unit
    FROM user_inventory
    WHERE user_id = $1
      AND is_available = TRUE
    ORDER BY created_at DESC;
    `,
    [userId]
  );

  return result.rows; // [{ food_item, quantity, unit }, ...]
};