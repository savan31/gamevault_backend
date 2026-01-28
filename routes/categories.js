const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get category by slug with games
router.get('/:slug', categoryController.getCategoryBySlug);

// Get games in category
router.get('/:slug/games', categoryController.getCategoryGames);

module.exports = router;