import 'package:flutter_dotenv/flutter_dotenv.dart';

class EnvConfig {
  // Anthropic API Configuration
  static String get anthropicApiKey => dotenv.env['ANTHROPIC_API_KEY'] ?? '';
  static String get anthropicApiUrl => 
      dotenv.env['ANTHROPIC_API_URL'] ?? 'https://api.anthropic.com/v1/messages';
  static String get anthropicModel => 
      dotenv.env['ANTHROPIC_MODEL'] ?? 'claude-3-5-sonnet-20241022';
  
  // Backend Configuration (if using your own backend)
  static String get backendUrl => dotenv.env['BACKEND_URL'] ?? '';
  static String get backendApiKey => dotenv.env['BACKEND_API_KEY'] ?? '';
  
  // Feature Flags
  static bool get useBackend => 
      dotenv.env['USE_BACKEND']?.toLowerCase() == 'true';
  static bool get enableMockData => 
      dotenv.env['ENABLE_MOCK_DATA']?.toLowerCase() == 'true';
  
  // App Configuration
  static String get appName => dotenv.env['APP_NAME'] ?? 'Grocery AI';
  static int get requestTimeout => 
      int.tryParse(dotenv.env['REQUEST_TIMEOUT'] ?? '30') ?? 30;
  
  // Analytics (optional)
  static String get analyticsKey => dotenv.env['ANALYTICS_KEY'] ?? '';
  
  // Store API Keys (if integrating with store APIs)
  static String get storeApiKey => dotenv.env['STORE_API_KEY'] ?? '';
  
  // Validation
  static bool get isConfigured {
    if (useBackend) {
      return backendUrl.isNotEmpty;
    } else {
      return anthropicApiKey.isNotEmpty;
    }
  }
  
  // Debug Info (only for development)
  static void printConfig() {
    print('=== Environment Configuration ===');
    print('Backend Mode: $useBackend');
    print('API Key Present: ${anthropicApiKey.isNotEmpty ? "Yes" : "No"}');
    print('Backend URL Present: ${backendUrl.isNotEmpty ? "Yes" : "No"}');
    print('Mock Data Enabled: $enableMockData');
    print('Request Timeout: ${requestTimeout}s');
    print('================================');
  }
}
