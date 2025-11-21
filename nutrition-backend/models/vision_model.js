// models/vision_model.js
const db = require('../services/db');

exports.insertVisionLog = async ({
  userId,
  imageUrl = null,
  imageDescription = null,
  detectedItems,
  confidenceScores = null,
}) => {
  const result = await db.query(
    `
    INSERT INTO vision_logs (
      user_id,
      image_url,
      image_description,
      detected_items,
      confidence_scores,
      added_to_inventory
    )
    VALUES ($1, $2, $3, $4::jsonb, $5::jsonb, FALSE)
    RETURNING *;
    `,
    [userId, imageUrl, imageDescription, JSON.stringify(detectedItems), confidenceScores
      ? JSON.stringify(confidenceScores)
      : null]
  );

  return result.rows[0];
};

exports.markAddedToInventory = async (visionLogId) => {
  await db.query(
    `
    UPDATE vision_logs
    SET added_to_inventory = TRUE
    WHERE id = $1;
    `,
    [visionLogId]
  );
};
