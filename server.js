require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

const corsMiddleware = require('./middleware/cors');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const apiLimiter = require('./middleware/rateLimit');
const routes = require('./routes');
const { initDatabase } = require('./config/database');

// Initialize Express app
const app = express();

// Initialize database
initDatabase();

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false
}));

// CORS
app.use(corsMiddleware);

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting for API routes (ONLY in production)
if (process.env.NODE_ENV === 'production') {
    app.use('/api', apiLimiter);
}

// API Routes
app.use('/api/v1', routes);

// API root
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to GameVault API',
        version: '1.0.0',
        endpoints: {
            games: '/api/v1/games',
            categories: '/api/v1/categories',
            analytics: '/api/v1/analytics',
            health: '/api/v1/health'
        }
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'GameVault API Server',
        documentation: '/api'
    });
});

// Favicon (prevent unnecessary 404 noise in logs)
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════╗
    ║                                           ║
    ║   🎮 GameVault API Server                 ║
    ║                                           ║
    ║   Running on: http://localhost:${PORT}       ║
    ║   Environment: ${process.env.NODE_ENV || 'development'}             ║
    ║                                           ║
    ╚═══════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

module.exports = app;