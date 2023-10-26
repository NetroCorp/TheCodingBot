/*
 * TheCodingBot v6
 * codingbot.gg
 * (c) 2023 Netro Corporation
*/

require("dotenv").config();
const fs = require("fs");
const path = require("path");

const { ShardingManager } = require("discord.js");
const emojisJson = require("../emojis.json");
if (!emojisJson) emojisJson = {};

const config = {
	debug: (process.env.BOT_DEBUG_ENABLED == "true"),
	apis: {
		base: process.env.API_BASE
	},
	// == DISCORD
	discord: {
		// 1. Bot
		clientName: process.env.BOT_CLIENT_NAME,
		clientID: process.env.BOT_CLIENT_ID,
		clientSecret: process.env.BOT_CLIENT_SECRET,
		token: process.env.BOT_TOKEN,
		shardingEnabled: (process.env.BOT_SHARDING_ENABLED == "true"),

		// 2. Interactions
		enableSlashCommands: (process.env.COMMAND_SLASH_ENABLED == "true"),
		registerCommandsOnStart: (process.env.COMMAND_SLASH_REG_ON_START == "true"),
		// enablePrefixCommands: (process.env.COMMAND_PREFIX_ENABLED == "true"),

		// 3. Management
		owners: (process.env.OWNERS.includes(",")) ? process.env.OWNERS.split(",") : [process.env.OWNERS],
		// 4. Invites
		supportInviteBase: process.env.LINK_SUPPORT,
		botInviteBase: process.env.LINK_INVITE,
		botInvitePerms: process.env.PERMISSIONS || 8
	},
	// == DATABASE
	database: {
		host: process.env.DB_HOST,
		name: process.env.DB_NAME,
		user: process.env.DB_USER,
		pass: process.env.DB_PASS
	},
	// == COLORS
	colors: {
		red: 16711680,
		green: 65280,
		blue: 255,
		yellow: 16776960,
		orange: 16753920,
		purple: 8388736,
		pink: 16761035,
		teal: 32768,
		cyan: 65535,
		magenta: 16711935,
		random: (toReturn) => {
			const colorsN = Object.keys(config.colors).filter(c => c !== "random");
			const name = colorsN[Math.floor(Math.random() * colorsN.length)];

			return (toReturn == "name" ? name : (toReturn == "value" ? config.colors[name] : { name, value: config.colors[name] }))
		}
	},
	// == EMOJIS
	emojis: {
		success: emojisJson.success || ":white_check_mark:",
		warning: emojisJson.warning || ":warning:",
		information: emojisJson.information || ":information_source:",
		error: emojisJson.error || ":x:",
		question: emojisJson.question || ":question:"
	}
};

const botJSFile = path.join(__dirname, "bot.js");

if (config.shardingEnabled) {
	console.log("\x1b[31mPlease do not use sharing, yet.\x1b[0m");
	process.exit(-1);
	// console.log("Sharding is enabled, launching shards...");
	// const manager = new ShardingManager(botJSFile, {
	// 	token: config.token
	// });
	// manager.on('shardCreate', shard => {
	// 	console.log(`Hello from Shard ${shard.id}!`);
	// });
	// manager.spawn();
} else {
	require(botJSFile)(config);
};