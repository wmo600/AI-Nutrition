// services/meal_plan_service.js
const Anthropic = require('@anthropic-ai/sdk');
const inventoryModel = require('../models/inventory_model');

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

exports.generateMealPlan = async (userId, days, budget, dietaryPreferences) => {
  // 1️⃣ Get current usable inventory
  const inventory = await inventoryModel.getAvailableInventory(userId);

  const invText = inventory.length
    ? inventory
        .map(
          (item) =>
            `- ${item.food_item} (${item.quantity} ${item.unit || ''})`
        )
        .join('\n')
    : 'User currently has no food inventory.';

  // 2️⃣ Prompt including inventory usage rules
  const prompt = `
You are an ASEAN cuisine meal planner.

Create a detailed ${days}-day meal plan focused on:
- Singapore/Malaysia/Indonesia/Thai/Vietnam dishes
- Balanced nutrition and affordable choices

STRICT RULES:
1️⃣ PRIORITIZE USING USER INVENTORY FIRST:
${invText}

2️⃣ Grocery list should ONLY include:
- Items NOT available in inventory OR
- Additional quantities needed beyond what exists

3️⃣ GroceryList must ONLY include items to BUY

4️⃣ Budget rules:
- "estimatedCost" + "totalCost" must be <= $${budget}
- Shopping list should be minimal if inventory is enough

5️⃣ Return ONLY JSON in this EXACT structure:
{
  "meals": [
    {
      "day": 1,
      "breakfast": "... calories",
      "lunch": "... calories",
      "dinner": "... calories",
      "snacks": "... calories"
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
}`;

  console.log('🤖 Generating meal plan w/ inventory for user:', userId);

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

    // 3️⃣ Enforce budget
    plan = validateBudget(plan, Number(budget));

    return plan;
  } catch (err) {
    console.error('❌ AI / Meal Plan Error:', err);
    throw err;
  }
};
