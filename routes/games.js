const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Get all games with filters
router.get('/', gameController.getAllGames);

// Get featured games
router.get('/featured', gameController.getFeaturedGames);

// Get trending games
router.get('/trending', gameController.getTrendingGames);

// Get new releases
router.get('/new', gameController.getNewGames);

// Search games
router.get('/search', gameController.searchGames);

// Get games for sitemap
router.get('/sitemap', gameController.getAllGamesForSitemap);

// Get single game by slug
router.get('/:slug', gameController.getGameBySlug);

// Get similar games
router.get('/:slug/similar', gameController.getSimilarGames);

// Increment play count
router.post('/:slug/play', gameController.incrementPlays);

module.exports = router;