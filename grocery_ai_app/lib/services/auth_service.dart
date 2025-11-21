// lib/services/auth_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/env_config.dart';
import 'api_handler.dart';
import 'auth_storage.dart';

class AuthService {
  /// Legacy: Login by name only
  Future<Map<String, String>> loginWithName(String userName) async {
    if (userName.trim().isEmpty) {
      throw Exception('Name is required');
    }

    if (!EnvConfig.isConfigured) {
      throw Exception('Backend URL not configured');
    }

    final http.Response response = await ApiHandler.post(
      '/auth/login',
      {'userName': userName.trim()},
      auth: false,
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

  /// New: Register with email and password
  Future<Map<String, String>> register({
    required String userName,
    required String email,
    required String password,
  }) async {
    if (userName.trim().isEmpty || email.trim().isEmpty || password.isEmpty) {
      throw Exception('All fields are required');
    }

    if (password.length < 6) {
      throw Exception('Password must be at least 6 characters');
    }

    if (!EnvConfig.isConfigured) {
      throw Exception('Backend URL not configured');
    }

    final http.Response response = await ApiHandler.post(
      '/auth/register',
      {
        'userName': userName.trim(),
        'email': email.trim(),
        'password': password,
      },
      auth: false,
    );

    if (response.statusCode != 201) {
      final error = jsonDecode(response.body);
      throw Exception(error['error'] ?? 'Registration failed');
    }

    final data = jsonDecode(response.body) as Map<String, dynamic>;

    final accessToken = data['accessToken']?.toString();
    final refreshToken = data['refreshToken']?.toString();
    final userId = data['userId']?.toString();
    final returnedName = data['userName']?.toString() ?? userName.trim();

    if (accessToken == null || refreshToken == null || userId == null) {
      throw Exception('Invalid registration response from server');
    }

    await AuthStorage.saveSession(
      accessToken: accessToken,
      refreshToken: refreshToken,
      userId: userId,
    );

    return {
      'userId': userId,
      'userName': returnedName,
      'email': email,
    };
  }

  /// New: Login with email and password
  Future<Map<String, String>> loginWithEmail({
    required String email,
    required String password,
  }) async {
    if (email.trim().isEmpty || password.isEmpty) {
      throw Exception('Email and password are required');
    }

    if (!EnvConfig.isConfigured) {
      throw Exception('Backend URL not configured');
    }

    final http.Response response = await ApiHandler.post(
      '/auth/login-email',
      {
        'email': email.trim(),
        'password': password,
      },
      auth: false,
    );

    if (response.statusCode != 200) {
      final error = jsonDecode(response.body);
      throw Exception(error['error'] ?? 'Login failed');
    }

    final data = jsonDecode(response.body) as Map<String, dynamic>;

    final accessToken = data['accessToken']?.toString();
    final refreshToken = data['refreshToken']?.toString();
    final userId = data['userId']?.toString();
    final returnedName = data['userName']?.toString() ?? '';

    if (accessToken == null || refreshToken == null || userId == null) {
      throw Exception('Invalid login response from server');
    }

    await AuthStorage.saveSession(
      accessToken: accessToken,
      refreshToken: refreshToken,
      userId: userId,
    );

    return {
      'userId': userId,
      'userName': returnedName,
      'email': email,
    };
  }

  Future<void> logout() async {
    await AuthStorage.clearSession();
  }
}