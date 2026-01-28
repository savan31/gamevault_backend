const express = require('express');
const router = express.Router();
const { db } = require('../config/database');
const slugify = require('slugify');

const API_KEY = process.env.ADMIN_API_KEY || 'your-secret-admin-key-123';

const authenticate = (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;
    if (apiKey !== API_KEY) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    next();
};

// Get all games
router.get('/games', authenticate, (req, res) => {
    try {
        const games = db.prepare(`
            SELECT g.*, c.name as category_name 
            FROM games g 
            LEFT JOIN categories c ON g.category_id = c.id 
            ORDER BY g.created_at DESC
        `).all();
        res.json({ success: true, data: games });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Add new game
router.post('/games', authenticate, (req, res) => {
    try {
        const { title, description, instructions, category, thumbnail_url, game_url, featured, trending, new_release, multiplayer } = req.body;

        if (!title || !game_url || !category) {
            return res.status(400).json({ success: false, error: 'Missing required fields: title, game_url, category' });
        }

        const categoryData = db.prepare('SELECT id FROM categories WHERE LOWER(name) = LOWER(?)').get(category);
        if (!categoryData) {
            const categories = db.prepare('SELECT name FROM categories').all();
            return res.status(400).json({ success: false, error: `Category "${category}" not found`, availableCategories: categories.map(c => c.name) });
        }

        let slug = slugify(title, { lower: true, strict: true });
        let counter = 1;
        while (db.prepare('SELECT id FROM games WHERE slug = ?').get(slug)) {
            slug = slugify(title, { lower: true, strict: true }) + '-' + counter;
            counter++;
        }

        const result = db.prepare(`
            INSERT INTO games (title, slug, description, instructions, category_id, thumbnail_url, game_url, featured, trending, new_release, multiplayer, mobile_friendly, plays, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, 'active')
        `).run(
            title, slug, description || '', instructions || '', categoryData.id,
            thumbnail_url || `https://picsum.photos/seed/${slug}/400/300`, game_url,
            featured ? 1 : 0, trending ? 1 : 0, new_release ? 1 : 0, multiplayer ? 1 : 0
        );

        const newGame = db.prepare('SELECT * FROM games WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json({ success: true, message: 'Game added successfully', data: newGame });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete game
router.delete('/games/:id', authenticate, (req, res) => {
    try {
        const game = db.prepare('SELECT * FROM games WHERE id = ?').get(req.params.id);
        if (!game) return res.status(404).json({ success: false, error: 'Game not found' });
        db.prepare('DELETE FROM games WHERE id = ?').run(req.params.id);
        res.json({ success: true, message: 'Game deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get categories
router.get('/categories', authenticate, (req, res) => {
    try {
        const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;