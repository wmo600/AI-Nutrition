// services/vision_service.js
const Anthropic = require('@anthropic-ai/sdk');
const visionModel = require('../models/vision_model');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';

exports.analyzeImage = async ({ userId, imageBase64, imageType }) => {
  const prompt = `
You are an AI vision assistant. Look at this image of a fridge/pantry and detect food items.

Return ONLY valid JSON in this format:
{
  "detectedItems": [
    {
      "item": "Eggs",
      "quantity": 12,
      "unit": "units",
      "confidence": 0.95
    }
  ]
}
`;

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: imageType || 'image/jpeg',
              data: imageBase64,
            },
          },
        ],
      },
    ],
  });

  let aiText = message.content[0].text
    .replace(/```json\n?/gi, '')
    .replace(/```\n?/gi, '')
    .trim();

  const parsed = JSON.parse(aiText);
  const detectedItems = parsed.detectedItems || [];

  // Split out confidence scores for vision_logs table
  const confidenceScores = detectedItems.map((item) => ({
    item: item.item,
    confidence: item.confidence ?? null,
  }));

  const log = await visionModel.insertVisionLog({
    userId,
    imageDescription: 'Pantry/fridge scan',
    detectedItems,
    confidenceScores,
  });

  return {
    visionLogId: log.id,
    detectedItems,
  };
};
