import 'package:flutter_dotenv/flutter_dotenv.dart';

class EnvConfig {
  // Backend Configuration (Required)
  static String get backendUrl => dotenv.env['BACKEND_URL'] ?? '';
  static String get backendApiKey => dotenv.env['BACKEND_API_KEY'] ?? '';
  
  // App Configuration
  static String get appName => dotenv.env['APP_NAME'] ?? 'Grocery AI';
  static int get requestTimeout => 
      int.tryParse(dotenv.env['REQUEST_TIMEOUT'] ?? '30') ?? 30;
  
  // Analytics (optional)
  static String get analyticsKey => dotenv.env['ANALYTICS_KEY'] ?? '';
  
  // Store API Keys (optional - if integrating with store APIs)
  static String get storeApiKey => dotenv.env['STORE_API_KEY'] ?? '';
  
  // Validation
  static bool get isConfigured => backendUrl.isNotEmpty;
  
  // Debug Info (only for development)
  static void printConfig() {
    print('=== Environment Configuration ===');
    print('Backend URL: ${backendUrl.isNotEmpty ? backendUrl : "NOT SET"}');
    print('Backend API Key Present: ${backendApiKey.isNotEmpty ? "Yes" : "No"}');
    print('Request Timeout: ${requestTimeout}s');
    print('================================');
  }
}
