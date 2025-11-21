// services/meal_plan_service.js
const Anthropic = require('@anthropic-ai/sdk');
const inventoryModel = require('../models/inventory_model');
const db = require('../services/db'); // ⬅️ Postgres connection

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';

function calculateTotalCost(plan) {
  if (!plan?.groceryList) return 0;
  return plan.groceryList.reduce((sum, item) => {
    const val = Number(item.estimatedCost) || 0;
    return sum + val;
  }, 0);
}

function validateBudget(plan, budget) {
  const total = calculateTotalCost(plan);
  if (total > budget) {
    throw new Error(
      `Meal plan exceeds budget: $${total.toFixed(2)} > $${budget.toFixed(2)}`
    );
  }
  return { ...plan, totalCost: total, estimatedCost: total };
}

// 1️⃣ Load a slice of your food_database as macro context
async function buildFoodDbContext() {
  try {
    const result = await db.query(
      `
      SELECT 
        food_item,
        food_category,
        serving_size,
        calories,
        protein,
        carbohydrates,
        fat
      FROM food_database
      WHERE calories IS NOT NULL
      ORDER BY id
      LIMIT 60;
      `
    );

    const rows = result.rows || [];
    if (!rows.length) {
      return 'No foods are currently available in the local nutrition database.';
    }

    return rows
      .map((f) => {
        const cals = f.calories != null ? `${f.calories} kcal` : 'N/A kcal';
        const protein = f.protein != null ? `${f.protein}g protein` : 'N/A protein';
        const carbs =
          f.carbohydrates != null ? `${f.carbohydrates}g carbs` : 'N/A carbs';
        const fat = f.fat != null ? `${f.fat}g fat` : 'N/A fat';

        return `- ${f.food_item} (${f.food_category || 'Unknown category'}, ${
          f.serving_size || '100g'
        }): ${cals}, ${protein}, ${carbs}, ${fat}`;
      })
      .join('\n');
  } catch (err) {
    console.error('⚠️ Failed to build food DB context:', err);
    return 'Local nutrition database is temporarily unavailable. Use your general nutrition knowledge for macros.';
  }
}

exports.generateMealPlan = async (userId, days, budget, dietaryPreferences) => {
  // 1️⃣ Get current usable inventory (from user_inventory)
  const inventory = await inventoryModel.getAvailableInventory(userId);

  const invText = inventory.length
    ? inventory
        .map(
          (item) =>
            `- ${item.food_item} (${item.quantity} ${item.unit || ''})`
        )
        .join('\n')
    : 'User currently has no food inventory.';

  // 2️⃣ Build context from food_database so AI uses YOUR macros
  const foodDbContext = await buildFoodDbContext();

  // 3️⃣ Prompt including inventory + DB macro rules
  const prompt = `
You are an ASEAN cuisine meal planner.

We have a LOCAL NUTRITION DATABASE and a USER INVENTORY:

🔹 LOCAL FOOD DATABASE (TRUSTED MACROS):
Each line is: FoodItem (Category, ServingSize): Calories, Protein, Carbs, Fat
${foodDbContext}

RULES FOR MACROS:
- When a meal uses any food that appears in the database list above,
  you MUST use those macros (calories, protein, carbs, fat) as the primary source.
- Only if a food is NOT clearly in the list are you allowed to estimate macros
  using your general nutrition knowledge.
- When you compute "nutritionSummary", base the values on the macros implied by
  the planned meals, always preferring the database entries where applicable.

🔹 USER INVENTORY (PRIORITY USE BEFORE BUYING):
${invText}

GOAL:
Create a detailed ${days}-day meal plan focused on:
- Singapore / Malaysia / Indonesia / Thai / Vietnam dishes
- Balanced nutrition and affordable choices

STRICT RULES:
1️⃣ PRIORITIZE USING USER INVENTORY FIRST:
   - Design meals that consume items from the inventory where reasonable.
   - Do NOT add inventory items to the groceryList; those are already owned.

2️⃣ Grocery list should ONLY include:
   - Items NOT available in inventory, OR
   - Additional quantities needed beyond what exists.
   - GroceryList MUST represent only items to BUY.

3️⃣ Budget rules:
   - "estimatedCost" (if used) and "totalCost" MUST be <= $${budget}.
   - Shopping list should be minimal if inventory is sufficient.

4️⃣ OUTPUT FORMAT:
Return ONLY valid JSON in this EXACT structure (no markdown, no commentary):
{
  "meals": [
    {
      "day": 1,
      "breakfast": "Description with approximate calories",
      "lunch": "Description with approximate calories",
      "dinner": "Description with approximate calories",
      "snacks": "Description with approximate calories"
    }
  ],
  "groceryList": [
    {
      "name": "item name",
      "quantity": "amount (like 1kg or 6 units)",
      "estimatedCost": 4.99,
      "category": "Vegetables"
    }
  ],
  "estimatedCost": 50.00,
  "totalCost": 50.00,
  "nutritionSummary": {
    "avgDailyCalories": 1800,
    "avgProtein": 80,
    "avgCarbs": 200,
    "avgFat": 60
  }
}
`;

  console.log('🤖 Generating meal plan w/ inventory + DB macros for user:', userId);

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    });

    let raw = response.content[0].text
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/gi, '')
      .trim();

    let plan = JSON.parse(raw);

    // 4️⃣ Enforce budget server-side
    plan = validateBudget(plan, Number(budget));

    return plan;
  } catch (err) {
    console.error('❌ AI / Meal Plan Error:', err);
    // Optionally detect not_found_error for model here if you want a nicer error
    throw err;
  }
};
