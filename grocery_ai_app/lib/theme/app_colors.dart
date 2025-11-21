import 'package:flutter/material.dart';

class AppColors {
  // Primary Green - Fresh, healthy, and natural
  static const Color primary = Color(0xFF34C759);        // Vibrant green
  static const Color primaryDark = Color(0xFF2CA54A);    // Darker green
  static const Color primaryLight = Color(0xFF6FDE88);   // Light green
  
  // Secondary Orange - Energy and warmth
  static const Color secondary = Color(0xFFFF9500);      // Vibrant orange
  static const Color secondaryDark = Color(0xFFE07A00);  // Darker orange
  static const Color secondaryLight = Color(0xFFFFB340); // Light orange
  
  // Accent Colors for variety
  static const Color accent = Color(0xFF5856D6);         // Purple for premium features
  static const Color info = Color(0xFF007AFF);           // Blue for informational elements
  static const Color success = Color(0xFF34C759);        // Green for success states
  static const Color warning = Color(0xFFFF9500);        // Orange for warnings
  static const Color error = Color(0xFFFF3B30);          // Red for errors
  
  // Backgrounds
  static const Color background = Color(0xFFF2F2F7);     // Soft gray background
  static const Color surface = Color(0xFFFFFFFF);        // Pure white for cards
  static const Color surfaceVariant = Color(0xFFF9F9F9); // Slightly off-white
  
  // Text Colors
  static const Color textPrimary = Color(0xFF000000);    // Black for primary text
  static const Color textSecondary = Color(0xFF8E8E93);  // Gray for secondary text
  static const Color textTertiary = Color(0xFFC7C7CC);   // Light gray for tertiary text
  static const Color textHint = Color(0xFFAEAEB2);       // Hint text
  
  // Category Colors for grocery items
  static const Color categoryFruits = Color(0xFFFF6B6B);     // Red
  static const Color categoryVegetables = Color(0xFF51CF66); // Green
  static const Color categoryMeat = Color(0xFFFF8787);       // Light red
  static const Color categoryDairy = Color(0xFF74C0FC);      // Blue
  static const Color categoryGrains = Color(0xFFFFA94D);     // Orange
  static const Color categorySnacks = Color(0xFFFCC419);     // Yellow
  
  // Additional UI Colors
  static const Color divider = Color(0xFFE5E5EA);        // Divider lines
  static const Color cardShadow = Color(0x0A000000);     // Subtle shadow
  static const Color overlay = Color(0x40000000);        // Semi-transparent overlay
  
  // Gradient Colors
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [Color(0xFF34C759), Color(0xFF30D158)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  static const LinearGradient secondaryGradient = LinearGradient(
    colors: [Color(0xFFFF9500), Color(0xFFFFAA33)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
