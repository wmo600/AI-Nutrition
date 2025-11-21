const dashboardService = require('../services/dashboard_service');

exports.getDashboard = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const data = await dashboardService.getDailyDashboard(userId);
    res.json(data);
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({
      error: 'Failed to get dashboard data',
      message: err.message,
    });
  }
};
