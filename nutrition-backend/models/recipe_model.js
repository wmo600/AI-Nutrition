// models/recipe_model.js
const db = require('../services/db');

exports.saveRecipe = async (userId, recipe) => {
  const {
    recipe_name,
    ingredients,
    instructions,
    prep_time_minutes,
    cook_time_minutes,
    servings,
    calories_per_serving,
    dietary_tags,
    source = 'ai_generated',
  } = recipe;

  const result = await db.query(
    `
    INSERT INTO recipes (
      user_id,
      recipe_name,
      ingredients,
      instructions,
      prep_time_minutes,
      cook_time_minutes,
      servings,
      calories_per_serving,
      dietary_tags,
      is_favorite,
      source
    )
    VALUES (
      $1, $2, $3::jsonb, $4, $5, $6, $7, $8, $9::jsonb, FALSE, $10
    )
    RETURNING *;
    `,
    [
      userId,
      recipe_name,
      JSON.stringify(ingredients || []),
      instructions || '',
      prep_time_minutes || null,
      cook_time_minutes || null,
      servings || null,
      calories_per_serving || null,
      JSON.stringify(dietary_tags || []),
      source,
    ]
  );

  return result.rows[0];
};
