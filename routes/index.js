const express = require('express');
const router = express.Router();

const gamesRoutes = require('./games');
const categoriesRoutes = require('./categories');
const analyticsRoutes = require('./analytics');
const adminRoutes = require('./admin');

// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString()
    });
});

// Mount routes
router.use('/games', gamesRoutes);
router.use('/categories', categoriesRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/admin', adminRoutes);

module.exports = router;