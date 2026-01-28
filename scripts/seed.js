require('dotenv').config();
const { db, initDatabase } = require('../config/database');
const slugify = require('slugify');

const categories = [
    { name: 'Action', icon: '⚔️', color: '#ef4444', description: 'Fast-paced action games' },
    { name: 'Puzzle', icon: '🧩', color: '#8b5cf6', description: 'Brain-teasing puzzle games' },
    { name: 'Racing', icon: '🏎️', color: '#f59e0b', description: 'High-speed racing games' },
    { name: 'Sports', icon: '⚽', color: '#22c55e', description: 'Sports games' },
    { name: 'Adventure', icon: '🗺️', color: '#3b82f6', description: 'Epic adventure games' },
    { name: 'Arcade', icon: '👾', color: '#ec4899', description: 'Classic arcade games' },
    { name: 'Strategy', icon: '♟️', color: '#6366f1', description: 'Strategic games' },
    { name: 'Multiplayer', icon: '👥', color: '#14b8a6', description: 'Multiplayer games' },
    { name: 'Casual', icon: '🎈', color: '#f97316', description: 'Casual games' },
    { name: 'Shooting', icon: '🎯', color: '#dc2626', description: 'Shooting games' }
];

const games = [
    { title: 'Ninja Runner', description: 'Run and slash through enemies!', instructions: 'Arrow keys to move, X to attack', category: 'Action', thumbnail_url: 'https://picsum.photos/seed/ninja/400/300', game_url: 'https://html5.gamedistribution.com/rvvASMiM/3d0ce59c22a34c128dc0ec54a0c155f7/index.html', featured: 1, trending: 1, plays: 15420 },
    { title: 'Space Defender', description: 'Defend Earth from aliens!', instructions: 'Mouse to aim, click to shoot', category: 'Action', thumbnail_url: 'https://picsum.photos/seed/space/400/300', game_url: 'https://html5.gamedistribution.com/rvvASMiM/c2fc860ba4c34ac7ad94f8e17b0a5e27/index.html', featured: 1, trending: 0, plays: 12300 },
    { title: 'Block Puzzle Master', description: 'Fit blocks to clear lines!', instructions: 'Drag and drop blocks', category: 'Puzzle', thumbnail_url: 'https://picsum.photos/seed/blocks/400/300', game_url: 'https://html5.gamedistribution.com/rvvASMiM/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6/index.html', featured: 1, trending: 0, plays: 18500 },
    { title: 'Color Match', description: 'Match colors to solve puzzles!', instructions: 'Click tiles to swap colors', category: 'Puzzle', thumbnail_url: 'https://picsum.photos/seed/colors/400/300', game_url: 'https://html5.gamedistribution.com/rvvASMiM/q1w2e3r4t5y6u7i8o9p0a1s2d3f4g5h6/index.html', featured: 0, trending: 0, plays: 8900 },
    { title: 'Turbo Sprint', description: 'Race against time!', instructions: 'Arrow keys to steer, space for nitro', category: 'Racing', thumbnail_url: 'https://picsum.photos/seed/racing/400/300', game_url: 'https://html5.gamedistribution.com/rvvASMiM/w1e2r3t4y5u6i7o8p9a0s1d2f3g4h5j6/index.html', featured: 1, trending: 1, plays: 22100 },
    { title: 'Drift Champion', description: 'Master the art of drifting!', instructions: 'Hold space to drift', category: 'Racing', thumbnail_url: 'https://picsum.photos/seed/drift/400/300', game_url: 'https://html5.gamedistribution.com/rvvASMiM/k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6/index.html', featured: 0, trending: 0, plays: 14200 },
    { title: 'Penalty Shootout', description: 'Score goals!', instructions: 'Click and drag to aim', category: 'Sports', thumbnail_url: 'https://picsum.photos/seed/soccer/400/300', game_url: 'https://html5.gamedistribution.com/rvvASMiM/i1o2p3a4s5d6f7g8h9j0k1l2m3n4b5v6/index.html', featured: 1, trending: 0, plays: 16800 },
    { title: 'Basketball Stars', description: 'Shoot hoops!', instructions: 'Click and hold to aim', category: 'Sports', thumbnail_url: 'https://picsum.photos/seed/basketball/400/300', game_url: 'https://html5.gamedistribution.com/rvvASMiM/c1x2z3a4s5w6e7d8r9f0t1g2y3h4u5j6/index.html', featured: 0, trending: 1, plays: 11400 },
    { title: 'Treasure Quest', description: 'Hunt for treasure!', instructions: 'Arrow keys to move, E to interact', category: 'Adventure', thumbnail_url: 'https://picsum.photos/seed/treasure/400/300', game_url: 'https://html5.gamedistribution.com/rvvASMiM/m1n2b3v4c5x6z7a8s9d0f1g2h3j4k5l6/index.html', featured: 1, trending: 0, plays: 13700 },
    { title: 'Retro Runner', description: 'Classic endless runner!', instructions: 'Space to jump', category: 'Arcade', thumbnail_url: 'https://picsum.photos/seed/retro/400/300', game_url: 'https://html5.gamedistribution.com/rvvASMiM/j1k2l3m4n5b6v7c8x9z0a1s2d3f4g5h6/index.html', featured: 0, trending: 1, plays: 19800 },
    { title: 'Fruit Slicer', description: 'Slice fruits, avoid bombs!', instructions: 'Swipe to slice', category: 'Arcade', thumbnail_url: 'https://picsum.photos/seed/fruit/400/300', game_url: 'https://html5.gamedistribution.com/rvvASMiM/h1g2f3d4s5a6q7w8e9r0t1y2u3i4o5p6/index.html', featured: 0, trending: 0, plays: 15600 },
    { title: 'Tower Defense Pro', description: 'Build towers, defend base!', instructions: 'Click to place towers', category: 'Strategy', thumbnail_url: 'https://picsum.photos/seed/tower/400/300', game_url: 'https://html5.gamedistribution.com/rvvASMiM/l1k2j3h4g5f6d7s8a9q0w1e2r3t4y5u6/index.html', featured: 1, trending: 0, plays: 14300 },
    { title: 'Battle Royale 2D', description: 'Last one standing wins!', instructions: 'WASD to move, mouse to shoot', category: 'Multiplayer', thumbnail_url: 'https://picsum.photos/seed/battleroyale/400/300', game_url: 'https://html5.gamedistribution.com/rvvASMiM/o1i2u3y4t5r6e7w8q9p0a1s2d3f4g5h6/index.html', featured: 1, trending: 1, multiplayer: 1, plays: 25600 },
    { title: 'Bubble Pop', description: 'Pop bubbles and relax!', instructions: 'Click on bubble groups', category: 'Casual', thumbnail_url: 'https://picsum.photos/seed/bubbles/400/300', game_url: 'https://html5.gamedistribution.com/rvvASMiM/v1b2n3m4k5j6h7g8f9d0s1a2q3w4e5r6/index.html', featured: 0, trending: 0, plays: 21300 },
    { title: 'Cat Clicker', description: 'Click cats to earn points!', instructions: 'Click on cats', category: 'Casual', thumbnail_url: 'https://picsum.photos/seed/cats/400/300', game_url: 'https://html5.gamedistribution.com/rvvASMiM/t1y2u3i4o5p6a7s8d9f0g1h2j3k4l5m6/index.html', featured: 0, trending: 0, new_release: 1, plays: 12400 },
    { title: 'Zombie Shooter', description: 'Survive the apocalypse!', instructions: 'Mouse to aim, click to shoot', category: 'Shooting', thumbnail_url: 'https://picsum.photos/seed/zombie/400/300', game_url: 'https://html5.gamedistribution.com/rvvASMiM/e1r2t3y4u5i6o7p8a9s0d1f2g3h4j5k6/index.html', featured: 1, trending: 1, plays: 23400 },
    { title: 'Sniper Mission', description: 'Complete sniper missions!', instructions: 'Mouse to aim, click to shoot, Z to zoom', category: 'Shooting', thumbnail_url: 'https://picsum.photos/seed/sniper/400/300', game_url: 'https://html5.gamedistribution.com/rvvASMiM/w1q2a3s4d5f6g7h8j9k0l1m2n3b4v5c6/index.html', featured: 0, trending: 0, plays: 17800 },
    { title: 'Logic Maze', description: 'Navigate complex mazes!', instructions: 'Arrow keys to navigate', category: 'Puzzle', thumbnail_url: 'https://picsum.photos/seed/maze/400/300', game_url: 'https://html5.gamedistribution.com/rvvASMiM/z1x2c3v4b5n6m7k8j9h0g1f2d3s4a5q6/index.html', featured: 0, trending: 0, new_release: 1, plays: 5600 },
    { title: 'Forest Explorer', description: 'Explore magical forest!', instructions: 'WASD to move', category: 'Adventure', thumbnail_url: 'https://picsum.photos/seed/forest/400/300', game_url: 'https://html5.gamedistribution.com/rvvASMiM/p1o2i3u4y5t6r7e8w9q0a1s2d3f4g5h6/index.html', featured: 0, trending: 0, new_release: 1, plays: 7200 },
    { title: 'Kingdom Builder', description: 'Build your kingdom!', instructions: 'Click to build', category: 'Strategy', thumbnail_url: 'https://picsum.photos/seed/kingdom/400/300', game_url: 'https://html5.gamedistribution.com/rvvASMiM/z1x2c3v4b5n6m7k8j9h0g1f2d3s4a5p6/index.html', featured: 0, trending: 0, new_release: 1, plays: 8900 },
    { title: 'Battle Arena', description: 'Fight waves of enemies!', instructions: 'WASD to move, mouse to aim', category: 'Action', thumbnail_url: 'https://picsum.photos/seed/battle/400/300', game_url: 'https://html5.gamedistribution.com/rvvASMiM/b8d3f2e1c7a94d5e9f6b8c4d7e2a1f3b/index.html', featured: 0, trending: 1, plays: 9870 }
];

