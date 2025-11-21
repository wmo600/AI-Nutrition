// lib/services/api_handler.dart
import 'dart:convert';
import 'package:http/http.dart' as http;

import '../config/env_config.dart';
import 'auth_storage.dart';

class ApiHandler {
  /// Build a full API URI from a relative path, e.g. '/meal/generate'
  static Uri _buildUri(String path) {
    final base = EnvConfig.backendUrl; // already includes /api
    if (base.isEmpty) {
      throw Exception('Backend URL is not configured. Check BACKEND_URL in .env');
    }

    final normalizedPath = path.startsWith('/') ? path : '/$path';
    return Uri.parse('$base$normalizedPath');
  }

  static Map<String, String> _baseHeaders() {
    final headers = <String, String>{
      'Content-Type': 'application/json',
    };

    // Optional API key from env (for your backend to check)
    if (EnvConfig.backendApiKey.isNotEmpty) {
      headers['x-api-key'] = EnvConfig.backendApiKey;
    }

    return headers;
  }

  /// Public GET with auth by default
  static Future<http.Response> get(
    String path, {
    bool auth = true,
  }) async {
    return _send(
      method: 'GET',
      path: path,
      auth: auth,
    );
  }

  /// Public POST with auth by default
  static Future<http.Response> post(
    String path,
    Map<String, dynamic> body, {
    bool auth = true,
  }) async {
    return _send(
      method: 'POST',
      path: path,
      body: jsonEncode(body),
      auth: auth,
    );
  }

  /// Core request handler: adds auth header, retries once on 401 via refresh flow
  static Future<http.Response> _send({
    required String method,
    required String path,
    String? body,
    bool auth = true,
    bool retryOnAuthError = true,
  }) async {
    final uri = _buildUri(path);
    final headers = _baseHeaders();

    // 🔐 Attach access token if required
    if (auth) {
      final token = await AuthStorage.getAccessToken();
      if (token != null && token.isNotEmpty) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    http.Response response;

    try {
      if (method == 'GET') {
        response = await http
            .get(uri, headers: headers)
            .timeout(Duration(seconds: EnvConfig.requestTimeout));
      } else if (method == 'POST') {
        response = await http
            .post(uri, headers: headers, body: body)
            .timeout(Duration(seconds: EnvConfig.requestTimeout));
      } else {
        throw UnsupportedError('HTTP method not supported: $method');
      }
    } catch (e) {
      // Network / timeout / other error
      rethrow;
    }

    // If not auth-related or no retry requested → return immediately
    if (response.statusCode != 401 || !auth || !retryOnAuthError) {
      return response;
    }

    // 🔄 401 with auth → try refresh token
    final refreshed = await _tryRefreshToken();
    if (!refreshed) {
      // Could not refresh → clear session and bubble up
      await AuthStorage.clearSession();
      throw AuthException('Session expired. Please log in again.');
    }

    // ✅ Got new access token, retry ONCE without further retry-on-401
    final retryHeaders = _baseHeaders();
    final newToken = await AuthStorage.getAccessToken();
    if (newToken != null && newToken.isNotEmpty) {
      retryHeaders['Authorization'] = 'Bearer $newToken';
    }

    if (method == 'GET') {
      return await http
          .get(uri, headers: retryHeaders)
          .timeout(Duration(seconds: EnvConfig.requestTimeout));
    } else if (method == 'POST') {
      return await http
          .post(uri, headers: retryHeaders, body: body)
          .timeout(Duration(seconds: EnvConfig.requestTimeout));
    }

    throw UnsupportedError('HTTP method not supported on retry: $method');
  }

  /// 🔄 Try refreshing the access token using the refresh token
  static Future<bool> _tryRefreshToken() async {
    final refreshToken = await AuthStorage.getRefreshToken();
    if (refreshToken == null || refreshToken.isEmpty) {
      return false;
    }

    try {
      // NOTE: this calls /auth/refresh WITHOUT auth header
      final uri = _buildUri('/auth/refresh');
      final response = await http
          .post(
            uri,
            headers: _baseHeaders(),
            body: jsonEncode({'refreshToken': refreshToken}),
          )
          .timeout(Duration(seconds: EnvConfig.requestTimeout));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        final newAccess = data['accessToken']?.toString();
        final newRefresh = data['refreshToken']?.toString() ?? refreshToken;
        final userId = data['userId']?.toString();

        if (newAccess == null || userId == null) {
          return false;
        }

        // Save updated tokens & user id
        await AuthStorage.saveSession(
          accessToken: newAccess,
          refreshToken: newRefresh,
          userId: userId,
        );

        return true;
      } else {
        return false;
      }
    } catch (e) {
      // Network error during refresh
      return false;
    }
  }
}

/// Custom exception so UI can handle "please login again"
class AuthException implements Exception {
  final String message;
  AuthException(this.message);

  @override
  String toString() => 'AuthException: $message';
}
