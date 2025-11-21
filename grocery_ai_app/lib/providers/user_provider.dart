import 'package:flutter/foundation.dart';
import '../models/user_preferences.dart';
import '../services/storage_service.dart';
import '../services/auth_service.dart';
import '../services/auth_storage.dart';

class UserProvider with ChangeNotifier {
  final StorageService _storageService = StorageService();
  final AuthService _authService = AuthService();

  UserPreferences? _preferences;
  String? _userName;
  String? _userId;
  bool _isLoggedIn = false;

  UserPreferences? get preferences => _preferences;
  String? get userName => _userName;
  String? get userId => _userId;
  bool get isLoggedIn => _isLoggedIn;

  /// Called from SplashScreen
  Future<void> loadUserData() async {
    // Load session from secure storage
    _userId = await AuthStorage.getUserId();
    _isLoggedIn = _userId != null && _userId!.isNotEmpty;

    // Load display name and preferences from SharedPreferences
    _userName = await _storageService.getUserName();
    final prefsJson = await _storageService.getUserPreferences();
    if (prefsJson != null) {
      _preferences = UserPreferences.fromJson(prefsJson);
    }

    notifyListeners();
  }

  /// Login by name → backend creates/returns user + tokens
  Future<void> login(String name) async {
    final session = await _authService.loginWithName(name);

    _userId = session['userId'];
    _userName = session['userName'];
    _isLoggedIn = true;

    // Persist login flag + display name in SharedPreferences
    await _storageService.setLoggedIn(true, userName: _userName ?? '');

    notifyListeners();
  }

  Future<void> savePreferences(UserPreferences prefs) async {
    await _storageService.saveUserPreferences(prefs.toJson());
    _preferences = prefs;
    notifyListeners();
  }

  Future<void> logout() async {
    await _authService.logout();
    await _storageService.clearAll();

    _userId = null;
    _userName = null;
    _isLoggedIn = false;
    _preferences = null;
    notifyListeners();
  }

  /// New: Register with email/password
  Future<void> register({
    required String userName,
    required String email,
    required String password,
  }) async {
    final session = await _authService.register(
      userName: userName,
      email: email,
      password: password,
    );

    _userId = session['userId'];
    _userName = session['userName'];
    _isLoggedIn = true;

    await _storageService.setLoggedIn(true, userName: _userName ?? '');

    notifyListeners();
  }

  /// New: Login with email/password
  Future<void> loginWithEmail({
    required String email,
    required String password,
  }) async {
    final session = await _authService.loginWithEmail(
      email: email,
      password: password,
    );

    _userId = session['userId'];
    _userName = session['userName'];
    _isLoggedIn = true;

    await _storageService.setLoggedIn(true, userName: _userName ?? '');

    notifyListeners();
  }
}
