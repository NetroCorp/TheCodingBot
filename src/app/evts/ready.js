/*
	TheCodingBot v6
	https://tcb.nekos.tech
*/

module.exports = {
    name: "ready",
    description: "Runs when the Gateway does something.",
    author: ["Aisuruneko"],

    execute: async(app, data) => {
		app.logger.info("SYS", `[${app.client.user.tag}] Connected to Discord!`);

		// Fetch all members for initially available guilds
		try {
			app.logger.info("SYS", `Found ${app.client.guilds.cache.size} servers to cache.`);
			const promises = app.client.guilds.cache.map(guild => {
				app.logger.info("SYS", `[${guild.id}] --> Cache members...`);
				if (guild.available) guild.members.fetch(true)
				else Promise.resolve();
				app.logger.debug("SYS", `[${guild.id}] --> Members cached: ${guild.members.cache.size}`);
				app.logger.info("SYS", `[${guild.id}] --> Cached members.`);

				app.logger.info("SYS", `[${guild.id}] --> Cache roles...`);
				if (guild.available) guild.roles.fetch(true)
				else Promise.resolve();
				app.logger.debug("SYS", `[${guild.id}] --> Roles cached: ${guild.roles.cache.size}`);
				app.logger.info("SYS", `[${guild.id}] --> Cached roles.`);
			});
			await Promise.all(promises);
		} catch (err) {
			app.logger.error("SYS", `Failed to fetch all members! ${err}\n${err.stack}`);
		} finally {
			const registeringToAll = app.config.commands.registerToAllServers;
			try {
				if (registeringToAll)
					await app.client.application.commands.set(app.client.arrayOfSlashCommands);
				else
					await app.client.guilds.cache.get(app.config.commands.registerToServer).commands.set(app.client.arrayOfSlashCommands);
				app.client.arrayOfSlashCommands = null;
			} catch (err) {
				app.logger.error("SYS", `Failed to register to slash commands! ${err}\n${err.stack}`);
			} finally {
			};
		};
    }
}