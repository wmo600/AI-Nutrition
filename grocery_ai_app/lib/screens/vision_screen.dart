// lib/screens/vision_screen.dart
import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter_image_compress/flutter_image_compress.dart';
import '../theme/app_colors.dart';
import '../services/vision_service.dart';

bool _isMobileDevice() {
  if (kIsWeb) return false;
  return Platform.isAndroid || Platform.isIOS;
}

class VisionScreen extends StatefulWidget {
  final String userId;

  const VisionScreen({super.key, required this.userId});

  @override
  State<VisionScreen> createState() => _VisionScreenState();
}

class _VisionScreenState extends State<VisionScreen> {
  final ImagePicker _picker = ImagePicker();
  final VisionService _visionService = VisionService();

  bool _isAnalyzing = false;
  List<Map<String, dynamic>> _detectedItems = [];
  int? _visionLogId;

  Future<XFile?> _compressImage(XFile image) async {
    try {
      // Get file size before compression
      final bytes = await image.readAsBytes();
      final sizeInMB = bytes.length / (1024 * 1024);
      print('Original image size: ${sizeInMB.toStringAsFixed(2)} MB');

      // Compress the image
      final result = await FlutterImageCompress.compressAndGetFile(
        image.path,
        '${image.path}_compressed.jpg',
        quality: 70, // Adjust this (0-100) - lower = smaller file
        minWidth: 800,  // Reduced from 1024
        minHeight: 800,
        format: CompressFormat.jpeg,
      );

      if (result != null) {
        final compressedBytes = await result.readAsBytes();
        final compressedSizeInMB = compressedBytes.length / (1024 * 1024);
        print('Compressed image size: ${compressedSizeInMB.toStringAsFixed(2)} MB');
        
        return result;
      }

      return image; // Return original if compression fails
    } catch (e) {
      print('Compression error: $e');
      return image; // Return original if error
    }
  }

  Future<void> _captureAndAnalyze() async {
    // Desktop platforms don't support camera, use gallery instead
    final ImageSource source =
        _isMobileDevice() ? ImageSource.camera : ImageSource.gallery;

    final XFile? image = await _picker.pickImage(
      source: source,
      maxWidth: 1024,
      maxHeight: 1024,
      imageQuality: 85,
    );

    if (image == null) return;

    setState(() {
      _isAnalyzing = true;
      _detectedItems = [];
      _visionLogId = null;
    });

    try {
      // Compress the image before sending
      final compressedImage = await _compressImage(image);
      
      if (compressedImage == null) {
        throw Exception('Failed to compress image');
      }

      final bytes = await File(compressedImage.path).readAsBytes();
      final base64Image = base64Encode(bytes);

      // Check final base64 size
      final base64SizeInMB = base64Image.length / (1024 * 1024);
      print('Base64 size: ${base64SizeInMB.toStringAsFixed(2)} MB');

      if (base64SizeInMB > 3) {
        throw Exception('Image too large after compression (${base64SizeInMB.toStringAsFixed(2)} MB). Please try a different image.');
      }

      final result = await _visionService.analyzeImage(
        userId: widget.userId,
        imageBase64: base64Image,
      );

      final rawItems =
          (result['detectedItems'] as List<dynamic>? ?? []).toList();

      final items = rawItems.map<Map<String, dynamic>>((e) {
        final map = Map<String, dynamic>.from(e as Map);
        // default all to selected = true
        return {
          ...map,
          'selected': true,
        };
      }).toList();

      setState(() {
        _detectedItems = items;
        _visionLogId =
            result['visionLogId'] is int ? result['visionLogId'] as int : null;
        _isAnalyzing = false;
      });

      if (!mounted) return;
      _showDetectedItemsSheet();
    } catch (e) {
      if (!mounted) return;
      setState(() => _isAnalyzing = false);
      _showError('Error analyzing image: $e');
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  void _showDetectedItemsSheet() {
    if (_detectedItems.isEmpty) {
      _showError('No items detected.');
      return;
    }

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return DraggableScrollableSheet(
          expand: false,
          initialChildSize: 0.7,
          minChildSize: 0.5,
          maxChildSize: 0.95,
          builder: (context, scrollController) {
            return Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    'Detected Items',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 16),
                  Expanded(
                    child: ListView.builder(
                      controller: scrollController,
                      itemCount: _detectedItems.length,
                      itemBuilder: (context, index) {
                        final item = _detectedItems[index];
                        final selected = item['selected'] as bool? ?? true;

                        final name = item['item']?.toString() ??
                            item['food']?.toString() ??
                            'Unknown';
                        final qty = item['quantity']?.toString() ?? '';
                        final unit = item['unit']?.toString() ?? '';
                        final confidence = item['confidence'] as num?;

                        return CheckboxListTile(
                          title: Text(name),
                          subtitle: Text(
                            [
                              if (qty.isNotEmpty || unit.isNotEmpty)
                                '$qty $unit',
                              if (confidence != null)
                                'Confidence: ${(confidence * 100).toStringAsFixed(0)}%',
                            ].where((e) => e.isNotEmpty).join(' • '),
                          ),
                          value: selected,
                          onChanged: (val) {
                            setState(() {
                              _detectedItems[index] = {
                                ...item,
                                'selected': val ?? false,
                              };
                            });
                          },
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 12),
                  ElevatedButton.icon(
                    onPressed: _addSelectedToInventory,
                    icon: const Icon(Icons.add_shopping_cart),
                    label: const Text('Add Selected to Inventory'),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Future<void> _addSelectedToInventory() async {
    final selectedItems =
        _detectedItems.where((e) => (e['selected'] as bool? ?? false)).toList();

    if (selectedItems.isEmpty) {
      _showError('No items selected.');
      return;
    }

    try {
      await _visionService.addFromVision(
        userId: widget.userId,
        items: selectedItems
            .map<Map<String, dynamic>>((item) => {
                  'item': item['item'] ?? item['food'],
                  'quantity': item['quantity'] ?? 1,
                  'unit': item['unit'] ?? 'units',
                })
            .toList(),
        visionLogId: _visionLogId,
      );

      if (!mounted) return;
      Navigator.of(context).pop(); // close bottom sheet
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Added to inventory!')),
      );
    } catch (e) {
      if (!mounted) return;
      _showError('Failed to add to inventory: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Scan Inventory')),
      body: Center(
        child: _isAnalyzing
            ? const CircularProgressIndicator()
            : Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.camera_alt,
                    size: 100,
                    color: AppColors.primary,
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'Scan your fridge or pantry',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: _captureAndAnalyze,
                    icon: const Icon(Icons.camera),
                    label: const Text('Take Photo'),
                  ),
                ],
              ),
      ),
    );
  }
}