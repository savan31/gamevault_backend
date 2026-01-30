require('dotenv').config();
const { db, initDatabase } = require('../config/database');

// Initialize database
initDatabase();

const removeGame = (slug) => {
    console.log(`🗑️  Removing game: ${slug}...\n`);

    try {
        // Find the game
        const game = db.prepare('SELECT * FROM games WHERE slug = ?').get(slug);
        
        if (!game) {
            console.log(`❌ Game with slug "${slug}" not found.`);
            return;
        }

        console.log(`   Found game: ${game.title} (ID: ${game.id})`);

        // Delete the game
        const deleteStmt = db.prepare('DELETE FROM games WHERE slug = ?');
        const result = deleteStmt.run(slug);

        if (result.changes > 0) {
            console.log(`   ✅ Successfully deleted "${game.title}"`);
            console.log(`   📊 Deleted ${result.changes} game(s)`);
        } else {
            console.log(`   ⚠️  No games were deleted.`);
        }

    } catch (error) {
        console.error('❌ Error removing game:', error);
        process.exit(1);
    }
};

// Get slug from command line argument
const slug = process.argv[2];

if (!slug) {
    console.log('Usage: node remove-game.js <game-slug>');
    console.log('Example: node remove-game.js 8-ball-pool');
    process.exit(1);
}

removeGame(slug);

