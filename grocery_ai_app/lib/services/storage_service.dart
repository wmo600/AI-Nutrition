import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class StorageService {
  static const String _userPrefsKey = 'user_preferences';
  static const String _isLoggedInKey = 'is_logged_in';
  static const String _userNameKey = 'user_name';

  Future<void> saveUserPreferences(Map<String, dynamic> preferences) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userPrefsKey, jsonEncode(preferences));
  }

  Future<Map<String, dynamic>?> getUserPreferences() async {
    final prefs = await SharedPreferences.getInstance();
    final String? prefsString = prefs.getString(_userPrefsKey);
    if (prefsString != null) {
      return jsonDecode(prefsString) as Map<String, dynamic>;
    }
    return null;
  }

  Future<void> setLoggedIn(bool value, {String userName = ''}) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_isLoggedInKey, value);
    if (userName.isNotEmpty) {
      await prefs.setString(_userNameKey, userName);
    }
  }

  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_isLoggedInKey) ?? false;
  }

  Future<String?> getUserName() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_userNameKey);
  }

  Future<void> clearAll() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }
}
