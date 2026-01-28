const cors = require('cors');

// Relaxed CORS to allow your frontend (and other origins) to call the API in production.
// If you want to lock this down later, we can switch back to an allowlist using env vars.
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, server-to-server, etc.)
        if (!origin) return callback(null, true);

        // For now, allow all origins so your Render frontend can access the API
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

module.exports = cors(corsOptions);