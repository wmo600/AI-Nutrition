// controllers/vision_controller.js
const visionService = require('../services/vision_service');

exports.analyze = async (req, res) => {
  try {
    const { userId, imageBase64, imageType } = req.body;

    if (!userId || !imageBase64) {
      return res
        .status(400)
        .json({ error: 'userId and imageBase64 are required' });
    }

    const result = await visionService.analyzeImage({
      userId,
      imageBase64,
      imageType,
    });

    res.json(result);
  } catch (err) {
    console.error('Vision analyze error:', err);
    res.status(500).json({ error: 'Vision analysis failed', message: err.message });
  }
};
