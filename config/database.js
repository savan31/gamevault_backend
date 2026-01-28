const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_PATH || './gamevault.db';
const dbDir = path.dirname(dbPath);
if (dbDir !== '.' && !fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable foreign keys and WAL mode
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

const initDatabase = () => {
    console.log('✅ Initializing database...');

    // Create categories table
    db.exec(`
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL UNIQUE,
            slug VARCHAR(100) NOT NULL UNIQUE,
            description TEXT,
            icon VARCHAR(50),
            color VARCHAR(20) DEFAULT '#6366f1',
            game_count INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create games table
    db.exec(`
        CREATE TABLE IF NOT EXISTS games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL UNIQUE,
            description TEXT,
            instructions TEXT,
            category_id INTEGER NOT NULL,
            thumbnail_url VARCHAR(500),
            game_url VARCHAR(500) NOT NULL,
            game_type VARCHAR(50) DEFAULT 'iframe',
            width INTEGER DEFAULT 800,
            height INTEGER DEFAULT 600,
            plays INTEGER DEFAULT 0,
            likes INTEGER DEFAULT 0,
            featured BOOLEAN DEFAULT 0,
            trending BOOLEAN DEFAULT 0,
            new_release BOOLEAN DEFAULT 0,
            multiplayer BOOLEAN DEFAULT 0,
            mobile_friendly BOOLEAN DEFAULT 1,
            status VARCHAR(20) DEFAULT 'active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        )
    `);

    // Create analytics table
    db.exec(`
        CREATE TABLE IF NOT EXISTS analytics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            game_id INTEGER NOT NULL,
            event_type VARCHAR(50) NOT NULL,
            session_id VARCHAR(100),
            user_agent TEXT,
            ip_address VARCHAR(45),
            referrer VARCHAR(500),
            duration INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
        )
    `);

    // Create indexes
    db.exec(`CREATE INDEX IF NOT EXISTS idx_games_category ON games(category_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_games_slug ON games(slug)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_games_featured ON games(featured)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_games_plays ON games(plays DESC)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_games_status ON games(status)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_analytics_game ON analytics(game_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics(event_type)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug)`);

    console.log('✅ Database tables created successfully');
};

module.exports = { db, initDatabase };