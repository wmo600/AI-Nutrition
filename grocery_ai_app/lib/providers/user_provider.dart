import 'package:flutter/foundation.dart';
import '../models/user_preferences.dart';
import '../services/storage_service.dart';

class UserProvider with ChangeNotifier {
  final StorageService _storageService = StorageService();
  UserPreferences? _preferences;
  String? _userName;
  bool _isLoggedIn = false;

  UserPreferences? get preferences => _preferences;
  String? get userName => _userName;
  bool get isLoggedIn => _isLoggedIn;

  Future<void> loadUserData() async {
    _isLoggedIn = await _storageService.isLoggedIn();
    _userName = await _storageService.getUserName();
    
    final prefsData = await _storageService.getUserPreferences();
    if (prefsData != null) {
      _preferences = UserPreferences.fromJson(prefsData);
    }
    notifyListeners();
  }

  Future<void> login(String name) async {
    await _storageService.setLoggedIn(true, userName: name);
    _userName = name;
    _isLoggedIn = true;
    notifyListeners();
  }

  Future<void> savePreferences(UserPreferences prefs) async {
    await _storageService.saveUserPreferences(prefs.toJson());
    _preferences = prefs;
    notifyListeners();
  }

  Future<void> logout() async {
    await _storageService.clearAll();
    _userName = null;
    _isLoggedIn = false;
    _preferences = null;
    notifyListeners();
  }
}
