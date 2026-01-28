const { db } = require('../config/database');
const slugify = require('slugify');

class Game {
    static findAll(options = {}) {
        const {
            limit = 50,
            offset = 0,
            category = null,
            featured = null,
            trending = null,
            search = null,
            sortBy = 'plays',
            order = 'DESC'
        } = options;

        let query = `
            SELECT g.*, c.name as category_name, c.slug as category_slug
            FROM games g
            LEFT JOIN categories c ON g.category_id = c.id
            WHERE g.status = 'active'
        `;
        const params = [];

        if (category) {
            query += ' AND c.slug = ?';
            params.push(category);
        }

        if (featured !== null) {
            query += ' AND g.featured = ?';
            params.push(featured ? 1 : 0);
        }

        if (trending !== null) {
            query += ' AND g.trending = ?';
            params.push(trending ? 1 : 0);
        }

        if (search) {
            query += ' AND (g.title LIKE ? OR g.description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        const validSortColumns = ['plays', 'created_at', 'title', 'likes'];
        const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'plays';
        const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        query += ` ORDER BY g.${sortColumn} ${sortOrder} LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const stmt = db.prepare(query);
        return stmt.all(...params);
    }

    static findById(id) {
        const stmt = db.prepare(`
            SELECT g.*, c.name as category_name, c.slug as category_slug
            FROM games g
            LEFT JOIN categories c ON g.category_id = c.id
            WHERE g.id = ?
        `);
        return stmt.get(id);
    }

    static findBySlug(slug) {
        const stmt = db.prepare(`
            SELECT g.*, c.name as category_name, c.slug as category_slug
            FROM games g
            LEFT JOIN categories c ON g.category_id = c.id
            WHERE g.slug = ?
        `);
        return stmt.get(slug);
    }

    static create(data) {
        const slug = slugify(data.title, { lower: true, strict: true });

        // Check for duplicate slug
        let finalSlug = slug;
        let counter = 1;
        while (this.findBySlug(finalSlug)) {
            finalSlug = `${slug}-${counter}`;
            counter++;
        }

        const stmt = db.prepare(`
            INSERT INTO games (
                title, slug, description, instructions, category_id,
                thumbnail_url, game_url, game_type, width, height,
                featured, trending, new_release, multiplayer, mobile_friendly
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            data.title,
            finalSlug,
            data.description || '',
            data.instructions || '',
            data.category_id,
            data.thumbnail_url || '/images/placeholder.png',
            data.game_url,
            data.game_type || 'iframe',
            data.width || 800,
            data.height || 600,
            data.featured ? 1 : 0,
            data.trending ? 1 : 0,
            data.new_release ? 1 : 0,
            data.multiplayer ? 1 : 0,
            data.mobile_friendly !== false ? 1 : 0
        );

        return this.findById(result.lastInsertRowid);
    }

    static update(id, data) {
        const updates = [];
        const values = [];

        const fields = [
            'title', 'description', 'instructions', 'category_id',
            'thumbnail_url', 'game_url', 'game_type', 'width', 'height',
            'featured', 'trending', 'new_release', 'multiplayer',
            'mobile_friendly', 'status'
        ];

        for (const field of fields) {
            if (data[field] !== undefined) {
                updates.push(`${field} = ?`);
                values.push(typeof data[field] === 'boolean' ? (data[field] ? 1 : 0) : data[field]);
            }
        }

        if (data.title) {
            updates.push('slug = ?');
            values.push(slugify(data.title, { lower: true, strict: true }));
        }

        if (updates.length === 0) return this.findById(id);

        values.push(id);
        const stmt = db.prepare(`UPDATE games SET ${updates.join(', ')} WHERE id = ?`);
        stmt.run(...values);
        return this.findById(id);
    }

    static incrementPlays(id) {
        const stmt = db.prepare('UPDATE games SET plays = plays + 1 WHERE id = ?');
        stmt.run(id);
        return this.findById(id);
    }

    static incrementLikes(id) {
        const stmt = db.prepare('UPDATE games SET likes = likes + 1 WHERE id = ?');
        stmt.run(id);
        return this.findById(id);
    }

    static delete(id) {
        const stmt = db.prepare('DELETE FROM games WHERE id = ?');
        return stmt.run(id);
    }

    static getFeatured(limit = 6) {
        const stmt = db.prepare(`
            SELECT g.*, c.name as category_name, c.slug as category_slug
            FROM games g
            LEFT JOIN categories c ON g.category_id = c.id
            WHERE g.featured = 1 AND g.status = 'active'
            ORDER BY g.plays DESC
            LIMIT ?
        `);
        return stmt.all(limit);
    }

    static getTrending(limit = 12) {
        const stmt = db.prepare(`
            SELECT g.*, c.name as category_name, c.slug as category_slug
            FROM games g
            LEFT JOIN categories c ON g.category_id = c.id
            WHERE g.status = 'active'
            ORDER BY g.plays DESC, g.created_at DESC
            LIMIT ?
        `);
        return stmt.all(limit);
    }

    static getNewReleases(limit = 12) {
        const stmt = db.prepare(`
            SELECT g.*, c.name as category_name, c.slug as category_slug
            FROM games g
            LEFT JOIN categories c ON g.category_id = c.id
            WHERE g.status = 'active'
            ORDER BY g.created_at DESC
            LIMIT ?
        `);
        return stmt.all(limit);
    }

    static getSimilar(gameId, categoryId, limit = 6) {
        const stmt = db.prepare(`
            SELECT g.*, c.name as category_name, c.slug as category_slug
            FROM games g
            LEFT JOIN categories c ON g.category_id = c.id
            WHERE g.category_id = ? AND g.id != ? AND g.status = 'active'
            ORDER BY g.plays DESC
            LIMIT ?
        `);
        return stmt.all(categoryId, gameId, limit);
    }

    static search(query, limit = 20) {
        const stmt = db.prepare(`
            SELECT g.*, c.name as category_name, c.slug as category_slug
            FROM games g
            LEFT JOIN categories c ON g.category_id = c.id
            WHERE g.status = 'active' AND (g.title LIKE ? OR g.description LIKE ?)
            ORDER BY 
                CASE WHEN g.title LIKE ? THEN 0 ELSE 1 END,
                g.plays DESC
            LIMIT ?
        `);
        return stmt.all(`%${query}%`, `%${query}%`, `${query}%`, limit);
    }

    static getCount(options = {}) {
        let query = 'SELECT COUNT(*) as count FROM games WHERE status = ?';
        const params = [options.status || 'active'];

        if (options.category_id) {
            query += ' AND category_id = ?';
            params.push(options.category_id);
        }

        const stmt = db.prepare(query);
        return stmt.get(...params).count;
    }

    static getAllForSitemap() {
        const stmt = db.prepare(`
            SELECT slug, updated_at FROM games WHERE status = 'active'
        `);
        return stmt.all();
    }
}

module.exports = Game;