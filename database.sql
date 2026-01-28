-- GameVault Database Schema
-- SQLite Compatible

-- Categories Table
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
    );

-- Games Table
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
    );

-- Analytics Table
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
    );

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_games_category ON games(category_id);
CREATE INDEX IF NOT EXISTS idx_games_slug ON games(slug);
CREATE INDEX IF NOT EXISTS idx_games_featured ON games(featured);
CREATE INDEX IF NOT EXISTS idx_games_trending ON games(trending);
CREATE INDEX IF NOT EXISTS idx_games_plays ON games(plays DESC);
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_analytics_game ON analytics(game_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Triggers for Updated Timestamps
CREATE TRIGGER IF NOT EXISTS update_games_timestamp
AFTER UPDATE ON games
BEGIN
UPDATE games SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_categories_timestamp
AFTER UPDATE ON categories
BEGIN
UPDATE categories SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger to Update Category Game Count
CREATE TRIGGER IF NOT EXISTS update_category_game_count_insert
AFTER INSERT ON games
BEGIN
UPDATE categories SET game_count = (
    SELECT COUNT(*) FROM games WHERE category_id = NEW.category_id AND status = 'active'
) WHERE id = NEW.category_id;
END;

CREATE TRIGGER IF NOT EXISTS update_category_game_count_delete
AFTER DELETE ON games
BEGIN
UPDATE categories SET game_count = (
    SELECT COUNT(*) FROM games WHERE category_id = OLD.category_id AND status = 'active'
) WHERE id = OLD.category_id;
END;