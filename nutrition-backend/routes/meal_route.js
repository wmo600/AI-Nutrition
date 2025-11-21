// routes/meal_route.js
const express = require('express');
const router = express.Router();
const mealController = require('../controllers/meal_plan_controller');

router.post('/generate', mealController.generateMealPlan);

module.exports = router;
