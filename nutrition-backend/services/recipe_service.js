// services/recipe_service.js
const Anthropic = require('@anthropic-ai/sdk');
const inventoryModel = require('../models/inventory_model');
const db = require('../services/db'); // ⬅️ to fetch macros from food_database

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';

// Build DB macro context
async function buildFoodDbContext() {
  try {
    const result = await db.query(
      `
      SELECT food_item, food_category, serving_size, calories, protein, carbohydrates, fat
      FROM food_database
      WHERE calories IS NOT NULL
      ORDER BY id
      LIMIT 60;
      `
    );

    const rows = result.rows || [];
    if (!rows.length) {
      return 'Local nutrition database unavailable — estimate if needed.';
    }

    return rows
      .map((f) => {
        const cals = f.calories != null ? `${f.calories} kcal` : 'N/A kcal';
        const protein = f.protein != null ? `${f.protein}g protein` : 'N/A protein';
        const carbs = f.carbohydrates != null ? `${f.carbohydrates}g carbs` : 'N/A carbs';
        const fat = f.fat != null ? `${f.fat}g fat` : 'N/A fat';
        return `- ${f.food_item} (${f.food_category}, ${
          f.serving_size || '100g'
        }): ${cals}, ${protein}, ${carbs}, ${fat}`;
      })
      .join('\n');
  } catch (err) {
    console.error('⚠️ DB error in food context:', err);
    return 'Database not accessible — estimate nutrition if required.';
  }
}

exports.generateSuggestions = async (userId, ingredients, dietaryPreferences) => {
  // 1️⃣ Load user pantry inventory
  const inventory = await inventoryModel.getAvailableInventory(userId);

  const inventoryText =
    inventory.length === 0
      ? 'Inventory empty — suggestions may require more shopping.'
      : inventory
          .map(
            (item) =>
              `- ${item.food_item} (${item.quantity} ${item.unit || ''})`
          )
          .join('\n');

  const ingredientText = ingredients?.length
    ? ingredients.join(', ')
    : 'None specified';

  const prefsText = dietaryPreferences?.length
    ? dietaryPreferences.join(', ')
    : 'None';

  // 2️⃣ Load DB macros context
  const foodDbContext = await buildFoodDbContext();

  const prompt = `
You are an ASEAN home-cooking recipe assistant.

LOCAL FOOD DATABASE (TRUSTED MACROS):
${foodDbContext}

RULES:
- ALWAYS use the macros from this list when these foods appear in a recipe.
- If a food is NOT listed, use general nutrition knowledge.

USER'S INVENTORY (PRIORITY INGREDIENTS TO FINISH):
${inventoryText}

Additional ingredients user wants to focus on:
${ingredientText}

Dietary preferences: ${prefsText}

GOAL:
Suggest 5 realistic, tasty ASEAN home-cooking recipes that:
- Primarily use existing inventory (finish perishables first!)
- If necessary, require only 1–2 additional purchases
- No descriptions — only recipe names

Return ONLY a JSON array of 5 recipe names:
[
  "Bangkok Basil Chicken with Rice",
  "Egg Fried Rice with Garlic Veggies",
  "Tofu Laksa",
  "Malay Coconut Chicken Soup",
  "Stir Fry Chilli Eggs"
]
`;

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 600,
    messages: [{ role: 'user', content: prompt }],
  });

  const aiText = message.content[0].text
    .replace(/```json\n?/gi, '')
    .replace(/```/gi, '')
    .trim();

  const recipes = JSON.parse(aiText);
  return recipes.map((r) => r.toString());
};
