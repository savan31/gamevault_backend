require('dotenv').config();
const { db, initDatabase } = require('../config/database');
const slugify = require('slugify');

// Initialize database
initDatabase();

const localGames = [
    {
        title: 'Snake',
        slug: 'snake',
        description: 'Snake is a classic arcade game where you control a snake that grows longer as it eats food. Navigate through the grid, avoid walls and your own tail, and try to achieve the highest score possible!',
        instructions: 'Use arrow keys or WASD to control the snake. Eat red food to grow and score points. Avoid walls and your own tail. Press Space to pause.',
        category: 'Arcade',
        game_url: 'local://snake', // Special marker for local games
        game_type: 'local',
        featured: 1,
        trending: 1,
        mobile_friendly: 1,
        plays: 0
    },
    {
        title: 'Breakout',
        slug: 'breakout',
        description: 'Breakout is an exciting arcade game where you control a paddle to bounce a ball and break bricks. Clear all the bricks to complete the level while avoiding letting the ball fall!',
        instructions: 'Move your mouse to control the paddle. Bounce the ball to break all the colored bricks. You have 3 lives. Each brick gives you 10 points. Press Space to pause.',
        category: 'Arcade',
        game_url: 'local://breakout', // Special marker for local games
        game_type: 'local',
        featured: 1,
        trending: 1,
        mobile_friendly: 1,
        plays: 0
    }
];

const addLocalGames = () => {
    console.log('🎮 Adding local HTML5 games...\n');

    try {
        // Get or create Arcade category
        let arcadeCategory = db.prepare('SELECT id FROM categories WHERE slug = ?').get('arcade');
        
        if (!arcadeCategory) {
            console.log('📁 Creating Arcade category...');
            const insertCategory = db.prepare(`
                INSERT INTO categories (name, slug, description, icon, color)
                VALUES (?, ?, ?, ?, ?)
            `);
            const result = insertCategory.run('Arcade', 'arcade', 'Classic arcade games', '👾', '#ec4899');
            arcadeCategory = { id: result.lastInsertRowid };
            console.log('   ✅ Arcade category created');
        } else {
            console.log('   ✅ Arcade category found');
        }

        const categoryId = arcadeCategory.id;

        // Check if games already exist
        const checkGame = db.prepare('SELECT id FROM games WHERE slug = ?');
        const insertGame = db.prepare(`
            INSERT INTO games (title, slug, description, instructions, category_id, game_url, game_type, featured, trending, mobile_friendly, plays, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
        `);
        const updateGame = db.prepare(`
            UPDATE games 
            SET title = ?, description = ?, instructions = ?, game_url = ?, game_type = ?, featured = ?, trending = ?, mobile_friendly = ?, status = 'active'
            WHERE slug = ?
        `);

        for (const game of localGames) {
            const existing = checkGame.get(game.slug);
            
            if (existing) {
                console.log(`   🔄 Updating ${game.title}...`);
                updateGame.run(
                    game.title,
                    game.description,
                    game.instructions,
                    game.game_url,
                    game.game_type,
                    game.featured ? 1 : 0,
                    game.trending ? 1 : 0,
                    game.mobile_friendly ? 1 : 0,
                    game.slug
                );
                console.log(`   ✅ ${game.title} updated`);
            } else {
                console.log(`   ➕ Adding ${game.title}...`);
                insertGame.run(
                    game.title,
                    game.slug,
                    game.description,
                    game.instructions,
                    categoryId,
                    game.game_url,
                    game.game_type,
                    game.featured ? 1 : 0,
                    game.trending ? 1 : 0,
                    game.mobile_friendly ? 1 : 0,
                    game.plays || 0
                );
                console.log(`   ✅ ${game.title} added`);
            }
        }

        console.log('\n✨ Local games added successfully!');
        console.log('\n📊 Summary:');
        const count = db.prepare('SELECT COUNT(*) as count FROM games WHERE game_type = ?').get('local');
        console.log(`   Total local games: ${count.count}`);

    } catch (error) {
        console.error('❌ Error adding local games:', error);
        process.exit(1);
    }
};

// Run the script
addLocalGames();

