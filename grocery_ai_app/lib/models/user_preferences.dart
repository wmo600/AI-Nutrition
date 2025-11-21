class UserPreferences {
  final List<String> dietaryPreferences;
  final double weeklyBudget;
  final int householdSize;
  final List<String> allergies;

  UserPreferences({
    required this.dietaryPreferences,
    required this.weeklyBudget,
    required this.householdSize,
    this.allergies = const [],
  });

  factory UserPreferences.fromJson(Map<String, dynamic> json) {
    return UserPreferences(
      dietaryPreferences: List<String>.from(json['dietaryPreferences'] as List),
      weeklyBudget: (json['weeklyBudget'] as num).toDouble(),
      householdSize: json['householdSize'] as int,
      allergies: List<String>.from(json['allergies'] as List? ?? []),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'dietaryPreferences': dietaryPreferences,
      'weeklyBudget': weeklyBudget,
      'householdSize': householdSize,
      'allergies': allergies,
    };
  }
}
