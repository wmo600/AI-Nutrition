import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/env_config.dart';

class AIService {
  // Generate meal plan via backend
  Future<Map<String, dynamic>> generateMealPlan({
    required List<String> dietaryPreferences,
    required int days,
    required double budget,
  }) async {
    try {
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
    } catch (e) {
      print('Error generating meal plan: $e');
      // Fallback to mock data if backend fails
      return _getMockMealPlan(days, budget);
    }
  }

  // Generate recipe suggestions via backend
  Future<List<String>> generateRecipeSuggestions({
    required List<String> ingredients,
    required List<String> dietaryPreferences,
  }) async {
    try {
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
    } catch (e) {
      print('Error generating recipes: $e');
      return _getMockRecipes();
    }
  }

  // Fallback mock data (only used if backend fails)
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
