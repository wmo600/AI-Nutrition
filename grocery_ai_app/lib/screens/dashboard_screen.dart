import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../services/dashboard_service.dart';

class DashboardScreen extends StatefulWidget {
  final String userId;

  const DashboardScreen({super.key, required this.userId});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final DashboardService _dashboardService = DashboardService();

  bool _isLoading = false;
  String? _error;

  Map<String, dynamic>? _macros;
  List<dynamic> _meals = [];
  List<dynamic> _weekly = [];
  String _date = '';

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final data =
          await _dashboardService.fetchDashboard(userId: widget.userId);

      setState(() {
        _date = data['date']?.toString() ?? '';
        _macros = data['macros'] as Map<String, dynamic>?;
        _meals = (data['meals'] as List<dynamic>? ?? []);
        _weekly = (data['weekly'] as List<dynamic>? ?? []);
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final macros = _macros ??
        {
          'total_calories': 0,
          'total_protein': 0,
          'total_carbs': 0,
          'total_fat': 0,
          'meals_logged': 0,
        };

    return Scaffold(
      appBar: AppBar(
        title: const Text('Macro Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadDashboardData,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadDashboardData,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    if (_error != null) ...[
                      Text(
                        _error!,
                        style: const TextStyle(color: Colors.red),
                      ),
                      const SizedBox(height: 16),
                    ],
                    if (_date.isNotEmpty)
                      Text(
                        'Today: $_date',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                    const SizedBox(height: 12),

                    // Macro summary cards
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildMacroCard(
                          label: 'Calories',
                          value: macros['total_calories']?.toString() ?? '0',
                          color: AppColors.primary,
                        ),
                        _buildMacroCard(
                          label: 'Protein (g)',
                          value: macros['total_protein']?.toString() ?? '0',
                          color: Colors.green,
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildMacroCard(
                          label: 'Carbs (g)',
                          value: macros['total_carbs']?.toString() ?? '0',
                          color: Colors.orange,
                        ),
                        _buildMacroCard(
                          label: 'Fat (g)',
                          value: macros['total_fat']?.toString() ?? '0',
                          color: Colors.purple,
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    Text(
                      'Meals Today (${macros['meals_logged'] ?? 0})',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 8),
                    _buildMealsList(),

                    const SizedBox(height: 24),
                    Text(
                      'Last 7 Days',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 8),
                    _buildWeeklyList(),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildMacroCard({
    required String label,
    required String value,
    required Color color,
  }) {
    return Expanded(
      child: Card(
        elevation: 2,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 12.0, horizontal: 8),
          child: Column(
            children: [
              Text(
                value,
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      color: color,
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 4),
              Text(
                label,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: AppColors.textSecondary,
                    ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMealsList() {
    if (_meals.isEmpty) {
      return Text(
        'No meals logged yet today.',
        style: Theme.of(context)
            .textTheme
            .bodyMedium
            ?.copyWith(color: AppColors.textSecondary),
      );
    }

    return Column(
      children: _meals.map((m) {
        final map = m as Map<String, dynamic>;
        final item = map['food_item']?.toString() ?? 'Unknown';
        final type = map['meal_type']?.toString() ?? '';
        final calories = map['calories']?.toString() ?? '0';

        return ListTile(
          contentPadding: EdgeInsets.zero,
          title: Text(item),
          subtitle: Text(type.isNotEmpty ? type : 'Meal'),
          trailing: Text('$calories kcal'),
        );
      }).toList(),
    );
  }

  Widget _buildWeeklyList() {
    if (_weekly.isEmpty) {
      return Text(
        'No data for the past week.',
        style: Theme.of(context)
            .textTheme
            .bodyMedium
            ?.copyWith(color: AppColors.textSecondary),
      );
    }

    return Column(
      children: _weekly.map((w) {
        final map = w as Map<String, dynamic>;
        final date = map['date']?.toString() ?? '';
        final calories = map['total_calories']?.toString() ?? '0';

        return ListTile(
          contentPadding: EdgeInsets.zero,
          leading: const Icon(Icons.calendar_today, size: 20),
          title: Text(date),
          trailing: Text('$calories kcal'),
        );
      }).toList(),
    );
  }
}
