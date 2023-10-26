/*
 * TheCodingBot v6
 * codingbot.gg
 * (c) 2023 Netro Corporation
*/

class ready {
	constructor() {
		this.functions = [];
	}

	meta = () => {
		return {
			name: "ready",
			type: "normal"
		};
	}

	add = (fun) => {
		this.functions.push(fun);
	}

	run = (app, params) => {
		this.default(app, params); // Run default function
		this.functions.forEach(fun => fun(app, params)); // Run other functions.
	}

	default = async(bot, params) => {
		// bot.footerText = bot.footerText.replaceAll("%currentYear%", new Date().getFullYear());
		bot.logger.info("DISCORD", `Logged in as ${bot.client.user.tag}`);

		if ((bot.commands && (bot.commands ? bot.commands.slash_data : false)) && bot.config.discord.registerCommandsOnStart) {
			const startRegister = new Date().getTime();
			bot.logger.info("DISCORD", "Now registering slash commands...");
			const { Routes, REST } = require("discord.js");
			const rest = new REST({ version: "10" }).setToken(bot.config.discord.token);
			try {
				await rest.put(
					Routes.applicationCommands(bot.client.user.id),
					{ body: bot.commands.slash_data }
				);
				bot.logger.debug("DISCORD", `Successfully registered all slash commands in ${new Date().getTime() - startRegister}ms.`);
			} catch (Ex) {
				bot.logger.error("DISCORD", `Could not register slash commands.`);
				console.log(Ex);
			};
		};


		bot.uptime.readyAt = new Date().getTime();
		const totalTime = (bot.uptime.readyAt - bot.uptime.startAt);
		bot.logger.info("SYSTEM", `Startup finished! It took ${totalTime}ms (${totalTime / 1000}s)!`);


		if (!bot.config.discord.botInviteBase || bot.config.discord.botInviteBase == null || bot.config.discord.botInviteBase == "") {
			bot.config.discord.botInvite = `https://discord.com/oauth2/authorize?client_id=${bot.client.user.id}&permissions=${bot.config.discord.botInvitePerms}&scope=bot`;
		} else bot.config.discord.botInvite = bot.config.discord.botInviteBase;

		setTimeout(() => {
			if (bot.client.guilds.cache.size < 1) {
				bot.logger.info("SYSTEM", `We have detected this bot is in no servers. So, here's your link to add it to the first server!\n\t${bot.config.discord.botInvite}`);
			} else {
				let servCount = 0;
				const guildPromises = [];

				bot.client.guilds.cache.forEach(async guild => {
					if (!guild.available) {
						bot.logger.info("DISCORD", `[${guild.id}] I'm not available! Will not be able to cache.`);
						return;
					};

					const promise = (async() => {
						await bot.functions.sleep((servCount % 10 == 0) ? 1000 : 7270);
						await guild.members.fetch();
						await guild.channels.fetch();
						await guild.roles.fetch();

						bot.logger.debug("DISCORD", `[${guild.id}] Cached ${guild.members.cache.size} members, ${guild.members.cache.size} channels, and ${guild.members.cache.size} roles.`);
						servCount++;
					})();

					guildPromises.push(promise);
				});
				Promise.all(guildPromises)
					.then(() => { bot.logger.debug("DISCORD", `Cached ${servCount}/${bot.client.guilds.cache.size} guilds!`); })
					.catch((err) => { bot.logger.debug("DISCORD", `Error occurred during caching!\n${err}`); });
			};
		}, 1500); // Give any extra time to show other stuff.
	}
}

module.exports = function() { return new ready() }