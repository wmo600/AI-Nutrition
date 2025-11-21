import 'dart:convert';
import 'package:http/http.dart' as http;

class AIService {
  // Option 1: Use your own backend
  static const String backendUrl = 'YOUR_BACKEND_URL';
  
  // Option 2: Use a simple Firebase Function or Vercel serverless function
  // This keeps the API key secure on the server side
  
  Future<Map<String, dynamic>> generateMealPlan({
    required List<String> dietaryPreferences,
    required int days,
    required double budget,
  }) async {
    try {
      // Call your backend which then calls Claude API
      final response = await http.post(
        Uri.parse('$backendUrl/generate-meal-plan'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'dietaryPreferences': dietaryPreferences,
          'days': days,
          'budget': budget,
        }),
      ).timeout(const Duration(seconds: 30));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data as Map<String, dynamic>;
      } else {
        throw Exception('Backend request failed: ${response.statusCode}');
      }
    } catch (e) {
      print('Error: $e');
      // Fallback to mock data
      return _getMockMealPlan(days, budget);
    }
  }

  Future<List<String>> generateRecipeSuggestions({
    required List<String> ingredients,
    required List<String> dietaryPreferences,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$backendUrl/recipe-suggestions'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'ingredients': ingredients,
          'dietaryPreferences': dietaryPreferences,
        }),
      ).timeout(const Duration(seconds: 15));

      if (response.statusCode == 200) {
        final List<dynamic> recipes = jsonDecode(response.body);
        return recipes.map((e) => e.toString()).toList();
      }
    } catch (e) {
      print('Error: $e');
    }
    
    return [
      'Quick Stir-fry',
      'Pasta Primavera',
      'Veggie Bowl',
      'Grilled Chicken Salad',
    ];
  }

  Map<String, dynamic> _getMockMealPlan(int days, double budget) {
    return {
      'meals': List.generate(days, (index) => {
        'day': index + 1,
        'breakfast': 'Healthy breakfast option ${index + 1}',
        'lunch': 'Nutritious lunch ${index + 1}',
        'dinner': 'Balanced dinner ${index + 1}',
        'snacks': 'Smart snacks',
      }),
      'groceryList': [
        {'name': 'Oats', 'quantity': '500g', 'price': 3.99, 'category': 'Grains'},
        {'name': 'Berries', 'quantity': '250g', 'price': 5.49, 'category': 'Fruits'},
      ],
      'estimatedCost': budget * 0.85,
      'totalCost': 9.48,
    };
  }
}
