const db = require('../services/db');

// Get a single-day nutrition summary using SQL function
exports.getDailySummary = async (userId, date) => {
  const result = await db.query(
    `SELECT * FROM get_daily_macros($1, $2);`,
    [userId, date]
  );
  return result.rows[0];
};

// Get logs for the day (breakfast/lunch/dinner breakdown)
exports.getDailyMeals = async (userId, date) => {
  const result = await db.query(
    `
    SELECT food_item, meal_type, calories, protein, carbohydrates, fat
    FROM food_logs
    WHERE user_id = $1
      AND DATE(logged_at) = $2
    ORDER BY logged_at DESC;
    `,
    [userId, date]
  );
  return result.rows;
};

// **Weekly summary**
exports.getWeeklyMacros = async (userId) => {
  const result = await db.query(
    `
    SELECT 
      DATE(logged_at) AS date,
      SUM(calories) AS total_calories,
      SUM(protein) AS total_protein,
      SUM(carbohydrates) AS total_carbs,
      SUM(fat) AS total_fat
    FROM food_logs
    WHERE user_id = $1
      AND logged_at >= CURRENT_DATE - INTERVAL '6 days'
    GROUP BY DATE(logged_at)
    ORDER BY date ASC;
    `,
    [userId]
  );
  return result.rows;
};
