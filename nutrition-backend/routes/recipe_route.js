// routes/recipe_route.js
const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe_controller');

// POST /api/recipe/suggestions
router.post('/suggestions', recipeController.getSuggestions);

module.exports = router;
