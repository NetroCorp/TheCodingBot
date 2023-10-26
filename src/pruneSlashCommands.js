/*
 * TheCodingBot v6
 * codingbot.gg
 * (c) 2023 Netro Corporation
*/

require("dotenv").config();
const fs = require("fs");
const path = require("path");

const { Client, REST, Routes } = require("discord.js");
const self = {
	config: { debug: true, discord: { token: process.env.BOT_TOKEN } },
	uptime: { startAt: new Date().getTime() }
};
const Logger = require(path.join(__dirname, "/utils/", `logger.js`))();
self.logger = new Logger.execute(self);


const sayErrorAndCrash = (errMsg) => {
	// Say error
	bot.logger.error("BOOTSTRAP", `Check failed while starting: ${errMsg}`);
	// And crash.
	process.exit(-1);
};
if (!self.config.discord || !self.config.discord == null || self.config.discord == "") return sayErrorAndCrash("Discord data or config loader broken.");
if (!self.config.discord.token || self.config.discord.token == null || self.config.discord.token == "") return sayErrorAndCrash("Bot Token not set! Set it in .env under BOT_TOKEN");

self.logger.debug("BOOTSTRAP", "Creating bot client...");
self.client = new Client({
	intents: [],
	partials: []
});

self.logger.debug("BOOTSTRAP", "Registering events...");
self.client.on("ready", async() => {
	self.logger.info("SYSTEM", `Logged in as ${self.client.user.tag}`);

	// Do the dirty work.
	const { REST, Routes } = require('discord.js');
	const rest = new REST({ version: "10" }).setToken(self.config.discord.token);

	await self.client.guilds.cache.forEach(async guild => {
		await rest.put(Routes.applicationGuildCommands(self.client.user.id, guild.id), { body: [] }).then(() => {
			self.logger.info("DISCORD", `Successfully deleted all application commands for ${guild.id}!`);
		});
	});

	await rest.put(Routes.applicationCommands(self.client.user.id), { body: [] }).then(() => {
		self.logger.info("DISCORD", "Successfully deleted all application commands!");
	});

	self.logger.debug("DISCORD", "Logging out...");
	self.client.destroy();

	self.logger.debug("SYSTEM", "Exiting...");
	process.exit(0);
});

self.client.login(self.config.discord.token).catch(err => {
	self.logger.error("SYSTEM", `Failed to login! - ${err}`);
});
