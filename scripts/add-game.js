require('dotenv').config();
const { db, initDatabase } = require('../config/database');

// Initialize database
initDatabase();

/**
 * Add a game to the database
 * Usage: node scripts/add-game.js <slug> <title> <category> [options]
 * 
 * Example:
 * node scripts/add-game.js pacman "Pacman" "Arcade" --description "Classic arcade game" --game-url "/games/pacman/index.html" --game-type "local-html"
 */
const addGame = () => {
    const args = process.argv.slice(2);
    
    if (args.length < 3) {
        console.log('Usage: node scripts/add-game.js <slug> <title> <category> [options]');
        console.log('');
        console.log('Required:');
        console.log('  slug      - URL-friendly identifier (e.g., "pacman")');
        console.log('  title     - Game title (e.g., "Pacman")');
        console.log('  category  - Category slug (e.g., "arcade", "puzzle", "action")');
        console.log('');
        console.log('Optional flags:');
        console.log('  --description <text>     - Game description');
        console.log('  --instructions <text>   - How to play instructions');
        console.log('  --game-url <url>        - Game URL (default: /games/<slug>/index.html)');
        console.log('  --game-type <type>      - Game type: "local-html", "local", "external" (default: "local-html")');
        console.log('  --thumbnail-url <url>   - Thumbnail image URL');
        console.log('  --featured              - Mark as featured');
        console.log('  --trending              - Mark as trending');
        console.log('  --multiplayer           - Mark as multiplayer');
        console.log('  --mobile-friendly       - Mark as mobile friendly');
        console.log('');
        console.log('Example:');
        console.log('  node scripts/add-game.js pacman "Pacman" "arcade" --description "Classic arcade game" --featured --trending');
        process.exit(1);
    }

    const slug = args[0];
    const title = args[1];
    const categorySlug = args[2];

    // Parse optional arguments
    const options = {
        description: '',
        instructions: '',
        gameUrl: `/games/${slug}/index.html`,
        gameType: 'local-html',
        thumbnailUrl: '',
        featured: false,
        trending: false,
        multiplayer: false,
        mobileFriendly: true
    };

    for (let i = 3; i < args.length; i++) {
        const arg = args[i];
        const nextArg = args[i + 1];

        if (arg === '--description' && nextArg) {
            options.description = nextArg;
            i++;
        } else if (arg === '--instructions' && nextArg) {
            options.instructions = nextArg;
            i++;
        } else if (arg === '--game-url' && nextArg) {
            options.gameUrl = nextArg;
            i++;
        } else if (arg === '--game-type' && nextArg) {
            options.gameType = nextArg;
            i++;
        } else if (arg === '--thumbnail-url' && nextArg) {
            options.thumbnailUrl = nextArg;
            i++;
        } else if (arg === '--featured') {
            options.featured = true;
        } else if (arg === '--trending') {
            options.trending = true;
        } else if (arg === '--multiplayer') {
            options.multiplayer = true;
        } else if (arg === '--mobile-friendly') {
            options.mobileFriendly = true;
        }
    }

    try {
        // Get category ID
        const category = db.prepare('SELECT id FROM categories WHERE slug = ?').get(categorySlug);
        
        if (!category) {
            console.error(`❌ Category "${categorySlug}" not found.`);
            console.log('Available categories:');
            const categories = db.prepare('SELECT slug, name FROM categories').all();
            categories.forEach(cat => {
                console.log(`  - ${cat.slug} (${cat.name})`);
            });
            process.exit(1);
        }

        // Check if game already exists
        const existing = db.prepare('SELECT * FROM games WHERE slug = ?').get(slug);
        if (existing) {
            console.error(`❌ Game with slug "${slug}" already exists.`);
            console.log(`   Title: ${existing.title}`);
            console.log(`   ID: ${existing.id}`);
            process.exit(1);
        }

        // Insert game
        const insertStmt = db.prepare(`
            INSERT INTO games (
                slug, title, description, instructions, category_id,
                game_url, game_type, thumbnail_url,
                featured, trending, multiplayer, mobile_friendly,
                status, plays, likes, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', 0, 0, datetime('now'), datetime('now'))
        `);

        const result = insertStmt.run(
            slug,
            title,
            options.description,
            options.instructions,
            category.id,
            options.gameUrl,
            options.gameType,
            options.thumbnailUrl || `https://picsum.photos/seed/${slug}/400/300`,
            options.featured ? 1 : 0,
            options.trending ? 1 : 0,
            options.multiplayer ? 1 : 0,
            options.mobileFriendly ? 1 : 0
        );

        console.log(`✅ Successfully added game: ${title}`);
        console.log(`   Slug: ${slug}`);
        console.log(`   Category: ${categorySlug}`);
        console.log(`   Game URL: ${options.gameUrl}`);
        console.log(`   Game Type: ${options.gameType}`);
        console.log(`   ID: ${result.lastInsertRowid}`);

    } catch (error) {
        console.error('❌ Error adding game:', error);
        process.exit(1);
    }
};

addGame();


