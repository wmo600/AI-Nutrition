import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/env_config.dart';

class AIService {
  Future<Map<String, dynamic>> generateMealPlan({
    required List<String> dietaryPreferences,
    required int days,
    required double budget,
  }) async {
    // If mock data is enabled, return mock data immediately
    if (EnvConfig.enableMockData) {
      return _getMockMealPlan(days, budget);
    }

    try {
      if (EnvConfig.useBackend) {
        return await _generateMealPlanViaBackend(
          dietaryPreferences: dietaryPreferences,
          days: days,
          budget: budget,
        );
      } else {
        return await _generateMealPlanDirect(
          dietaryPreferences: dietaryPreferences,
          days: days,
          budget: budget,
        );
      }
    } catch (e) {
      print('Error generating meal plan: $e');
      // Fallback to mock data if API fails
      return _getMockMealPlan(days, budget);
    }
  }

  Future<Map<String, dynamic>> _generateMealPlanDirect({
    required List<String> dietaryPreferences,
    required int days,
    required double budget,
  }) async {
    if (EnvConfig.anthropicApiKey.isEmpty) {
      throw Exception('Anthropic API key not configured');
    }

    final prompt = '''
You are a professional nutritionist and meal planner. Create a detailed $days-day meal plan.

Requirements:
- Dietary preferences: ${dietaryPreferences.isEmpty ? 'None (flexible)' : dietaryPreferences.join(', ')}
- Budget: \$$budget for the week
- Include breakfast, lunch, dinner, and snacks for each day
- Provide a complete grocery list with estimated prices

Return ONLY a JSON object in this exact format (no markdown, no code blocks):
{
  "meals": [
    {
      "day": 1,
      "breakfast": "meal description",
      "lunch": "meal description",
      "dinner": "meal description",
      "snacks": "snack description"
    }
  ],
  "groceryList": [
    {
      "name": "item name",
      "quantity": "amount",
      "price": 4.99,
      "category": "Vegetables"
    }
  ],
  "estimatedCost": 75.50,
  "totalCost": 75.50
}

Make the meal plan healthy, balanced, and within budget. Be creative but practical.
''';

    final response = await http.post(
      Uri.parse(EnvConfig.anthropicApiUrl),
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': EnvConfig.anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: jsonEncode({
        'model': EnvConfig.anthropicModel,
        'max_tokens': 2000,
        'messages': [
          {
            'role': 'user',
            'content': prompt,
          }
        ],
      }),
    ).timeout(Duration(seconds: EnvConfig.requestTimeout));

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final aiResponse = data['content'][0]['text'] as String;

      // Clean up the response (remove markdown if present)
      String cleanedResponse = aiResponse
          .replaceAll('```json', '')
          .replaceAll('```', '')
          .trim();

      final mealPlanData = jsonDecode(cleanedResponse);
      return mealPlanData as Map<String, dynamic>;
    } else {
      throw Exception('API request failed: ${response.statusCode}');
    }
  }

  Future<Map<String, dynamic>> _generateMealPlanViaBackend({
    required List<String> dietaryPreferences,
    required int days,
    required double budget,
  }) async {
    if (EnvConfig.backendUrl.isEmpty) {
      throw Exception('Backend URL not configured');
    }

    final headers = <String, String>{
      'Content-Type': 'application/json',
    };
    
    // Add backend API key if configured
    if (EnvConfig.backendApiKey.isNotEmpty) {
      headers['Authorization'] = 'Bearer ${EnvConfig.backendApiKey}';
    }

    final response = await http.post(
      Uri.parse('${EnvConfig.backendUrl}/generate-meal-plan'),
      headers: headers,
      body: jsonEncode({
        'dietaryPreferences': dietaryPreferences,
        'days': days,
        'budget': budget,
      }),
    ).timeout(Duration(seconds: EnvConfig.requestTimeout));

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data as Map<String, dynamic>;
    } else {
      throw Exception('Backend request failed: ${response.statusCode}');
    }
  }

  Future<List<String>> generateRecipeSuggestions({
    required List<String> ingredients,
    required List<String> dietaryPreferences,
  }) async {
    // If mock data is enabled, return mock data immediately
    if (EnvConfig.enableMockData) {
      return _getMockRecipes();
    }

    try {
      if (EnvConfig.useBackend) {
        return await _generateRecipesViaBackend(
          ingredients: ingredients,
          dietaryPreferences: dietaryPreferences,
        );
      } else {
        return await _generateRecipesDirect(
          ingredients: ingredients,
          dietaryPreferences: dietaryPreferences,
        );
      }
    } catch (e) {
      print('Error generating recipes: $e');
      return _getMockRecipes();
    }
  }

  Future<List<String>> _generateRecipesDirect({
    required List<String> ingredients,
    required List<String> dietaryPreferences,
  }) async {
    if (EnvConfig.anthropicApiKey.isEmpty) {
      throw Exception('Anthropic API key not configured');
    }

    final prompt = '''
Based on these ingredients: ${ingredients.join(', ')}
And dietary preferences: ${dietaryPreferences.isEmpty ? 'None' : dietaryPreferences.join(', ')}

Suggest 5 creative recipe ideas. Return ONLY a JSON array of recipe names, nothing else:
["Recipe 1", "Recipe 2", "Recipe 3", "Recipe 4", "Recipe 5"]
''';

    final response = await http.post(
      Uri.parse(EnvConfig.anthropicApiUrl),
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': EnvConfig.anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: jsonEncode({
        'model': EnvConfig.anthropicModel,
        'max_tokens': 500,
        'messages': [
          {
            'role': 'user',
            'content': prompt,
          }
        ],
      }),
    ).timeout(Duration(seconds: EnvConfig.requestTimeout));

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final aiResponse = data['content'][0]['text'] as String;

      String cleanedResponse = aiResponse
          .replaceAll('```json', '')
          .replaceAll('```', '')
          .trim();

      final List<dynamic> recipes = jsonDecode(cleanedResponse);
      return recipes.map((e) => e.toString()).toList();
    } else {
      throw Exception('API request failed: ${response.statusCode}');
    }
  }

  Future<List<String>> _generateRecipesViaBackend({
    required List<String> ingredients,
    required List<String> dietaryPreferences,
  }) async {
    if (EnvConfig.backendUrl.isEmpty) {
      throw Exception('Backend URL not configured');
    }

    final headers = <String, String>{
      'Content-Type': 'application/json',
    };
    
    if (EnvConfig.backendApiKey.isNotEmpty) {
      headers['Authorization'] = 'Bearer ${EnvConfig.backendApiKey}';
    }

    final response = await http.post(
      Uri.parse('${EnvConfig.backendUrl}/recipe-suggestions'),
      headers: headers,
      body: jsonEncode({
        'ingredients': ingredients,
        'dietaryPreferences': dietaryPreferences,
      }),
    ).timeout(Duration(seconds: EnvConfig.requestTimeout));

    if (response.statusCode == 200) {
      final List<dynamic> recipes = jsonDecode(response.body);
      return recipes.map((e) => e.toString()).toList();
    } else {
      throw Exception('Backend request failed: ${response.statusCode}');
    }
  }

  // Fallback mock data
  Map<String, dynamic> _getMockMealPlan(int days, double budget) {
    return {
      'meals': List.generate(days, (index) => {
        'day': index + 1,
        'breakfast': 'Overnight oats with fresh berries and honey',
        'lunch': 'Grilled chicken quinoa bowl with roasted vegetables',
        'dinner': 'Baked salmon with steamed broccoli and sweet potato',
        'snacks': 'Greek yogurt, mixed nuts, and fruit',
      }),
      'groceryList': [
        {'name': 'Rolled Oats', 'quantity': '500g', 'price': 3.99, 'category': 'Grains'},
        {'name': 'Fresh Berries', 'quantity': '250g', 'price': 5.49, 'category': 'Fruits'},
        {'name': 'Chicken Breast', 'quantity': '1kg', 'price': 12.99, 'category': 'Meat'},
        {'name': 'Mixed Greens', 'quantity': '1 bag', 'price': 3.99, 'category': 'Vegetables'},
        {'name': 'Quinoa', 'quantity': '500g', 'price': 4.99, 'category': 'Grains'},
        {'name': 'Salmon Fillets', 'quantity': '600g', 'price': 15.99, 'category': 'Meat'},
        {'name': 'Broccoli', 'quantity': '1 bunch', 'price': 2.99, 'category': 'Vegetables'},
        {'name': 'Sweet Potatoes', 'quantity': '1kg', 'price': 3.49, 'category': 'Vegetables'},
        {'name': 'Greek Yogurt', 'quantity': '500g', 'price': 4.99, 'category': 'Dairy'},
        {'name': 'Mixed Nuts', 'quantity': '200g', 'price': 6.99, 'category': 'Snacks'},
      ],
      'estimatedCost': budget * 0.85,
      'totalCost': 69.89,
    };
  }

  List<String> _getMockRecipes() {
    return [
      'Mediterranean Quinoa Salad',
      'Teriyaki Chicken Stir-Fry',
      'Creamy Pasta Primavera',
      'Southwest Black Bean Bowl',
      'Asian-Inspired Buddha Bowl',
    ];
  }
}
