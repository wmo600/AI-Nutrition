import 'package:flutter/foundation.dart';
import '../models/grocery_item.dart';
import '../services/ai_service.dart';

class GroceryProvider with ChangeNotifier {
  final AIService _aiService = AIService();
  List<GroceryItem> _groceryList = [];
  bool _isLoading = false;

  List<GroceryItem> get groceryList => _groceryList;
  bool get isLoading => _isLoading;

  double get totalCost {
    return _groceryList.fold(0.0, (sum, item) => sum + item.price);
  }

  int get checkedItemsCount {
    return _groceryList.where((item) => item.isChecked).length;
  }

  void toggleItemChecked(int index) {
    _groceryList[index].isChecked = !_groceryList[index].isChecked;
    notifyListeners();
  }

  void addItem(GroceryItem item) {
    _groceryList.add(item);
    notifyListeners();
  }

  void removeItem(int index) {
    _groceryList.removeAt(index);
    notifyListeners();
  }

  void setGroceryList(List<GroceryItem> items) {
    _groceryList = items;
    notifyListeners();
  }

  Future<void> generateListFromMealPlan(List<Map<String, dynamic>> mealPlanData) async {
    _isLoading = true;
    notifyListeners();

    try {
      // Extract grocery list from meal plan
      final List<GroceryItem> items = [];
      for (var item in mealPlanData) {
        items.add(GroceryItem.fromJson(item));
      }
      _groceryList = items;
    } catch (e) {
      debugPrint('Error generating grocery list: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void clearList() {
    _groceryList.clear();
    notifyListeners();
  }
}
