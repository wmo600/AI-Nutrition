// lib/services/dashboard_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'api_handler.dart';

class DashboardService {
  Future<Map<String, dynamic>> fetchDashboard({
    required String userId,
  }) async {
    final http.Response response = await ApiHandler.get('/dashboard/$userId');

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body) as Map<String, dynamic>;
      return data;
    } else {
      throw Exception(
        'Failed to load dashboard: ${response.statusCode}',
      );
    }
  }
}
