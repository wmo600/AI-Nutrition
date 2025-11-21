const mealService = require('../services/meal_plan_service');

exports.generateMealPlan = async (req, res) => {
  try {
    let {userId, dietaryPreferences, days, budget } = req.body;

    // Defaults only if client does not provide them
    dietaryPreferences = Array.isArray(dietaryPreferences) ? dietaryPreferences : [];
    days = Number(days);
    budget = Number(budget);

    if (!Number.isFinite(days) || days <= 0) {
      return res.status(400).json({
        error: "Invalid days value",
      });
    }

    if (!Number.isFinite(budget) || budget <= 0) {
      return res.status(400).json({
        error: "Invalid budget value",
      });
    }

    const data = await mealService.generateMealPlan(userId, days, budget, dietaryPreferences);

    res.json(data);
  } catch (error) {
    console.error('❌ Meal Plan Controller Error:', error);
    res.status(500).json({
      error: 'Failed to generate meal plan',
      message: error.message,
    });
  }
};
