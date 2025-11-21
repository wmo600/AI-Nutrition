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
  int _selectedDays = 7;

  Future<void> _generatePlan(BuildContext context) async {
    final userProvider = context.read<UserProvider>();
    final mealPlanProvider = context.read<MealPlanProvider>();
    final groceryProvider = context.read<GroceryProvider>();

    final prefs = userProvider.preferences;
    if (prefs == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please set your goals first.')),
      );
      return;
    }

    // TEMP userId strategy:
    // - if you later store a real userId in UserProvider, use that instead
    final String userId = userProvider.userName ?? 'test123';

    try {
      final result = await mealPlanProvider.generateMealPlan(
        userId: userId,
        dietaryPreferences: prefs.dietaryPreferences,
        days: _selectedDays,
        budget: prefs.weeklyBudget,
      );

      // Build grocery list from AI response
      final List<dynamic> listJson = result['groceryList'] ?? [];
      final List<GroceryItem> groceryList = listJson
          .map((item) => GroceryItem.fromJson(item as Map<String, dynamic>))
          .toList();

      groceryProvider.setGroceryList(groceryList);

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Meal plan generated successfully!')),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to generate meal plan: $e')),
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
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Days selector
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Plan length (days)',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                DropdownButton<int>(
                  value: _selectedDays,
                  items: const [3, 5, 7, 10, 14]
                      .map(
                        (d) => DropdownMenuItem(
                          value: d,
                          child: Text('$d days'),
                        ),
                      )
                      .toList(),
                  onChanged: (value) {
                    if (value == null) return;
                    setState(() => _selectedDays = value);
                  },
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Generate button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: isLoading ? null : () => _generatePlan(context),
                icon: const Icon(Icons.auto_awesome),
                label: Text(isLoading ? 'Generating...' : 'Generate Meal Plan'),
              ),
            ),
            const SizedBox(height: 16),

            // Error message
            if (mealPlanProvider.errorMessage != null)
              Padding(
                padding: const EdgeInsets.only(bottom: 8.0),
                child: Text(
                  mealPlanProvider.errorMessage!,
                  style: const TextStyle(color: Colors.red),
                ),
              ),

            // Meal plan list
            Expanded(
              child: mealPlans.isEmpty
                  ? Center(
                      child: Text(
                        isLoading
                            ? 'Generating meal plan...'
                            : 'No meal plan yet. Generate one to get started!',
                        style: Theme.of(context)
                            .textTheme
                            .bodyMedium
                            ?.copyWith(color: AppColors.textSecondary),
                        textAlign: TextAlign.center,
                      ),
                    )
                  : ListView.builder(
                      itemCount: mealPlans.length,
                      itemBuilder: (context, index) {
                        final plan = mealPlans[index];
                        return Card(
                          margin: const EdgeInsets.symmetric(vertical: 8.0),
                          child: Padding(
                            padding: const EdgeInsets.all(12.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Day ${plan.day}',
                                  style: Theme.of(context)
                                      .textTheme
                                      .titleMedium
                                      ?.copyWith(fontWeight: FontWeight.bold),
                                ),
                                const SizedBox(height: 8),
                                _buildMealRow('Breakfast', plan.breakfast),
                                _buildMealRow('Lunch', plan.lunch),
                                _buildMealRow('Dinner', plan.dinner),
                                if (plan.snacks != null &&
                                    plan.snacks!.trim().isNotEmpty)
                                  _buildMealRow('Snacks', plan.snacks!),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMealRow(String label, String meal) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 80,
            child: Text(
              '$label:',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              meal,
              style: const TextStyle(height: 1.3),
            ),
          ),
        ],
      ),
    );
  }
}
