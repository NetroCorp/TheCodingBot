module.exports = (client, guild) => {
	log("i", "DISCORD", `[EVENTS] [GUILD CREATE] Added to server ${guild.name} (${guild.id})!`);

	var globalGuildLog = client.config.system.logChannels.guilds; // Global Logging Channel
	var fields = [
		{ name: "Guild Name", value: guild.name, inline: true},
		{ name: "Guild ID", value: guild.id, inline: true },
		{ name: "Guild Created", value: guild.createdAt, inline: false },
		{ name: "Owner Full Tag", value: guild.owner.user.tag, inline: true},
		{ name: "Owner ID", value: guild.owner.user.id, inline: true },
		{ name: "Owner Joined Discord", value: guild.owner.user.createdAt, inline: false }
	]; // Fields for the add

	globalGuildLog = client.channels.cache.get(globalGuildLog);
	if (globalGuildLog == null) {
		log("X", "SYS", "[EVENTS] [GUILD CREATE] Whoops! Something went wrong!\nGlobal guild add channel NOT found!");
	} else {
		globalGuildLog.send({ embed: {
			thumbnail: { url: guild.iconURL({ format: 'png', dynamic: true, size: 1024 }) },
			title: client.config.system.emotes.success + ` **Added to ${guild.name}!**`,
			color: client.config.system.embedColors.lime,
			fields: fields,
			footer: { text: client.config.system.footerText }
		}});
	};


	// Load Server settings
	configReloader(client, "allServerSettings.json")
	var defaultServer = client.config.allServerSettings.default;

	let channelID;
	let channels = guild.channels.cache;
	channelLoop:
	for (let c of channels) {
		let channelType = c[1].type;
		if (channelType === "text") {
			channelID = c[0];
			break channelLoop;
		};
	};

	let channel = client.channels.cache.get(guild.systemChannelID || channelID);

	channel.send({ embed: {
		title: client.config.system.emotes.success + " **TheCodingBot's Addition to this Server!**",
		color: client.config.system.embedColors.lime,
		description: "Hi **" + guild.name + "**! Thanks for adding me!!",
		fields: [
			{ name: "Introduction", value: "I'm **TheCodingBot**, a multi-purpose Discord bot, which comes with logging (message edits and deletes), moderation commands (kick, ban, unban), its own currency (Bytes), and more!" },
			{ name: "Prefix information", value: "My default prefix is `" + defaultServer.prefix + "`, however you can change it at any time with `" + defaultServer.prefix + "config prefix newprefixhere`!" },
			{ name: "What now?", value: "Enough introduction, let's get to work! If you're done with this message, you can delete it from this channel. To begin, run `" + defaultServer.prefix + "help` to see what I can do!" },
			{ name: "'Uh-oh! Something's wrong...', 'I want (or need) updates!', or something else?", value: "Have no worries! Join the Development Support Server via [Discord](https://discord.gg/HdKeWtV) or Direct Message <@222073294419918848>." },
			{ name: "Don't forget! The bot's usage is governed by the TheCodingBot Privacy Policy.", value: "Please take some time to read our [Privacy Policy](https://tcb.nekos.tech/privacy). By using TheCodingBot, you are agreeing you have read the Privacy Policy and that you agree to the terms listed in the Privacy Policy." }
		],
		footer: { text: client.config.system.footerText }
	}});

};
