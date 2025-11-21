class MealPlan {
  final int day;
  final String breakfast;
  final String lunch;
  final String dinner;
  final String? snacks;

  MealPlan({
    required this.day,
    required this.breakfast,
    required this.lunch,
    required this.dinner,
    this.snacks,
  });

  factory MealPlan.fromJson(Map<String, dynamic> json) {
    return MealPlan(
      day: json['day'] as int,
      breakfast: json['breakfast'] as String,
      lunch: json['lunch'] as String,
      dinner: json['dinner'] as String,
      snacks: json['snacks'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'day': day,
      'breakfast': breakfast,
      'lunch': lunch,
      'dinner': dinner,
      'snacks': snacks,
    };
  }
}
