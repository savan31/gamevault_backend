const { db } = require('../config/database');
const slugify = require('slugify');

class Category {
    static findAll() {
        const stmt = db.prepare(`
            SELECT c.*, 
                   (SELECT COUNT(*) FROM games g WHERE g.category_id = c.id AND g.status = 'active') as game_count
            FROM categories c 
            ORDER BY c.name ASC
        `);
        return stmt.all();
    }

    static findById(id) {
        const stmt = db.prepare('SELECT * FROM categories WHERE id = ?');
        return stmt.get(id);
    }

    static findBySlug(slug) {
        const stmt = db.prepare(`
            SELECT c.*, 
                   (SELECT COUNT(*) FROM games g WHERE g.category_id = c.id AND g.status = 'active') as game_count
            FROM categories c 
            WHERE c.slug = ?
        `);
        return stmt.get(slug);
    }

    static create(data) {
        const slug = slugify(data.name, { lower: true, strict: true });
        const stmt = db.prepare(`
            INSERT INTO categories (name, slug, description, icon, color)
            VALUES (?, ?, ?, ?, ?)
        `);
        const result = stmt.run(
            data.name,
            slug,
            data.description || null,
            data.icon || '🎮',
            data.color || '#6366f1'
        );
        return this.findById(result.lastInsertRowid);
    }

    static update(id, data) {
        const updates = [];
        const values = [];

        if (data.name) {
            updates.push('name = ?');
            values.push(data.name);
            updates.push('slug = ?');
            values.push(slugify(data.name, { lower: true, strict: true }));
        }
        if (data.description !== undefined) {
            updates.push('description = ?');
            values.push(data.description);
        }
        if (data.icon) {
            updates.push('icon = ?');
            values.push(data.icon);
        }
        if (data.color) {
            updates.push('color = ?');
            values.push(data.color);
        }

        if (updates.length === 0) return this.findById(id);

        values.push(id);
        const stmt = db.prepare(`UPDATE categories SET ${updates.join(', ')} WHERE id = ?`);
        stmt.run(...values);
        return this.findById(id);
    }

    static delete(id) {
        const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
        return stmt.run(id);
    }

    static getWithGames(slug, limit = 50, offset = 0) {
        const category = this.findBySlug(slug);
        if (!category) return null;

        const gamesStmt = db.prepare(`
            SELECT * FROM games 
            WHERE category_id = ? AND status = 'active'
            ORDER BY plays DESC, created_at DESC
            LIMIT ? OFFSET ?
        `);
        const games = gamesStmt.all(category.id, limit, offset);

        return { ...category, games };
    }
}

module.exports = Category;