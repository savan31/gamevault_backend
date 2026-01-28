const createResponse = (data, message = null) => ({
    success: true,
    message,
    data
});

const createPaginatedResponse = (data, page, limit, total) => ({
    success: true,
    data,
    pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total
    }
});

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const generateSlug = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

module.exports = {
    createResponse,
    createPaginatedResponse,
    asyncHandler,
    generateSlug
};