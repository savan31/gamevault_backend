const { Game, Analytics } = require('../models');
const { createResponse, createPaginatedResponse, asyncHandler } = require('../utils/helpers');

const getAllGames = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 20,
        category,
        featured,
        trending,
        search,
        sortBy,
        order
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const offset = (pageNum - 1) * limitNum;

    const games = Game.findAll({
        limit: limitNum,
        offset,
        category,
        featured: featured === 'true' ? true : featured === 'false' ? false : null,
        trending: trending === 'true' ? true : trending === 'false' ? false : null,
        search,
        sortBy,
        order
    });

    const total = Game.getCount({ category_id: category });

    res.json(createPaginatedResponse(games, pageNum, limitNum, total));
});

const getGameBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const game = Game.findBySlug(slug);

    if (!game) {
        const error = new Error('Game not found');
        error.name = 'NotFoundError';
        throw error;
    }

    // Track view
    Analytics.trackView(game.id, {
        user_agent: req.get('user-agent'),
        ip_address: req.ip,
        referrer: req.get('referrer')
    });

    res.json(createResponse(game));
});

const getFeaturedGames = asyncHandler(async (req, res) => {
    const { limit = 6 } = req.query;
    const games = Game.getFeatured(parseInt(limit));
    res.json(createResponse(games));
});

const getTrendingGames = asyncHandler(async (req, res) => {
    const { limit = 12 } = req.query;
    const games = Game.getTrending(parseInt(limit));
    res.json(createResponse(games));
});

const getNewGames = asyncHandler(async (req, res) => {
    const { limit = 12 } = req.query;
    const games = Game.getNewReleases(parseInt(limit));
    res.json(createResponse(games));
});

const getSimilarGames = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const { limit = 6 } = req.query;

    const game = Game.findBySlug(slug);
    if (!game) {
        const error = new Error('Game not found');
        error.name = 'NotFoundError';
        throw error;
    }

    const similar = Game.getSimilar(game.id, game.category_id, parseInt(limit));
    res.json(createResponse(similar));
});

const searchGames = asyncHandler(async (req, res) => {
    const { q, limit = 20 } = req.query;

    if (!q || q.length < 2) {
        return res.json(createResponse([]));
    }

    const games = Game.search(q, parseInt(limit));
    res.json(createResponse(games));
});

const incrementPlays = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const game = Game.findBySlug(slug);

    if (!game) {
        const error = new Error('Game not found');
        error.name = 'NotFoundError';
        throw error;
    }

    Game.incrementPlays(game.id);

    // Track play event
    Analytics.trackPlay(game.id, {
        user_agent: req.get('user-agent'),
        ip_address: req.ip,
        referrer: req.get('referrer'),
        session_id: req.body.sessionId
    });

    res.json(createResponse({ success: true }));
});

const getAllGamesForSitemap = asyncHandler(async (req, res) => {
    const games = Game.getAllForSitemap();
    res.json(createResponse(games));
});

module.exports = {
    getAllGames,
    getGameBySlug,
    getFeaturedGames,
    getTrendingGames,
    getNewGames,
    getSimilarGames,
    searchGames,
    incrementPlays,
    getAllGamesForSitemap
};