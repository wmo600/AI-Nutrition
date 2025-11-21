// lib/services/vision_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'api_handler.dart';

class VisionService {
  Future<Map<String, dynamic>> analyzeImage({
    required String userId,
    required String imageBase64,
    String imageType = 'image/jpeg',
  }) async {
    final http.Response response = await ApiHandler.post(
      '/vision/analyze',
      {
        'userId': userId,
        'imageBase64': imageBase64,
        'imageType': imageType,
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body) as Map<String, dynamic>;
      return data;
    } else {
      throw Exception(
        'Vision analyze failed: ${response.statusCode}',
      );
    }
  }

  Future<void> addFromVision({
    required String userId,
    required List<Map<String, dynamic>> items,
    int? visionLogId,
  }) async {
    final http.Response response = await ApiHandler.post(
      '/inventory/add-from-vision',
      {
        'userId': userId,
        'items': items,
        if (visionLogId != null) 'visionLogId': visionLogId,
      },
    );

    if (response.statusCode != 200) {
      throw Exception(
        'Add from vision failed: ${response.statusCode}',
      );
    }
  }
}
