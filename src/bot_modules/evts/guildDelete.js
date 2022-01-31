module.exports = (client, guild) => {
	log("i", "DISCORD", `[EVENTS] [GUILD DELETE] Removed from server ${guild.name} (${guild.id})!`);

	var globalGuildLog = client.config.system.logChannels.guilds; // Global Logging Channel

	var fields = [
		{ name: "Guild Name", value: guild.name, inline: true},
		{ name: "Guild ID", value: guild.id, inline: true },
		{ name: "Guild Created", value: guild.createdAt, inline: false },
		{ name: "Owner Full Tag", value: guild.owner.user.tag, inline: true},
		{ name: "Owner ID", value: guild.owner.user.id, inline: true },
		{ name: "Owner Joined Discord", value: guild.owner.user.createdAt, inline: false }
	]; // Fields for the removal

	globalGuildLog = client.channels.cache.get(globalGuildLog);
	if (globalGuildLog == null) {
		log("X", "SYS", "[EVENTS] [GUILD DELETE] Whoops! Something went wrong!\nGlobal guild remove channel NOT found!");
	} else {
		globalGuildLog.send({ embed: {
			thumbnail: { url: guild.iconURL({ format: 'png', dynamic: true, size: 1024 }) },
			title: client.config.system.emotes.information + ` **Removed from ${guild.name}!**`,
			color: client.config.system.embedColors.blue,
			fields: fields,
			footer: { text: client.config.system.footerText }
		}});
	};

};
