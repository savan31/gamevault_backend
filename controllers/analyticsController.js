const { getDb } = require('../config/database');

// Track event
const trackEvent = async (req, res) => {
    try {
        const { game_id, event_type, session_id, duration } = req.body;

        const db = getDb();

        const stmt = db.prepare(`
      INSERT INTO analytics (game_id, event_type, session_id, user_agent, ip_address, referrer, duration, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `);

        stmt.run(
            game_id || null,
            event_type || 'view',
            session_id || null,
            req.headers['user-agent'] || null,
            req.ip || null,
            req.headers['referer'] || null,
            duration || null
        );

        res.json({
            success: true,
            message: 'Event tracked successfully'
        });
    } catch (error) {
        console.error('Analytics tracking error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to track event'
        });
    }
};

// Get analytics stats
const getStats = async (req, res) => {
    try {
        const db = getDb();

        const totalViews = db.prepare(`SELECT COUNT(*) as count FROM analytics WHERE event_type = 'view'`).get();
        const totalPlays = db.prepare(`SELECT COUNT(*) as count FROM analytics WHERE event_type = 'play'`).get();
        const totalGames = db.prepare(`SELECT COUNT(*) as count FROM games WHERE status = 'active'`).get();

        const popularGames = db.prepare(`
      SELECT g.title, g.slug, COUNT(a.id) as play_count
      FROM analytics a
      JOIN games g ON a.game_id = g.id
      WHERE a.event_type = 'play'
      GROUP BY a.game_id
      ORDER BY play_count DESC
      LIMIT 10
    `).all();

        res.json({
            success: true,
            data: {
                totalViews: totalViews?.count || 0,
                totalPlays: totalPlays?.count || 0,
                totalGames: totalGames?.count || 0,
                popularGames
            }
        });
    } catch (error) {
        console.error('Analytics stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get analytics'
        });
    }
};

// Get analytics by game
const getGameAnalytics = async (req, res) => {
    try {
        const { gameId } = req.params;
        const db = getDb();

        const stats = db.prepare(`
      SELECT 
        event_type,
        COUNT(*) as count
      FROM analytics
      WHERE game_id = ?
      GROUP BY event_type
    `).all(gameId);

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Game analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get game analytics'
        });
    }
};

module.exports = {
    trackEvent,
    getStats,
    getGameAnalytics
};