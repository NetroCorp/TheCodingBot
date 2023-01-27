//
// TheCodingBot
// Netro Corporation
//
// https://codingbot.gg

const cmdArgs = process.argv.slice(2);

const usingShard = cmdArgs.includes("--shard") || cmdArgs.includes("-s"); // Determine if user wants shard.
const debugMode = cmdArgs.includes("--debug") || cmdArgs.includes("-d"); // Determine if user wants debug.

if (usingShard) {
// 	const ShardManager = require(`${process.cwd()}/ShardManager.js`);
	console.log("not yet there.")
	process.exit();
};

require(`${process.cwd()}/src/bot.js`)(debugMode);