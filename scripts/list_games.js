const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../gamevault.db');
const db = new Database(dbPath);

try {
    const games = db.prepare("SELECT g.id, g.title, g.slug, c.name as category FROM games g JOIN categories c ON g.category_id = c.id").all();
    console.log(`Total games: ${games.length}`);
    console.table(games);
} catch (error) {
    console.error(error);
}
