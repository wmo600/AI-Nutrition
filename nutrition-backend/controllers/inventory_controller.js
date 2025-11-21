// controllers/inventory_controller.js
const inventoryService = require('../services/inventory_service');

exports.addFromVision = async (req, res) => {
  try {
    const { userId, items, visionLogId } = req.body;

    if (!userId || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: 'userId and non-empty items array are required' });
    }

    const result = await inventoryService.addFromVision({
      userId,
      items,
      visionLogId,
    });

    res.json({ success: true, ...result });
  } catch (err) {
    console.error('Add from vision error:', err);
    res
      .status(500)
      .json({ error: 'Failed to add inventory from vision', message: err.message });
  }
};
