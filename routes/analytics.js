const express = require('express');
const router = express.Router();
const { trackEvent, getStats, getGameAnalytics } = require('../controllers/analyticsController');

// POST /api/v1/analytics/track - Track an event
router.post('/track', trackEvent);

// GET /api/v1/analytics/stats - Get overall stats
router.get('/stats', getStats);

// GET /api/v1/analytics/game/:gameId - Get analytics for a specific game
router.get('/game/:gameId', getGameAnalytics);

module.exports = router;