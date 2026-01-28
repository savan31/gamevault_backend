const rateLimit = {};

// Simple rate limiter with higher limits
const rateLimitMiddleware = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window
    const maxRequests = 500; // Allow 500 requests per minute (increased from default)

    if (!rateLimit[ip]) {
        rateLimit[ip] = {
            count: 1,
            startTime: now
        };
    } else {
        // Reset if window has passed
        if (now - rateLimit[ip].startTime > windowMs) {
            rateLimit[ip] = {
                count: 1,
                startTime: now
            };
        } else {
            rateLimit[ip].count++;
        }
    }

    // Check if over limit
    if (rateLimit[ip].count > maxRequests) {
        return res.status(429).json({
            success: false,
            message: 'Too many requests, please try again later.'
        });
    }

    next();
};

// Clean up old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    const windowMs = 60 * 1000;

    Object.keys(rateLimit).forEach(ip => {
        if (now - rateLimit[ip].startTime > windowMs) {
            delete rateLimit[ip];
        }
    });
}, 5 * 60 * 1000);

module.exports = rateLimitMiddleware;