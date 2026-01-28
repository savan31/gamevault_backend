const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Default error
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // SQLite specific errors
    if (err.code === 'SQLITE_CONSTRAINT') {
        statusCode = 400;
        message = 'Database constraint violation';
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = err.message;
    }

    // Not found errors
    if (err.name === 'NotFoundError') {
        statusCode = 404;
        message = err.message || 'Resource not found';
    }

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

// Not Found middleware
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.name = 'NotFoundError';
    res.status(404);
    next(error);
};

module.exports = { errorHandler, notFound };