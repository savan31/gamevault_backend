const { db } = require('../config/database');

try {
    const game = db.prepare("SELECT g.*, c.name as category_name FROM games g JOIN categories c ON g.category_id = c.id WHERE g.slug = 'pacman'").get();
    if (game) {
        console.log("🎮 Pacman found in database:");
        console.table([game]);
    } else {
        console.log("❌ Pacman not found in database.");
    }
} catch (error) {
    console.error("Error checking Pacman:", error.message);
}
