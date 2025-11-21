// services/recipe_service.js
const Anthropic = require('@anthropic-ai/sdk');
const inventoryModel = require('../models/inventory_model');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';

exports.generateSuggestions = async (userId, ingredients, dietaryPreferences) => {
  // 1️⃣ Load inventory for this user
  const inventory = await inventoryModel.getAvailableInventory(userId);

  const inventoryText =
    inventory.length === 0
      ? 'User has no tracked inventory items.'
      : inventory
          .map(
            (item) =>
              `- ${item.food_item} (${item.quantity} ${item.unit || ''})`
          )
          .join('\n');

  const ingredientText = ingredients && ingredients.length
    ? ingredients.join(', ')
    : 'None specified';

  const prefsText =
    dietaryPreferences && dietaryPreferences.length
      ? dietaryPreferences.join(', ')
      : 'None';

  const prompt = `
You are an ASEAN home-cooking recipe assistant.

User's current pantry / fridge inventory:
${inventoryText}

User additionally mentioned these ingredients to focus on:
${ingredientText}

Dietary preferences: ${prefsText}

GOAL:
- Suggest 5 creative, practical recipe ideas that:
  - Use AS MUCH as possible of the existing inventory (priority).
  - Help finish perishable items first (meat, vegetables, dairy).
  - Are realistic for a home cook in ASEAN region.
- It is OK to require buying 1–2 extra ingredients, but try to rely mainly on what is already available.

Return ONLY a JSON array of recipe names, with NO descriptions, NO markdown, like:
[
  "Spicy Garlic Stir-Fry Chicken with Veggies",
  "Egg Fried Rice with Leftover Veg",
  "Coconut Milk Veg Curry",
  "Stir-Fried Noodles with Mixed Leftovers",
  "Tofu and Veggie Soup"
]
`;

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 600,
    messages: [{ role: 'user', content: prompt }],
  });

  let aiText = message.content[0].text
    .replace(/```json\n?/gi, '')
    .replace(/```\n?/gi, '')
    .trim();

  const recipes = JSON.parse(aiText);

  // Ensure we always return string[] (to match Flutter AIService)
  return recipes.map((r) => r.toString());
};
