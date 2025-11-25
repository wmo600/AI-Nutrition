# 🥗 AI-Nutrition

AI-powered nutrition tracking and meal planning app with smart grocery lists and meal recommendations.

[![Flutter](https://img.shields.io/badge/Flutter-3.0+-02569B?logo=flutter)](https://flutter.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 📱 Download App

**Latest Release**: [v1.0.2](https://github.com/wmo600/AI-Nutrition/releases/latest)

[📥 Download APK](https://github.com/wmo600/AI-Nutrition/releases/latest)

---

## ✨ Features

- 🔐 **User Authentication** - Secure email/password registration and login
- 🤖 **AI Meal Planning** - Generate personalized weekly meal plans based on dietary preferences and budget
- 📊 **Nutrition Dashboard** - Track daily macros (calories, protein, carbs, fat)
- 📸 **Vision Scanning** - AI-powered fridge/pantry scanning to detect food items
- 🛒 **Smart Grocery Lists** - Auto-generated shopping lists from meal plans
- 🏪 **Store Comparison** - Find best deals at nearby stores (WIP)
- 📈 **Food Logging** - Comprehensive meal tracking with 2,200+ food items database (WIP)
- 🍽️ **Recipe Suggestions** - Get recipe ideas based on available ingredients

---

## 🚀 Quick Start

### For End Users (Testers)

1. **Download APK**
```
   Download from: https://github.com/wmo600/AI-Nutrition/releases/latest
```

2. **Install on Android Device**
   - Open the APK file
   - Allow installation from unknown sources if prompted
   - Install and launch

3. **Register Account**
   - Open app
   - Tap "Register"
   - Enter name, email, and password
   - Start using!

### For Developers

See [Development Setup](#-development-setup) below.

---

## 🏗️ Architecture
```
┌─────────────────┐
│  Flutter App    │  ← Mobile Client (Android/iOS)
│  (Dart)         │
└────────┬────────┘
         │ REST API
         │
┌────────▼────────┐
│  Node.js API    │  ← Express.js Backend
│  (JavaScript)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼────┐
│ PostgreSQL  │  │ Anthropic │
│ Database    │  │ Claude API│
└─────────┘  └───────┘
```

### Tech Stack

**Frontend (Flutter)**
- Flutter 3.x
- Provider (State Management)
- HTTP Client
- Image Picker
- Secure Storage (JWT tokens)

**Backend (Node.js)**
- Express.js
- PostgreSQL
- Anthropic Claude API (Haiku 4.5)
- JWT Authentication
- Deployed on Vercel

**Database**
- PostgreSQL
- 2,200+ food items with nutrition data
- 10,000+ historical food logs
- User accounts & preferences

---

## 📖 Documentation

### API Endpoints

#### Authentication
```http
POST /api/auth/register
Content-Type: application/json

{
  "userName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
```http
POST /api/auth/login-email
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "userId": "usr_abc123",
  "userName": "John Doe",
  "email": "john@example.com",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### Meal Planning
```http
POST /api/meal/generate
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "userId": "usr_abc123",
  "dietaryPreferences": ["Vegetarian", "Gluten-Free"],
  "days": 7,
  "budget": 100
}

Response:
{
  "meals": [
    {
      "day": 1,
      "breakfast": "Overnight oats with berries",
      "lunch": "Quinoa bowl with roasted vegetables",
      "dinner": "Grilled salmon with asparagus",
      "snacks": "Greek yogurt with honey"
    }
  ],
  "groceryList": [
    {
      "name": "Rolled Oats",
      "quantity": "500g",
      "estimatedCost": 3.99,
      "category": "Grains"
    }
  ],
  "totalCost": 89.50
}
```

#### Dashboard
```http
GET /api/dashboard/:userId
Authorization: Bearer <accessToken>

Response:
{
  "date": "2025-01-15",
  "macros": {
    "total_calories": 1850,
    "total_protein": 92,
    "total_carbs": 210,
    "total_fat": 65,
    "meals_logged": 3
  },
  "meals": [...],
  "weekly": [...]
}
```

#### Vision Scanning
```http
POST /api/vision/analyze
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "userId": "usr_abc123",
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQ...",
  "imageType": "image/jpeg"
}

Response:
{
  "visionLogId": 42,
  "detectedItems": [
    {
      "item": "Eggs",
      "quantity": 12,
      "unit": "units",
      "confidence": 0.95
    }
  ]
}
```

**Full API Documentation**

---

## 💻 Development Setup

### Prerequisites

- **Flutter SDK** 3.0 or higher
- **Node.js** 18 or higher
- **PostgreSQL** 13 or higher
- **Git**
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

### 1. Clone Repository
```bash
git clone https://github.com/wmo600/AI-Nutrition.git
cd AI-Nutrition
```

### 2. Backend Setup
```bash
cd nutrition-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your credentials
nano .env
```

**Required Environment Variables:**
```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Anthropic AI
ANTHROPIC_API_KEY=sk-ant-your-api-key-here
ANTHROPIC_MODEL=claude-haiku-4-5-20251001

# Authentication
JWT_SECRET=your-super-secret-jwt-key
REFRESH_SECRET=your-super-secret-refresh-key
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d

# Server
NODE_ENV=development
PORT=3000
```

**Setup Database:**
```bash

# Import food database (2,200+ items)
node scripts/import_food_database.js

# Import sample food logs
node scripts/import_food_logs.js
```

**Start Backend:**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Backend will run at `http://localhost:3000`

### 3. Flutter App Setup
```bash
cd ../grocery_ai_app  # or your Flutter folder name

# Install dependencies
flutter pub get

# Create environment file
cp .env.example .env

# Edit .env
nano .env
```

**.env for Flutter:**
```env
BACKEND_URL=http://localhost:3000
# OR for production
# BACKEND_URL=https://ai-nutrition-two.vercel.app

APP_NAME=AI-Nutrition
```

**Run Flutter App:**
```bash
# Check connected devices
flutter devices

# Run on connected device/emulator
flutter run

# Run in debug mode
flutter run --debug

# Run in release mode (faster)
flutter run --release
```

### 4. Build APK
```bash
# Debug APK (larger, includes debugging symbols)
flutter build apk --debug

# Release APK (optimized, smaller)
flutter build apk --release

# Split per ABI (smaller downloads)
flutter build apk --split-per-abi --release
```

APK location: `build/app/outputs/flutter-apk/`

---

## 🗂️ Project Structure
```
AI-Nutrition/
├── nutrition-backend/              # Node.js Backend
│   ├── controllers/               # Request handlers
│   │   ├── auth_controller.js
│   │   ├── meal_plan_controller.js
│   │   ├── dashboard_controller.js
│   │   ├── vision_controller.js
│   │   └── ...
│   ├── models/                    # Database models
│   │   ├── user_model.js
│   │   ├── food_model.js
│   │   └── ...
│   ├── routes/                    # API routes
│   │   ├── auth_route.js
│   │   ├── meal_route.js
│   │   └── ...
│   ├── services/                  # Business logic
│   │   ├── auth_service.js
│   │   ├── ai_service.js
│   │   ├── meal_plan_service.js
│   │   └── ...
│   ├── middleware/                # Express middleware
│   │   └── auth_middleware.js
│   ├── scripts/                   # Database scripts
│   │   ├── import_food_database.js
│   │   └── import_food_logs.js
│   ├── app.js                     # Express app
│   ├── server.js                  # Entry point
│   ├── package.json
│   └── vercel.json               # Vercel config
│
├── grocery_ai_app/                # Flutter App
│   ├── lib/
│   │   ├── main.dart             # App entry point
│   │   ├── models/               # Data models
│   │   │   ├── user_preferences.dart
│   │   │   ├── meal_plan.dart
│   │   │   └── grocery_item.dart
│   │   ├── providers/            # State management
│   │   │   ├── user_provider.dart
│   │   │   ├── meal_plan_provider.dart
│   │   │   └── grocery_provider.dart
│   │   ├── screens/              # UI screens
│   │   │   ├── splash_screen.dart
│   │   │   ├── login_screen.dart
│   │   │   ├── home_screen.dart
│   │   │   ├── planner_screen.dart
│   │   │   ├── dashboard_screen.dart
│   │   │   ├── vision_screen.dart
│   │   │   └── ...
│   │   ├── services/             # API services
│   │   │   ├── auth_service.dart
│   │   │   ├── ai_service.dart
│   │   │   ├── api_handler.dart
│   │   │   └── ...
│   │   ├── theme/                # App theme
│   │   │   ├── app_theme.dart
│   │   │   └── app_colors.dart
│   │   └── config/               # Configuration
│   │       └── env_config.dart
│   ├── android/                  # Android config
│   ├── ios/                      # iOS config
│   ├── pubspec.yaml             # Flutter dependencies
│   └── .env                     # Environment variables
│
├── Dataset.xlsx                  # Food database import file
├── README.md                     # This file
├── .gitignore
└── LICENSE
```

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication**
- [ ] Register new account with email/password
- [ ] Login with email/password
- [ ] Session persists after app restart
- [ ] Logout clears session

**Meal Planning**
- [ ] Generate 3-day meal plan
- [ ] Generate 7-day meal plan with dietary preferences
- [ ] Verify grocery list is generated
- [ ] Check budget constraint is respected

**Dashboard**
- [ ] View today's macros
- [ ] View meal logs for today
- [ ] View weekly summary chart
- [ ] Refresh data updates correctly

**Vision Scanning**
- [ ] Take photo of food items
- [ ] AI correctly detects items
- [ ] Can select/deselect detected items
- [ ] Add selected items to inventory

**Navigation**
- [ ] All bottom navigation tabs work
- [ ] Back button navigation works
- [ ] App doesn't crash on navigation

### Test Credentials

For testing purposes:
- **Email**: `test@example.com`
- **Password**: `test123`

Or register your own account!

### Running Tests
```bash
# Backend unit tests
cd nutrition-backend
npm test

# Flutter widget tests
cd grocery_ai_app
flutter test

# Flutter integration tests
flutter test integration_test
```

---

## 🚢 Deployment

### Backend (Vercel)

1. **Install Vercel CLI**
```bash
   npm install -g vercel
```

2. **Deploy**
```bash
   cd nutrition-backend
   vercel --prod
```

3. **Set Environment Variables**
   - Go to Vercel Dashboard
   - Project Settings → Environment Variables
   - Add all variables from `.env`

### Flutter App

**Android Release:**
```bash
flutter build apk --release
```

**iOS Release:**
```bash
flutter build ios --release
```

---

## 🐛 Troubleshooting

### Backend Issues

**Database connection fails**
```bash
# Check DATABASE_URL is correct
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

**API returns 401 Unauthorized**
- Check JWT_SECRET is set in environment variables
- Verify access token hasn't expired (15 min default)
- Use refresh token to get new access token

### Flutter Issues

**Build fails**
```bash
flutter clean
flutter pub get
flutter build apk --release
```

**API connection fails**
- Check BACKEND_URL in `.env`
- Ensure backend is running
- Check network permissions in `AndroidManifest.xml`

**App crashes on startup**
- Check all dependencies are installed: `flutter pub get`
- Clear cache: `flutter clean`

---


## 👥 Contributors

- **wmo600**  - Solo


---


## 🙏 Acknowledgments

- [Anthropic Claude](https://www.anthropic.com/) - AI meal planning and vision
- [Flutter](https://flutter.dev/) - Mobile framework
- [Vercel](https://vercel.com/) - Backend hosting
- Our amazing hackathon team! 🎉

---

## 📧 Contact

For questions or support:
- Email: woo.197588@gmail.com

---

## ⭐ Star This Repo!

If you find this project interesting, please give it a star! It helps others discover the project.

---

**Made with ❤️ for [SOC X CLS]**
