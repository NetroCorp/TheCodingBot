module.exports = async (client, member) => {
	// -- MAIN

	// Load Server settings
	configReloader(client, "allServerSettings.json");

	if (client.config.allServerSettings.customServers[member.guild.id] == null) return; // If the server has no settings, what can we do?
	client.currentServer = client.config.allServerSettings.customServers[member.guild.id]; // Load in the server settings.

	var serverMemLog = client.currentServer.logChannels.leaves;

	var fields = [
		{ name: "Full Tag", value: member.user.tag + " " + (member.user.bot ? "**[BOT]**" : ""), inline: true},
		{ name: "ID", value: member.user.id, inline: true },
	]; // Fields for the leaves
// 		{ name: "Invited by", value: await GetInviteInfo(), inline: false }
	var guild = member.guild, memberCount = guild.members.cache.size;


	if (serverMemLog == null || serverMemLog == "") fields.push({name: "Uh-oh...", value: "No log channel for members that leave are setup!"})
	else if (!client.currentServer.logChannels.enabled) fields.push({name: "Uh-oh...", value: "Logging is currently disabled!!"})
	else {
		client.channels.cache.get(serverMemLog).send({ embed: {
			thumbnail: { url: member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) },
			title: client.config.system.emotes.information + ` **User Left ${guild.name}!**`,
			color: client.config.system.embedColors.blue,
			description: `There are now **${memberCount}** members!`,
			fields: fields,
			footer: { text: client.config.system.footerText }
		}});
	};

	if (client.currentServer.coolThings && client.currentServer.coolThings.members != null && client.currentServer.coolThings.members.leaveChannel && client.currentServer.coolThings.members.leaveChannel != "") {
		var leaveMsg = client.currentServer.coolThings.members.leaveMsg, leaveChannel = client.currentServer.coolThings.members.leaveChannel;
		if (leaveMsg == null)
			leaveMsg = client.config.allServerSettings.default.coolThings.members.leaveMsg;

		leaveChannel = client.channels.cache.get(leaveChannel);

		if (leaveChannel)
			GenerateMemberLeave(leaveChannel, leaveMsg);

	};


	// -- FUNCTIONS

	async function GenerateMemberLeave(channelToSend, messageToSend) {
		channelToSend.send(messageToSend.replace("%username%", member.user.username).replace("%usertag%", member.user.tag).replace("%user%", "<@"+member.user.id+">").replace("%server%", member.guild.name));
	};

/*
	async function GetInviteInfo() {
		try {
			if (member.user.bot) return "OAuth";

			let user = await client.invites.findOne({where: {discordUser: member.id, guildID: member.guild.id}});
			if (!user || !user.inviter) return "I do not know how they joined.";
			if (user.inviter === 'VANITY') return "**Server Vanity URL**.";

		        let inviter = await client.invites.findOne({where: {discordUser: `${user ? user.inviter : `none`}`, guildID: member.guild.id}});
			if (!inviter) {
				inviter = await client.users.fetch(user.inviter).catch(err => console.log(err));
				return "**" + inviter.tag + "**";
			};

			// await inviter.decrement('invites');
			// inviter.user = await client.users.fetch(user.inviter).catch(err => console.log(err));
			// let inviterMember = await member.guild.members.fetch(inviter.discordUser);

	        	// let toSend = client.config.leaveMessage.replace(/\{member\}/g, member.user.tag).replace(/\{inviter\}/g, inviter.user.tag).replace(/\{invites\}/g, inviter.invites - 1).replace(/\{mention\}/g, inviterMember.toString()).replace(/\{ID\}/g, member.id).replace(/\{inviterID\}/g, inviterMember.id);
			// welcomeChannel.send(toSend).catch(err => console.log(err));

			client.invites.destroy({where: {discordUser: member.id}});

		} catch (Ex) {
			console.log(Ex.message + "\n\n" + Ex.stacktrace);

			return "Sorry, something went wrong while fetching this information.";
		};
	};
*/
};