import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/meal_plan_provider.dart';
import '../providers/grocery_provider.dart';
import '../providers/user_provider.dart';
import '../models/grocery_item.dart';
import '../theme/app_colors.dart';

class PlannerScreen extends StatefulWidget {
  const PlannerScreen({super.key});

  @override
  State<PlannerScreen> createState() => _PlannerScreenState();
}

class _PlannerScreenState extends State<PlannerScreen> {
  int _selectedDays = 3;

  Future<void> _generateMealPlan() async {
    final userProvider = context.read<UserProvider>();
    final mealPlanProvider = context.read<MealPlanProvider>();
    final groceryProvider = context.read<GroceryProvider>();

    final prefs = userProvider.preferences;
    if (prefs == null) return;

    try {
      final result = await mealPlanProvider.generateMealPlan(
        dietaryPreferences: prefs.dietaryPreferences,
        days: _selectedDays,
        budget: prefs.weeklyBudget,
      );

      // Generate grocery list from meal plan
      final List<GroceryItem> groceryList = [];
      for (var item in result['groceryList']) {
        groceryList.add(GroceryItem.fromJson(item));
      }
      groceryProvider.setGroceryList(groceryList);

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Meal plan generated!')),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final mealPlanProvider = context.watch<MealPlanProvider>();
    final mealPlans = mealPlanProvider.mealPlans;
    final isLoading = mealPlanProvider.isLoading;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Meal Planner'),
        actions: [
          if (mealPlans.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.refresh),
              onPressed: _generateMealPlan,
            ),
        ],
      ),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            color: AppColors.primary.withOpacity(0.1),
            child: Column(
              children: [
                Text(
                  'Plan for $_selectedDays days',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    TextButton(
                      onPressed: () => setState(() => _selectedDays = 3),
                      style: TextButton.styleFrom(
                        backgroundColor: _selectedDays == 3
                            ? AppColors.primary
                            : Colors.transparent,
                        foregroundColor: _selectedDays == 3
                            ? Colors.white
                            : AppColors.primary,
                      ),
                      child: const Text('3 Days'),
                    ),
                    const SizedBox(width: 8),
                    TextButton(
                      onPressed: () => setState(() => _selectedDays = 5),
                      style: TextButton.styleFrom(
                        backgroundColor: _selectedDays == 5
                            ? AppColors.primary
                            : Colors.transparent,
                        foregroundColor: _selectedDays == 5
                            ? Colors.white
                            : AppColors.primary,
                      ),
                      child: const Text('5 Days'),
                    ),
                    const SizedBox(width: 8),
                    TextButton(
                      onPressed: () => setState(() => _selectedDays = 7),
                      style: TextButton.styleFrom(
                        backgroundColor: _selectedDays == 7
                            ? AppColors.primary
                            : Colors.transparent,
                        foregroundColor: _selectedDays == 7
                            ? Colors.white
                            : AppColors.primary,
                      ),
                      child: const Text('7 Days'),
                    ),
                  ],
                ),
              ],
            ),
          ),
          Expanded(
            child: isLoading
                ? const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CircularProgressIndicator(),
                        SizedBox(height: 16),
                        Text('AI is creating your meal plan...'),
                      ],
                    ),
                  )
                : mealPlans.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(
                              Icons.restaurant_menu,
                              size: 64,
                              color: AppColors.textHint,
                            ),
                            const SizedBox(height: 16),
                            Text(
                              'No meal plan yet',
                              style: Theme.of(context).textTheme.titleLarge,
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Generate your first AI-powered meal plan',
                              style: Theme.of(context).textTheme.bodyMedium,
                            ),
                            const SizedBox(height: 24),
                            ElevatedButton.icon(
                              onPressed: _generateMealPlan,
                              icon: const Icon(Icons.auto_awesome),
                              label: const Text('Generate Meal Plan'),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: mealPlans.length,
                        itemBuilder: (context, index) {
                          final plan = mealPlans[index];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 16),
                            child: ExpansionTile(
                              title: Text(
                                'Day ${plan.day}',
                                style: Theme.of(context).textTheme.titleLarge,
                              ),
                              children: [
                                Padding(
                                  padding: const EdgeInsets.all(16),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      _MealRow(
                                        icon: Icons.wb_sunny,
                                        label: 'Breakfast',
                                        meal: plan.breakfast,
                                      ),
                                      const Divider(height: 24),
                                      _MealRow(
                                        icon: Icons.lunch_dining,
                                        label: 'Lunch',
                                        meal: plan.lunch,
                                      ),
                                      const Divider(height: 24),
                                      _MealRow(
                                        icon: Icons.dinner_dining,
                                        label: 'Dinner',
                                        meal: plan.dinner,
                                      ),
                                      if (plan.snacks != null) ...[
                                        const Divider(height: 24),
                                        _MealRow(
                                          icon: Icons.cookie,
                                          label: 'Snacks',
                                          meal: plan.snacks!,
                                        ),
                                      ],
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
          ),
        ],
      ),
      floatingActionButton: mealPlans.isNotEmpty
          ? FloatingActionButton.extended(
              onPressed: _generateMealPlan,
              icon: const Icon(Icons.refresh),
              label: const Text('Regenerate'),
            )
          : null,
    );
  }
}

class _MealRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String meal;

  const _MealRow({
    required this.icon,
    required this.label,
    required this.meal,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, color: AppColors.primary, size: 24),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      color: AppColors.primary,
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 4),
              Text(
                meal,
                style: Theme.of(context).textTheme.bodyMedium,
              ),
            ],
          ),
        ),
      ],
    );
  }
}
