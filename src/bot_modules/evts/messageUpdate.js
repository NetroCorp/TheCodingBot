module.exports = (client, oldmessage, newmessage) => {
	if (oldmessage.author.bot) return; // Verify the "user" isn't a bot. 
	if (oldmessage.content == newmessage.content) return; // Check because edit fires when a image is loaded for whatever reason.

	var fields = [
		{ name: "Author Details", value: oldmessage.author.tag + " (" + oldmessage.author.id + ") in " + ((oldmessage.channel.name != null) ? oldmessage.channel.name : "DMs")  + " (" + oldmessage.channel.id + ")\nMessage ID: " + oldmessage.id }
	];

	var oldcontent = oldmessage.content, newcontent = newmessage.content;
	if (oldmessage.content != null || oldmessage.content != "undefined" || oldmessage.content != " ") {
		fields.push({ name: "Before", value: oldmessage.content }); // Field for the "Before"
	};
	if (newmessage.content != null || newmessage.content != "undefined" || newmessage.content != " ") {
		fields.push({ name: "Now", value: newcontent }); // Field for the "Now"
	};

	if (oldmessage.guild == null) { // Check if the guild is null
		if (oldmessage.author.id != "222073294419918848") { // Make sure its not Matt
			client.users.cache.get("222073294419918848").send({ embed: {
				thumbnail: { url: oldmessage.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) },
				title: client.config.system.emotes.warning + " **Message Edited**",
				color: client.config.system.embedColors.yellow,
				fields: fields,
				footer: { text: client.config.system.footerText }
			}});
		};
		return;
	};

	// Load Server settings
	configReloader(client, "allServerSettings.json");

	if (client.config.allServerSettings.customServers[oldmessage.guild.id] == null) return; // If the server has no settings, what can we do?
	client.currentServer = client.config.allServerSettings.customServers[oldmessage.guild.id]; // Load in the server settings.

	var serverMsgLog = client.currentServer.logChannels.edits;

	if (serverMsgLog == null || serverMsgLog == "") fields.push({name: "Uh-oh...", value: "No log channel for messages that are edited is setup!"})
	else if (!client.currentServer.logChannels.enabled) fields.push({name: "Uh-oh...", value: "Logging is currently disabled!!"})
	else {
		var channel = client.channels.cache.get(serverMsgLog);
		if (channel != undefined) client.channels.cache.get(serverMsgLog).send({ embed: {
			thumbnail: { url: oldmessage.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) },
			title: client.config.system.emotes.warning + " **Message Edited**",
			color: client.config.system.embedColors.yellow,
			fields: fields,
			footer: { text: client.config.system.footerText }
		}});
	};

};
