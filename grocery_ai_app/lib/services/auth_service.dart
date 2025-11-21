// lib/services/auth_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/env_config.dart';
import 'api_handler.dart';
import 'auth_storage.dart';

class AuthService {
  /// Login or register by display name (userName)
  /// Backend: POST /api/auth/login
  Future<Map<String, String>> loginWithName(String userName) async {
    if (userName.trim().isEmpty) {
      throw Exception('Name is required');
    }

    if (!EnvConfig.isConfigured) {
      throw Exception('Backend URL not configured');
    }

    final http.Response response = await ApiHandler.post(
      '/auth/login',
      {
        'userName': userName.trim(),
      },
      auth: false, // no bearer for login
    );

    if (response.statusCode != 200) {
      throw Exception('Login failed: ${response.statusCode}');
    }

    final data = jsonDecode(response.body) as Map<String, dynamic>;

    final accessToken = data['accessToken']?.toString();
    final refreshToken = data['refreshToken']?.toString();
    final userId = data['userId']?.toString();
    final returnedName = data['userName']?.toString() ?? userName.trim();

    if (accessToken == null || refreshToken == null || userId == null) {
      throw Exception('Invalid login response from server');
    }

    // 🔐 Persist tokens + userId securely
    await AuthStorage.saveSession(
      accessToken: accessToken,
      refreshToken: refreshToken,
      userId: userId,
    );

    return {
      'userId': userId,
      'userName': returnedName,
    };
  }

  Future<void> logout() async {
    await AuthStorage.clearSession();
  }
}
