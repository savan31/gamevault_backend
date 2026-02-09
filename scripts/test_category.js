const { Category } = require('../models');

async function test() {
    try {
        console.log("Testing getWithGames('multiplayer')...");
        const result = Category.getWithGames('multiplayer');
        if (result) {
            console.log("Success! Found category:", result.name);
            console.log("Games count:", result.games.length);
        } else {
            console.log("Failed! Category not found.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

test();
