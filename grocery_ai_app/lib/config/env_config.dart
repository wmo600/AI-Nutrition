import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class EnvConfig {
  /// Raw backend base URL from .env (should NOT include /api)
  static String get backendBaseUrl =>
      dotenv.env['BACKEND_URL']?.trim() ?? '';

  /// API prefix for versioning + route structure
  static const String apiPrefix = '/api';

  /// Full backend URL used by ApiHandler
  static String get backendUrl {
    String base = backendBaseUrl;

    if (base.isEmpty) {
      debugPrint('❌ BACKEND_URL not set in .env');
      return '';
    }

    // Remove trailing slash to avoid double slashes
    if (base.endsWith('/')) {
      base = base.substring(0, base.length - 1);
    }

    return '$base$apiPrefix';
  }

  /// Optional API key support
  static String get backendApiKey =>
      dotenv.env['BACKEND_API_KEY'] ?? '';

  /// App metadata
  static String get appName =>
      dotenv.env['APP_NAME'] ?? 'AI-Nutrition';

  /// Global request timeout for HTTP calls
  static int get requestTimeout =>
      int.tryParse(dotenv.env['REQUEST_TIMEOUT'] ?? '12') ?? 12;

  /// Any integrations keys (optional)
  static String get analyticsKey =>
      dotenv.env['ANALYTICS_KEY'] ?? '';
  static String get storeApiKey =>
      dotenv.env['STORE_API_KEY'] ?? '';

  /// Backend available?
  static bool get isConfigured =>
      backendBaseUrl.isNotEmpty;

  /// Debug helper for startup logging
  static void printConfig() {
    debugPrint('======= 🌍 Env Configuration =======');
    debugPrint('Backend Base URL: ${backendBaseUrl.isNotEmpty ? backendBaseUrl : "MISSING"}');
    debugPrint('Final API URL: ${backendUrl.isNotEmpty ? backendUrl : "INVALID"}');
    debugPrint('API Key Present: ${backendApiKey.isNotEmpty ? "Yes" : "No"}');
    debugPrint('Timeout: $requestTimeout seconds');
    debugPrint('====================================');
  }
}