const seedDatabase = () => {
    console.log('🌱 Starting database seed...\n');

    try {
        // Initialize database tables
        initDatabase();

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        db.exec('DELETE FROM analytics');
        db.exec('DELETE FROM games');
        db.exec('DELETE FROM categories');

        // Prepare statements
        const insertCategory = db.prepare(`
            INSERT INTO categories (name, slug, description, icon, color)
            VALUES (?, ?, ?, ?, ?)
        `);

        const insertGame = db.prepare(`
            INSERT INTO games (title, slug, description, instructions, category_id, thumbnail_url, game_url, plays, featured, trending, new_release, multiplayer, mobile_friendly)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        // Seed categories
        console.log('\n📁 Seeding categories...');
        const categoryMap = {};

        for (const cat of categories) {
            const slug = slugify(cat.name, { lower: true, strict: true });
            const result = insertCategory.run(cat.name, slug, cat.description, cat.icon, cat.color);
            categoryMap[cat.name] = result.lastInsertRowid;
            console.log(`   ✅ ${cat.name}`);
        }

        // Seed games
        console.log('\n🎮 Seeding games...');

        for (const game of games) {
            const categoryId = categoryMap[game.category];
            if (categoryId) {
                const slug = slugify(game.title, { lower: true, strict: true });
                insertGame.run(
                    game.title,
                    slug,
                    game.description || '',
                    game.instructions || '',
                    categoryId,
                    game.thumbnail_url || '',
                    game.game_url,
                    game.plays || 0,
                    game.featured || 0,
                    game.trending || 0,
                    game.new_release || 0,
                    game.multiplayer || 0,
                    1 // mobile_friendly
                );
                console.log(`   ✅ ${game.title}`);
            }
        }

        // Get counts
        const gameCount = db.prepare('SELECT COUNT(*) as count FROM games').get().count;
        const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;

        console.log('\n' + '='.repeat(50));
        console.log(`✨ Seeding completed successfully!`);
        console.log(`   📊 Categories: ${categoryCount}`);
        console.log(`   🎮 Games: ${gameCount}`);
        console.log('='.repeat(50) + '\n');

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

// Run the seed
seedDatabase();