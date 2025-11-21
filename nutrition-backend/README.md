# Nutrition Tracker Backend

AI-powered nutrition tracking API with Claude integration.

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy example
cp .env.example .env

# Edit .env and add your Claude API key
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get API key: https://console.anthropic.com/

### 3. Run Locally
```bash
# Start server
npm start

# Or with auto-reload
npm run dev
```

Server runs on: http://localhost:3000

## Test API

### Health Check
```bash
curl http://localhost:3000/
```

### Track Food
```bash
curl -X POST http://localhost:3000/track-food \
  -H "Content-Type: application/json" \
  -d '{"description": "I had scrambled eggs and toast"}'
```

## Deploy to Vercel

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Deploy
```bash
vercel
```

### 3. Add Environment Variable
```bash
vercel env add ANTHROPIC_API_KEY
```
Paste your Claude API key when prompted.

### 4. Deploy to Production
```bash
vercel --prod
```

Your API will be live at: `https://your-app.vercel.app`

## Integration with Flutter

After deploying, update your Flutter app:

```dart
// lib/services/ai_service.dart
static const String BACKEND_URL = 'https://your-app.vercel.app';
```

## API Endpoints

### POST /track-food
Track a meal with natural language.

**Request:**
```json
{
  "description": "I had grilled chicken with rice"
}
```

**Response:**
```json
{
  "foods": [
    {
      "item": "Grilled Chicken",
      "portion": "150g",
      "calories": 226,
      "protein": 27,
      "carbs": 0,
      "fat": 12
    }
  ],
  "totals": {
    "calories": 356,
    "protein": 30,
    "carbs": 28,
    "fat": 12
  },
  "insight": "Great protein-rich meal!"
}
```

### GET /daily-summary/:userId
Get daily nutrition summary.

### POST /ai-insights
Get personalized AI insights.

## Cost

- Claude API: ~$0.01-0.02 per request
- Vercel: FREE tier
- Total: $5 free credits = 250-500 requests

Perfect for hackathon demos!

## Security

✅ API key stored in environment (not code)
✅ CORS enabled
✅ Input validation
✅ Error handling

## Support

- Claude Docs: https://docs.anthropic.com/
- Vercel Docs: https://vercel.com/docs
