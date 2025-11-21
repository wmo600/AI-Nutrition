class GroceryItem {
  final String name;
  final String quantity;
  final double price;
  final String category;
  bool isChecked;

  GroceryItem({
    required this.name,
    required this.quantity,
    required this.price,
    required this.category,
    this.isChecked = false,
  });

  factory GroceryItem.fromJson(Map<String, dynamic> json) {
    return GroceryItem(
      name: json['name'] as String,
      quantity: json['quantity'] as String,
      price: (json['price'] as num).toDouble(),
      category: json['category'] as String? ?? 'Other',
      isChecked: json['isChecked'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'quantity': quantity,
      'price': price,
      'category': category,
      'isChecked': isChecked,
    };
  }
}
