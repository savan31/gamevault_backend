// backend/scripts/add-bulk-games.js

// Use the same database config as the main app so it respects DATABASE_PATH, WAL, etc.
const { db, initDatabase } = require('../config/database');

// All games - includes existing 16 + 5 new ones = 21 total
const games = [
    // ============ SHOOTING (5 games) ============
    {
        title: "Krunker.io",
        slug: "krunker-io",
        description: "Fast-paced first-person shooter with blocky graphics. Jump, aim, and shoot your way to victory in this addictive multiplayer FPS.",
        instructions: "WASD to move, mouse to aim and shoot, Space to jump, Shift to crouch, R to reload",
        category: "Shooting",
        thumbnail_url: "https://picsum.photos/seed/krunker/512/384",
        game_url: "https://krunker.io/",
        width: 960,
        height: 600,
        featured: true,
        trending: true,
        multiplayer: true,
        mobile_friendly: false
    },
    {
        title: "Shell Shockers",
        slug: "shell-shockers",
        description: "Egg-themed multiplayer shooter where you play as armed eggs. Crack your enemies before they crack you!",
        instructions: "WASD to move, mouse to aim and shoot, Space to jump, E to change weapon",
        category: "Shooting",
        thumbnail_url: "https://picsum.photos/seed/shellshockers/512/384",
        game_url: "https://shellshock.io/",
        width: 960,
        height: 600,
        featured: true,
        trending: true,
        multiplayer: true,
        mobile_friendly: false
    },
    {
        title: "Ev.io",
        slug: "ev-io",
        description: "Futuristic arena shooter with stunning graphics. Battle other players in sci-fi environments with advanced weapons.",
        instructions: "WASD to move, mouse to aim and shoot, Space to jump, Shift to dash",
        category: "Shooting",
        thumbnail_url: "https://picsum.photos/seed/evio/512/384",
        game_url: "https://ev.io/",
        width: 960,
        height: 600,
        featured: true,
        trending: false,
        multiplayer: true,
        mobile_friendly: false
    },

    {
        title: "Diep.io",
        slug: "diep-io",
        description: "Control a tank and shoot obstacles and enemies to level up. Upgrade your stats and become the most powerful tank!",
        instructions: "WASD or Arrow keys to move, mouse to aim, click or Space to shoot. Destroy shapes to level up!",
        category: "Shooting",
        thumbnail_url: "https://picsum.photos/seed/diepio/512/384",
        game_url: "https://diep.io/",
        width: 960,
        height: 600,
        featured: true,
        trending: true,
        multiplayer: true,
        mobile_friendly: true
    },

    // ============ RACING (3 games) ============
    {
        title: "Drift Hunters",
        slug: "drift-hunters",
        description: "Ultimate drifting experience with realistic physics. Customize your car and master the art of drifting.",
        instructions: "Arrow keys to drive, Space for handbrake, C to change camera",
        category: "Racing",
        thumbnail_url: "https://picsum.photos/seed/drifthunters/512/384",
        game_url: "https://drifthunters.com/",
        width: 960,
        height: 600,
        featured: true,
        trending: true,
        multiplayer: false,
        mobile_friendly: true
    },
    {
        title: "Smash Karts",
        slug: "smash-karts",
        description: "3D multiplayer kart battle arena. Race and fight against players worldwide with crazy weapons and power-ups.",
        instructions: "WASD or Arrow keys to drive, Space to use weapon",
        category: "Racing",
        thumbnail_url: "https://picsum.photos/seed/smashkarts/512/384",
        game_url: "https://smashkarts.io/",
        width: 960,
        height: 600,
        featured: true,
        trending: true,
        multiplayer: true,
        mobile_friendly: true
    },


    // ============ MULTIPLAYER (6 games) ============
    {
        title: "Slither.io",
        slug: "slither-io",
        description: "Classic snake game reimagined for multiplayer. Eat, grow, and become the biggest snake on the server!",
        instructions: "Mouse to move, click or Space to boost (uses your length)",
        category: "Multiplayer",
        thumbnail_url: "https://picsum.photos/seed/slitherio/512/384",
        game_url: "https://slither.io/",
        width: 960,
        height: 600,
        featured: true,
        trending: true,
        multiplayer: true,
        mobile_friendly: true
    },
    {
        title: "Lordz.io",
        slug: "lordz-io",
        description: "Medieval strategy game where you build an army and conquer the map. Command knights, archers, and dragons!",
        instructions: "Mouse to move, click buttons to recruit units, collect gold to expand your army",
        category: "Multiplayer",
        thumbnail_url: "https://picsum.photos/seed/lordzio/512/384",
        game_url: "https://lordz.io/",
        width: 960,
        height: 600,
        featured: false,
        trending: false,
        multiplayer: true,
        mobile_friendly: true
    },
    {
        title: "Voxiom.io",
        slug: "voxiom-io",
        description: "Voxel-based multiplayer shooter. Build, destroy, and fight in destructible environments.",
        instructions: "WASD to move, mouse to aim and shoot, Space to jump, number keys for weapons",
        category: "Multiplayer",
        thumbnail_url: "https://picsum.photos/seed/voxiom/512/384",
        game_url: "https://voxiom.io/",
        width: 960,
        height: 600,
        featured: true,
        trending: false,
        multiplayer: true,
        mobile_friendly: false
    },

    {
        title: "Zombs Royale",
        slug: "zombs-royale",
        description: "Fast-paced 2D battle royale. Drop in, loot weapons, and fight to be the last one standing in 100-player matches!",
        instructions: "WASD to move, mouse to aim and shoot, E to pickup items, Tab for inventory",
        category: "Multiplayer",
        thumbnail_url: "https://picsum.photos/seed/zombsroyale/512/384",
        game_url: "https://zombsroyale.io/",
        width: 960,
        height: 600,
        featured: true,
        trending: true,
        multiplayer: true,
        mobile_friendly: true
    },

    // ============ SPORTS (8 Ball Pool) ============
    {
        title: "8 Ball Pool",
        slug: "8-ball-pool",
        description: "Classic online 8-ball pool game. Challenge players around the world and become the pool champion.",
        instructions: "Aim with your mouse, drag to set power, and release to shoot. Pot your balls and then the 8 ball to win.",
        category: "Sports",
        thumbnail_url: "https://picsum.photos/seed/8ballpool/512/384",
        game_url: "https://www.miniclip.com/games/8-ball-pool-multiplayer/",
        width: 960,
        height: 600,
        featured: true,
        trending: true,
        multiplayer: true,
        mobile_friendly: true
    },



];

