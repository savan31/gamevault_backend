const { Category, Game } = require('../models');
const { createResponse, createPaginatedResponse, asyncHandler } = require('../utils/helpers');

const getAllCategories = asyncHandler(async (req, res) => {
    const categories = Category.findAll();
    res.json(createResponse(categories));
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const offset = (pageNum - 1) * limitNum;

    const category = Category.getWithGames(slug, limitNum, offset);

    if (!category) {
        const error = new Error('Category not found');
        error.name = 'NotFoundError';
        throw error;
    }

    const total = category.game_count;

    res.json({
        success: true,
        data: {
            ...category,
            games: category.games
        },
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
            hasMore: pageNum * limitNum < total
        }
    });
});

const getCategoryGames = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const { page = 1, limit = 20, sortBy = 'plays', order = 'DESC' } = req.query;

    const category = Category.findBySlug(slug);
    if (!category) {
        const error = new Error('Category not found');
        error.name = 'NotFoundError';
        throw error;
    }

    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const offset = (pageNum - 1) * limitNum;

    const games = Game.findAll({
        limit: limitNum,
        offset,
        category: slug,
        sortBy,
        order
    });

    const total = category.game_count;

    res.json(createPaginatedResponse(games, pageNum, limitNum, total));
});

module.exports = {
    getAllCategories,
    getCategoryBySlug,
    getCategoryGames
};