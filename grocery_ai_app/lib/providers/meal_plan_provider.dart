import 'package:flutter/foundation.dart';
import '../models/meal_plan.dart';
import '../services/ai_service.dart';

class MealPlanProvider with ChangeNotifier {
  final AIService _aiService = AIService();
  List<MealPlan> _mealPlans = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<MealPlan> get mealPlans => _mealPlans;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<Map<String, dynamic>> generateMealPlan({
    required String userId,
    required List<String> dietaryPreferences,
    required int days,
    required double budget,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final data = await _aiService.generateMealPlan(
        userId: userId,
        dietaryPreferences: dietaryPreferences,
        days: days,
        budget: budget,
      );

      final List<dynamic> mealsJson = data['meals'] ?? [];
      _mealPlans = mealsJson
          .map((e) => MealPlan.fromJson(e as Map<String, dynamic>))
          .toList();

      notifyListeners();
      return data;
    } catch (e) {
      _errorMessage = e.toString();
      debugPrint('Error in MealPlanProvider.generateMealPlan: $e');
      notifyListeners();
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void clearMealPlans() {
    _mealPlans.clear();
    _errorMessage = null;
    notifyListeners();
  }
}
