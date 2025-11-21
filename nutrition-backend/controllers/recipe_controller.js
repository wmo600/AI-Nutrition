// controllers/recipe_controller.js
const recipeService = require('../services/recipe_service');

exports.getSuggestions = async (req, res) => {
  try {
    const { userId, ingredients = [], dietaryPreferences = [] } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const suggestions = await recipeService.generateSuggestions(
      userId,
      ingredients,
      dietaryPreferences
    );

    res.json(suggestions);
  } catch (err) {
    console.error('Recipe suggestions error:', err);
    res.status(500).json({
      error: 'Failed to generate recipe suggestions',
      message: err.message,
    });
  }
};
