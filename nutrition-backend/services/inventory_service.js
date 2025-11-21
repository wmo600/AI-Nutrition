// services/inventory_service.js
const inventoryModel = require('../models/inventory_model');
const visionModel = require('../models/vision_model');

exports.addFromVision = async ({ userId, items, visionLogId = null }) => {
  await inventoryModel.insertItemsFromVision(userId, items);

  if (visionLogId) {
    await visionModel.markAddedToInventory(visionLogId);
  }

  return { added: items.length };
};
