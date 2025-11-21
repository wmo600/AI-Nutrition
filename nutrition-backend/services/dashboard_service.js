const dashboardModel = require('../models/dashboard_model');

exports.getDailyDashboard = async (userId) => {
  const today = new Date().toISOString().split('T')[0];

  const macros = await dashboardModel.getDailySummary(userId, today);
  const meals = await dashboardModel.getDailyMeals(userId, today);
  const weekly = await dashboardModel.getWeeklyMacros(userId);

  return {
    date: today,
    macros: macros || {
      total_calories: 0,
      total_protein: 0,
      total_carbs: 0,
      total_fat: 0,
      meals_logged: 0,
    },
    meals,
    weekly,
  };
};
