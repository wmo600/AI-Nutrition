// app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

// Route Imports
const mealRoutes = require('./routes/meal_route');
const recipeRoutes = require('./routes/recipe_route');
const visionRoutes = require('./routes/vision_route');
const inventoryRoutes = require('./routes/inventory_route');
const dashboardRoutes = require('./routes/dashboard_route');
const authRoutes = require('./routes/auth_route');
const auth = require('./middleware/auth_middleware');



// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/meal', auth, mealRoutes);
app.use('/api/recipe', auth, recipeRoutes);
app.use('/api/vision', auth, visionRoutes);
app.use('/api/inventory', auth, inventoryRoutes);
app.use('/api/dashboard', auth, dashboardRoutes);

// Health Check
app.get('/', (req, res) =>
  res.json({ status: 'ok', service: 'Nutrition API', version: '2.0.0' })
);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

module.exports = app;