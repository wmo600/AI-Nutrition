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
    required List<String> dietaryPreferences,
    required int days,
    required double budget,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final result = await _aiService.generateMealPlan(
        dietaryPreferences: dietaryPreferences,
        days: days,
        budget: budget,
      );

      final List<MealPlan> plans = [];
      for (var mealData in result['meals']) {
        plans.add(MealPlan.fromJson(mealData));
      }
      _mealPlans = plans;
      
      notifyListeners();
      return result;
    } catch (e) {
      _errorMessage = 'Failed to generate meal plan: $e';
      debugPrint(_errorMessage);
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
