require('dotenv').config();
const { db, initDatabase } = require('../config/database');

// Initialize database
initDatabase();

const markGamesTrending = () => {
    console.log('🎮 Marking games as trending...\n');

    try {
        const games = ['spider', 'puzzle', 'pacman', 'bounce'];
        const updateStmt = db.prepare('UPDATE games SET trending = 1, featured = 1 WHERE slug = ?');

        for (const slug of games) {
            const result = updateStmt.run(slug);
            if (result.changes > 0) {
                console.log(`   ✅ ${slug} marked as trending and featured`);
            } else {
                console.log(`   ⚠️  ${slug} not found in database`);
            }
        }

        console.log('\n✨ Done!');
        
        // Verify
        const trendingCount = db.prepare('SELECT COUNT(*) as count FROM games WHERE trending = 1').get();
        console.log(`\n📊 Total trending games: ${trendingCount.count}`);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

markGamesTrending();

