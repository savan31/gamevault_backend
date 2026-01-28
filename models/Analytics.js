const { db } = require('../config/database');

class Analytics {
    static create(data) {
        const stmt = db.prepare(`
            INSERT INTO analytics (game_id, event_type, session_id, user_agent, ip_address, referrer, duration)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        const result = stmt.run(
            data.game_id,
            data.event_type,
            data.session_id || null,
            data.user_agent || null,
            data.ip_address || null,
            data.referrer || null,
            data.duration || 0
        );
        return { id: result.lastInsertRowid };
    }

    static trackView(gameId, metadata = {}) {
        return this.create({
            game_id: gameId,
            event_type: 'view',
            ...metadata
        });
    }

    static trackPlay(gameId, metadata = {}) {
        return this.create({
            game_id: gameId,
            event_type: 'play',
            ...metadata
        });
    }

    static trackPlayEnd(gameId, duration, metadata = {}) {
        return this.create({
            game_id: gameId,
            event_type: 'play_end',
            duration,
            ...metadata
        });
    }

    static getGameStats(gameId, days = 30) {
        const stmt = db.prepare(`
            SELECT 
                event_type,
                COUNT(*) as count,
                DATE(created_at) as date
            FROM analytics 
            WHERE game_id = ? 
                AND created_at >= datetime('now', '-' || ? || ' days')
            GROUP BY event_type, DATE(created_at)
            ORDER BY date DESC
        `);
        return stmt.all(gameId, days);
    }

    static getTopGames(days = 7, limit = 10) {
        const stmt = db.prepare(`
            SELECT 
                g.id, g.title, g.slug, g.thumbnail_url,
                COUNT(a.id) as event_count
            FROM analytics a
            JOIN games g ON a.game_id = g.id
            WHERE a.event_type = 'play' 
                AND a.created_at >= datetime('now', '-' || ? || ' days')
            GROUP BY g.id
            ORDER BY event_count DESC
            LIMIT ?
        `);
        return stmt.all(days, limit);
    }

    static getDailyStats(days = 30) {
        const stmt = db.prepare(`
            SELECT 
                DATE(created_at) as date,
                event_type,
                COUNT(*) as count
            FROM analytics
            WHERE created_at >= datetime('now', '-' || ? || ' days')
            GROUP BY DATE(created_at), event_type
            ORDER BY date DESC
        `);
        return stmt.all(days);
    }

    static getTotalStats() {
        const stmt = db.prepare(`
            SELECT 
                event_type,
                COUNT(*) as count
            FROM analytics
            GROUP BY event_type
        `);
        return stmt.all();
    }
}

module.exports = Analytics;