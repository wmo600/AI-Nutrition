import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthStorage {
  static const _accessTokenKey = 'ACCESS_TOKEN';
  static const _refreshTokenKey = 'REFRESH_TOKEN';
  static const _userIdKey = 'USER_ID';

  static const FlutterSecureStorage _storage = FlutterSecureStorage();

  // 🔐 Save tokens & user ID
  static Future<void> saveSession({
    required String accessToken,
    required String refreshToken,
    required String userId,
  }) async {
    await _storage.write(key: _accessTokenKey, value: accessToken);
    await _storage.write(key: _refreshTokenKey, value: refreshToken);
    await _storage.write(key: _userIdKey, value: userId);
  }

  // 📌 Getters
  static Future<String?> getAccessToken() =>
      _storage.read(key: _accessTokenKey);

  static Future<String?> getRefreshToken() =>
      _storage.read(key: _refreshTokenKey);

  static Future<String?> getUserId() =>
      _storage.read(key: _userIdKey);

  // 🔄 Update access token
  static Future<void> updateAccessToken(String token) =>
      _storage.write(key: _accessTokenKey, value: token);

  // 🚪 Logout → remove all
  static Future<void> clearSession() async {
    await _storage.delete(key: _accessTokenKey);
    await _storage.delete(key: _refreshTokenKey);
    await _storage.delete(key: _userIdKey);
  }
}
