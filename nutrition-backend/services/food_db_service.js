// services/food_db_service.js (you can reuse)
const db = require('../services/db');

exports.searchFoods = async (query, limit = 20) => {
  const result = await db.query(
    'SELECT * FROM search_foods($1, $2);',
    [query, limit]
  );
  return result.rows;
};
