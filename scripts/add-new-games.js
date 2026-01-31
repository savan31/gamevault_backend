require('dotenv').config();
const { db, initDatabase } = require('../config/database');
const slugify = require('slugify');

// Initialize database
initDatabase();

const newGames = [
    {
        title: 'Spider',
        slug: 'spider',
        description: 'Spider Solitaire is a classic card game where you arrange cards in descending order to build complete suits. Challenge yourself with 1, 2, or 4 suit variations!',
        instructions: 'Click and drag cards to move them. Build sequences in descending order (King to Ace) of the same suit. Complete a full suit to remove it. Use undo/redo to correct moves. Press H for hints.',
        category: 'Puzzle',
        game_url: '/games/spider/index.html',
        game_type: 'local-html',
        featured: 1,
        trending: 1,
        mobile_friendly: 1,
        plays: 0
    },
    {
        title: 'Puzzle',
        slug: 'puzzle',
        description: 'Classic jigsaw puzzle game with beautiful images. Choose from multiple puzzle packs and challenge yourself with different difficulty levels!',
        instructions: 'Click and drag puzzle pieces to move them. Match pieces to complete the puzzle. Use preview to see the full image. Press P to pause, M to mute.',
        category: 'Puzzle',
        game_url: '/games/puzzle/index.html',
        game_type: 'local-html',
        featured: 1,
        trending: 1,
        mobile_friendly: 1,
        plays: 0
    },
    {
        title: 'Pacman',
        slug: 'pacman',
        description: 'The classic arcade game! Navigate the maze, eat dots, avoid ghosts, and eat power pellets to turn the tables!',
        instructions: 'Use arrow keys to move Pacman. Eat all dots to complete the level. Avoid ghosts unless you eat a power pellet. Eat power pellets to turn ghosts blue and eat them for bonus points.',
        category: 'Arcade',
        game_url: '/games/pacman/index.html',
        game_type: 'local-html',
        featured: 1,
        trending: 1,
        mobile_friendly: 1,
        plays: 0
    },
    {
        title: 'Bounce',
        slug: 'bounce',
        description: 'Classic brick-breaking game! Control the paddle to bounce the ball and break all the bricks. Multiple game modes available!',
        instructions: 'Use arrow keys or mouse to move the paddle. Bounce the ball to break bricks. Don\'t let the ball fall! Choose from Speed, Random, or Bricks mode. Press P to pause.',
        category: 'Arcade',
        game_url: '/games/bounce/index.html',
        game_type: 'local-html',
        featured: 1,
        trending: 1,
        mobile_friendly: 1,
        plays: 0
    }
];

const addNewGames = () => {
    console.log('🎮 Adding new local HTML5 games...\n');

    try {
        // Get or create categories
        const getCategoryId = (categoryName) => {
            const slug = slugify(categoryName, { lower: true, strict: true });
            let category = db.prepare('SELECT id FROM categories WHERE slug = ?').get(slug);
            
            if (!category) {
                console.log(`📁 Creating category: ${categoryName}...`);
                const icons = {
                    'Puzzle': '🧩',
                    'Arcade': '👾'
                };
                const colors = {
                    'Puzzle': '#8b5cf6',
                    'Arcade': '#ec4899'
                };
                const insertCategory = db.prepare(`
                    INSERT INTO categories (name, slug, description, icon, color)
                    VALUES (?, ?, ?, ?, ?)
                `);
                const result = insertCategory.run(
                    categoryName,
                    slug,
                    `${categoryName} games`,
                    icons[categoryName] || '🎮',
                    colors[categoryName] || '#6366f1'
                );
                category = { id: result.lastInsertRowid };
                console.log(`   ✅ Category created: ${categoryName}`);
            }
            
            return category.id;
        };

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

        for (const game of newGames) {
            const categoryId = getCategoryId(game.category);
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

        console.log('\n✨ Games added successfully!');
        console.log('\n📊 Summary:');
        const count = db.prepare('SELECT COUNT(*) as count FROM games WHERE game_type = ?').get('local-html');
        console.log(`   Total local HTML games: ${count.count}`);

    } catch (error) {
        console.error('❌ Error adding games:', error);
        process.exit(1);
    }
};

// Run the script
addNewGames();

