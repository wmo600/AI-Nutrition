import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/user_provider.dart';
import '../models/user_preferences.dart';
import '../theme/app_colors.dart';
import 'home_screen.dart';

class GoalsScreen extends StatefulWidget {
  const GoalsScreen({super.key});

  @override
  State<GoalsScreen> createState() => _GoalsScreenState();
}

class _GoalsScreenState extends State<GoalsScreen> {
  final List<String> _selectedDietary = [];
  double _budget = 100.0;
  int _householdSize = 2;

  final List<Map<String, dynamic>> _dietaryOptions = [
    {'label': 'Vegetarian', 'icon': Icons.eco},
    {'label': 'Vegan', 'icon': Icons.local_florist},
    {'label': 'Gluten-Free', 'icon': Icons.grain},
    {'label': 'Dairy-Free', 'icon': Icons.no_food},
    {'label': 'Keto', 'icon': Icons.food_bank},
    {'label': 'Paleo', 'icon': Icons.restaurant},
  ];

  void _toggleDietary(String label) {
    setState(() {
      if (_selectedDietary.contains(label)) {
        _selectedDietary.remove(label);
      } else {
        _selectedDietary.add(label);
      }
    });
  }

  Future<void> _saveAndContinue() async {
    final prefs = UserPreferences(
      dietaryPreferences: _selectedDietary,
      weeklyBudget: _budget,
      householdSize: _householdSize,
    );

    await context.read<UserProvider>().savePreferences(prefs);

    if (!mounted) return;
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (context) => const HomeScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Set Your Goals'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Dietary Preferences',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: _dietaryOptions.map((option) {
                final isSelected = _selectedDietary.contains(option['label']);
                return FilterChip(
                  label: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        option['icon'] as IconData,
                        size: 18,
                        color: isSelected ? Colors.white : AppColors.primary,
                      ),
                      const SizedBox(width: 8),
                      Text(option['label'] as String),
                    ],
                  ),
                  selected: isSelected,
                  onSelected: (_) => _toggleDietary(option['label'] as String),
                  selectedColor: AppColors.primary,
                  labelStyle: TextStyle(
                    color: isSelected ? Colors.white : AppColors.textPrimary,
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 32),
            Text(
              'Weekly Budget',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            Text(
              '\$${_budget.toStringAsFixed(0)}',
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    color: AppColors.primary,
                  ),
            ),
            Slider(
              value: _budget,
              min: 50,
              max: 500,
              divisions: 45,
              label: '\$${_budget.toStringAsFixed(0)}',
              onChanged: (value) {
                setState(() => _budget = value);
              },
            ),
            const SizedBox(height: 32),
            Text(
              'Household Size',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                IconButton(
                  icon: const Icon(Icons.remove_circle_outline),
                  onPressed: _householdSize > 1
                      ? () => setState(() => _householdSize--)
                      : null,
                  iconSize: 32,
                  color: AppColors.primary,
                ),
                const SizedBox(width: 24),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '$_householdSize',
                    style: Theme.of(context).textTheme.displayMedium?.copyWith(
                          color: AppColors.primary,
                        ),
                  ),
                ),
                const SizedBox(width: 24),
                IconButton(
                  icon: const Icon(Icons.add_circle_outline),
                  onPressed: _householdSize < 10
                      ? () => setState(() => _householdSize++)
                      : null,
                  iconSize: 32,
                  color: AppColors.primary,
                ),
              ],
            ),
            const SizedBox(height: 48),
            ElevatedButton(
              onPressed: _saveAndContinue,
              child: const Text('Continue'),
            ),
          ],
        ),
      ),
    );
  }
}
