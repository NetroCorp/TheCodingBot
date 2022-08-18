/*
	TheCodingBot v6
	https://tcb.nekos.tech
*/

module.exports = {
	name: "guildUnavailable",
	description: "Emits when a guild goes poof!",
	author: ["Aisuruneko"],

	execute: async(app, guild) => {
		app.logger.warn("DISCORD", `[${guild.id}] --> ${guild.name} is now Unavailable!`);
	}
}