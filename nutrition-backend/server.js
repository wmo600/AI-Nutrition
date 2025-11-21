const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Claude AI
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Mock food database (replace with your dataset later)
const FOOD_DATABASE = {
  'egg': { calories: 173, protein: 42.4, carbs: 1.1, fat: 11.5 },
  'eggs': { calories: 173, protein: 42.4, carbs: 1.1, fat: 11.5 },
  'chicken': { calories: 226, protein: 27.1, carbs: 0, fat: 12 },
  'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  'bread': { calories: 80, protein: 3, carbs: 15, fat: 1 },
  'apple': { calories: 66, protein: 0.3, carbs: 14, fat: 0.2 },
  'banana': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  'salmon': { calories: 208, protein: 20, carbs: 0, fat: 13 },
  'broccoli': { calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  'pasta': { calories: 131, protein: 5, carbs: 25, fat: 1.1 }
};

// Helper: Search food in database
function searchFood(query) {
  const lowerQuery = query.toLowerCase();
  const matches = [];
  
  for (const [food, nutrition] of Object.entries(FOOD_DATABASE)) {
    if (lowerQuery.includes(food)) {
      matches.push({ food, ...nutrition });
    }
  }
  
  return matches;
}

// Main endpoint: Track food with AI
app.post('/track-food', async (req, res) => {
  try {
    const { description } = req.body;
    
    if (!description || description.trim() === '') {
      return res.status(400).json({ error: 'Description is required' });
    }
    
    console.log(`📝 Tracking food: "${description}"`);
    
    // Search in database
    const dbMatches = searchFood(description);
    const contextInfo = dbMatches.length > 0
      ? `Found in database:\n${dbMatches.map(m => `- ${m.food}: ${m.calories} cal, ${m.protein}g protein`).join('\n')}`
      : 'No exact matches in database - use your nutrition knowledge';
    
    // Build AI prompt
    const prompt = `You are a nutrition AI assistant. Analyze this meal and provide detailed nutrition tracking.

User description: "${description}"

${contextInfo}

Provide a JSON response with:
1. List of identified foods with estimated portions
2. Nutrition breakdown for each (calories, protein, carbs, fat)
3. Totals
4. A brief, encouraging insight

Response format (return ONLY valid JSON, no markdown):
{
  "foods": [
    {
      "item": "Food name",
      "portion": "Estimated portion (e.g., 2 eggs, 1 cup)",
      "calories": 0,
      "protein": 0,
      "carbs": 0,
      "fat": 0
    }
  ],
  "totals": {
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fat": 0
  },
  "insight": "Brief encouraging message about this meal"
}`;

    console.log('🤖 Calling Claude AI...');
    
    // Call Claude AI
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    });
    
    // Parse response
    let aiText = message.content[0].text;
    
    // Clean markdown if present
    aiText = aiText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    console.log('✅ AI response received');
    
    const result = JSON.parse(aiText);
    
    res.json(result);
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      error: 'Failed to track food',
      message: error.message 
    });
  }
});

// Get daily summary (mock implementation for now)
app.get('/daily-summary/:userId', (req, res) => {
  const { userId } = req.params;
  
  const summary = {
    date: new Date().toISOString().split('T')[0],
    userId: parseInt(userId),
    totals: {
      calories: 1450,
      protein: 85,
      carbs: 180,
      fat: 45
    },
    meals: [
      { time: '08:00', type: 'Breakfast', calories: 350 },
      { time: '13:00', type: 'Lunch', calories: 550 },
      { time: '19:00', type: 'Dinner', calories: 550 }
    ],
    goals: {
      calories: 2000,
      protein: 120,
      carbs: 250,
      fat: 65
    }
  };
  
  res.json(summary);
});

// AI insights endpoint
app.post('/ai-insights', async (req, res) => {
  try {
    const { userId, days = 7 } = req.body;
    
    const prompt = `Provide personalized nutrition insights for a user based on their ${days}-day eating patterns.

Average daily intake:
- Calories: 1600
- Protein: 80g

Provide encouraging insights in JSON:
{
  "positives": ["observation 1", "observation 2", "observation 3"],
  "improvements": ["area 1", "area 2"],
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}

Be positive and practical. Return ONLY valid JSON.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }]
    });
    
    let aiText = message.content[0].text;
    aiText = aiText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const insights = JSON.parse(aiText);
    
    res.json(insights);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    service: 'Nutrition Tracker API',
    version: '1.0.0',
    endpoints: {
      'POST /track-food': 'Track food with AI',
      'GET /daily-summary/:userId': 'Get daily summary',
      'POST /ai-insights': 'Get AI insights'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   🥗 Nutrition Tracker API Started       ║
╚════════════════════════════════════════════╝

✅ Server running on port ${PORT}
🔗 Local: http://localhost:${PORT}
📚 API Docs: http://localhost:${PORT}

Endpoints:
  POST /track-food
  GET  /daily-summary/:userId
  POST /ai-insights

Ready to track nutrition! 🚀
  `);
});

module.exports = app;
