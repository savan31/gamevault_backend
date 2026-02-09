const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../gamevault.db');
const db = new Database(dbPath);

try {
    const categories = db.prepare("SELECT * FROM categories").all();
    console.log("Categories in DB:");
    console.table(categories);
} catch (error) {
    console.error(error);
}
