import 'dart:convert';
import 'package:http/http.dart' as http;

class AIService {
  // Using Anthropic API directly (for hackathon demo)
  // Note: In production, you'd want this on a backend
  static const String apiUrl = 'https://api.anthropic.com/v1/messages';
  static const String apiKey = 'YOUR_API_KEY_HERE'; // Get free key from console.anthropic.com
  
  Future<Map<String, dynamic>> generateMealPlan({
    required List<String> dietaryPreferences,
    required int days,
    required double budget,
  }) async {
    try {
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
        Uri.parse(apiUrl),
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: jsonEncode({
          'model': 'claude-3-5-sonnet-20241022',
          'max_tokens': 2000,
          'messages': [
            {
              'role': 'user',
              'content': prompt,
            }
          ],
        }),
      );

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
    } catch (e) {
      print('Error generating meal plan: $e');
      // Fallback to mock data if API fails
      return _getMockMealPlan(days, budget);
    }
  }

  Future<List<String>> generateRecipeSuggestions({
    required List<String> ingredients,
    required List<String> dietaryPreferences,
  }) async {
    try {
      final prompt = '''
Based on these ingredients: ${ingredients.join(', ')}
And dietary preferences: ${dietaryPreferences.isEmpty ? 'None' : dietaryPreferences.join(', ')}

Suggest 5 creative recipe ideas. Return ONLY a JSON array of recipe names, nothing else:
["Recipe 1", "Recipe 2", "Recipe 3", "Recipe 4", "Recipe 5"]
''';

      final response = await http.post(
        Uri.parse(apiUrl),
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: jsonEncode({
          'model': 'claude-3-5-sonnet-20241022',
          'max_tokens': 500,
          'messages': [
            {
              'role': 'user',
              'content': prompt,
            }
          ],
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final aiResponse = data['content'][0]['text'] as String;
        
        String cleanedResponse = aiResponse
            .replaceAll('```json', '')
            .replaceAll('```', '')
            .trim();
        
        final List<dynamic> recipes = jsonDecode(cleanedResponse);
        return recipes.map((e) => e.toString()).toList();
      }
    } catch (e) {
      print('Error generating recipes: $e');
    }
    
    // Fallback
    return [
      'Quick Stir-fry',
      'Pasta Primavera',
      'Veggie Bowl',
      'Grilled Chicken Salad',
      'Homemade Soup',
    ];
  }

  // Fallback mock data if API fails
  Map<String, dynamic> _getMockMealPlan(int days, double budget) {
    return {
      'meals': List.generate(days, (index) => {
        'day': index + 1,
        'breakfast': 'Oatmeal with fresh berries',
        'lunch': 'Grilled chicken salad',
        'dinner': 'Pasta with vegetables',
        'snacks': 'Mixed nuts and fruit',
      }),
      'groceryList': [
        {'name': 'Oats', 'quantity': '500g', 'price': 3.99, 'category': 'Grains'},
        {'name': 'Berries', 'quantity': '250g', 'price': 5.49, 'category': 'Fruits'},
        {'name': 'Chicken', 'quantity': '1kg', 'price': 12.99, 'category': 'Meat'},
        {'name': 'Mixed greens', 'quantity': '1 bag', 'price': 3.99, 'category': 'Vegetables'},
        {'name': 'Pasta', 'quantity': '500g', 'price': 2.49, 'category': 'Grains'},
      ],
      'estimatedCost': budget * 0.85,
      'totalCost': 28.95,
    };
  }
}
