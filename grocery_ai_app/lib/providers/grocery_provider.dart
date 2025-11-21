import 'package:flutter/foundation.dart';
import '../models/grocery_item.dart';

class GroceryProvider with ChangeNotifier {
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

  void setGroceryList(List<GroceryItem> items) {
    _groceryList = items;
    notifyListeners();
  }

  void toggleItemChecked(int index) {
    if (index < 0 || index >= _groceryList.length) return;
    _groceryList[index].isChecked = !_groceryList[index].isChecked;
    notifyListeners();
  }

  void clearList() {
    _groceryList.clear();
    notifyListeners();
  }
}