// Category name to ID mapping
function getCategoryId(categoryName) {
    const stmt = db.prepare('SELECT id FROM categories WHERE name = ?');
    const category = stmt.get(categoryName);
    return category ? category.id : null;
}

// Clear existing games and add fresh ones
function seedGames() {
    console.log('\n🎮 GameVault - Adding/Updating Games\n');
    console.log('='.repeat(50));

    try {
        // Make sure tables exist
        initDatabase();

        // Clear existing games
        console.log('\n🗑️  Clearing existing games...');
        db.exec('DELETE FROM games');

        // Reset auto-increment (use single quotes for string value!)
        try {
            db.exec("DELETE FROM sqlite_sequence WHERE name='games'");
        } catch (e) {
            // sqlite_sequence might not exist if no auto-increment was used yet
            console.log('   (sqlite_sequence reset skipped)');
        }

        // Insert games
        const insertStmt = db.prepare(`
      INSERT INTO games (
        title, slug, description, instructions, category_id,
        thumbnail_url, game_url, width, height,
        featured, trending, new_release, multiplayer, mobile_friendly,
        plays, likes, status, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, datetime('now'), datetime('now')
      )
    `);

        let addedCount = 0;
        let errorCount = 0;

        for (const game of games) {
            const categoryId = getCategoryId(game.category);

            if (!categoryId) {
                console.log(`⚠️  Category not found for "${game.title}": ${game.category}`);
                errorCount++;
                continue;
            }

            try {
                insertStmt.run(
                    game.title,
                    game.slug,
                    game.description,
                    game.instructions,
                    categoryId,
                    game.thumbnail_url,
                    game.game_url,
                    game.width || 960,
                    game.height || 600,
                    game.featured ? 1 : 0,
                    game.trending ? 1 : 0,
                    game.new_release ? 1 : 0,
                    game.multiplayer ? 1 : 0,
                    game.mobile_friendly ? 1 : 0,
                    Math.floor(Math.random() * 10000), // Random initial plays
                    Math.floor(Math.random() * 500),   // Random initial likes
                    'active'
                );
                console.log(`✅ Added: ${game.title} (${game.category})`);
                addedCount++;
            } catch (err) {
                console.log(`❌ Error adding "${game.title}": ${err.message}`);
                errorCount++;
            }
        }

        // Update category game counts
        console.log('\n📊 Updating category game counts...');
        db.exec(`
      UPDATE categories SET game_count = (
        SELECT COUNT(*) FROM games WHERE games.category_id = categories.id AND games.status = 'active'
      )
    `);

        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 SUMMARY');
        console.log('='.repeat(50));
        console.log(`✅ Games added: ${addedCount}`);
        console.log(`❌ Errors: ${errorCount}`);
        console.log(`📁 Total games in database: ${db.prepare('SELECT COUNT(*) as count FROM games').get().count}`);

        // Show games by category
        console.log('\n📂 Games by Category:');
        const categoryCounts = db.prepare(`
      SELECT c.name, c.icon, COUNT(g.id) as count 
      FROM categories c 
      LEFT JOIN games g ON c.id = g.category_id 
      GROUP BY c.id 
      ORDER BY count DESC
    `).all();

        categoryCounts.forEach(cat => {
            console.log(`   ${cat.icon} ${cat.name}: ${cat.count} games`);
        });

        console.log('\n✨ Done! Restart your backend server to see changes.\n');

    } catch (error) {
        console.error('\n❌ Fatal error:', error.message);
        console.error(error.stack);
        process.exit(1);
    } finally {
        // Nothing to do; db connection is managed by config/database.js
    }
}

seedGames();