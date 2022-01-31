module.exports = async (client, member) => {
	// -- MAIN

	if (member.partial) member = await member.fetch(); // Make sure our cache is up-to-date! ^^

	// Load Server settings
	configReloader(client, "allServerSettings.json");

	if (client.config.allServerSettings.customServers[member.guild.id] == null) return; // If the server has no settings, what can we do?
	client.currentServer = client.config.allServerSettings.customServers[member.guild.id]; // Load in the server settings.

	var serverMemLog = client.currentServer.logChannels.joins;

	var inviteInfo = await GetInviteInfo();
	if (inviteInfo["msg"] == null) {
		if (inviteInfo["code"] == null)
			inviteInfo["code"] = "I do not know how they joined.";
		if (inviteInfo["inviter"] == null)
			inviteInfo["inviter"] = { "tag": "Unknown#0000", "id": "0" };
		if (inviteInfo["uses"] == null)
			inviteInfo["uses"] = 0;
	};

	console.log(inviteInfo);
	var fields = [
		{ name: "Full Tag", value: member.user.tag + " " + (member.user.bot ? "**[BOT]**" : ""), inline: true},
		{ name: "ID", value: member.user.id, inline: true },
		{ name: "Joined Discord", value: member.user.createdAt, inline: false },
		{ name: "Invited by", value: (inviteInfo["msg"] != null ? inviteInfo["msg"] : "**" + inviteInfo["inviter"]["tag"] + "** (" + inviteInfo["inviter"]["id"] + ") using code **" + inviteInfo["code"] + "**. It now has **" + inviteInfo["uses"] + "** uses."), inline: false }
	]; // Fields for the join

	function nth(n){return["st","nd","rd"][((n+90)%100-10)%10-1]||"th"};
	var guild = member.guild, memberCount = guild.members.cache.size;
	memberCount += nth(memberCount);

	if (serverMemLog == null || serverMemLog == "") fields.push({name: "Uh-oh...", value: "No log channel for members that join are setup!"})
	else if (!client.currentServer.logChannels.enabled) fields.push({name: "Uh-oh...", value: "Logging is currently disabled!!"})
	else {
		client.channels.cache.get(serverMemLog).send({ embed: {
			thumbnail: { url: member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) },
			title: client.config.system.emotes.success + ` **User Joined ${guild.name}!**`,
			color: client.config.system.embedColors.lime,
			description: `They are the **${memberCount}** member!`,
			fields: fields,
			footer: { text: client.config.system.footerText }
		}});
	};

	if (client.currentServer.coolThings && client.currentServer.coolThings.members != null && client.currentServer.coolThings.members.joinChannel && client.currentServer.coolThings.members.joinChannel != "") {
		var joinMsg = client.currentServer.coolThings.members.joinMsg, joinChannel = client.currentServer.coolThings.members.joinChannel;
		if (joinMsg == null)
			joinMsg = client.config.allServerSettings.default.coolThings.members.joinMsg;

		joinChannel = client.channels.cache.get(joinChannel);

		if (joinChannel) {
			// GenerateMemberJoin(joinChannel, joinMsg);

			var GenerateMemberJoinSys = require(`./sys/GenerateMemberJoin.js`);
			try {
				if (inviteInfo["inviter"] == null)
					inviteInfo["inviter"] = { "tag": null, "id": null };
				GenerateMemberJoinSys(client, member, joinChannel, joinMsg, inviteInfo);
			} catch (Ex) {
				log("X", "SYS", "[EVENTS] [MEMBER JOIN] Failed to generate member join.\n" + Ex.message);
				console.log(Ex);
			};
		};
	};

	// -- FUNCTIONS

	async function GetInviteInfo() {
		try {
			if (member.user.bot) return { "msg": "OAuth" };

			const cachedInvites = client.guildInvites.get(member.guild.id);
			const newInvites = await member.guild.fetchInvites();

			if (member.guild.vanityURLCode) newInvites.set(member.guild.vanityURLCode, await member.guild.fetchVanityData());
			client.guildInvites.set(member.guild.id, newInvites);
			const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses);

			if (!usedInvite) return { "msg": "I do not know how they joined" };
			if(usedInvite.code === member.guild.vanityURLCode) {
				await client.invites.findOrCreate({where: {discordUser: member.id, guildID: member.guild.id}, defaults: {inviter: 'VANITY', discordUser: member.id, guildID: member.guild.id}});
				return { "msg": "Server Vanity URL" };
			}
			else return { "inviter": { "tag": usedInvite.inviter.tag, "id": usedInvite.inviter.id }, "code": usedInvite.code, "uses": usedInvite.uses };

			let foc = await client.invites.findOrCreate({where: {discordUser: usedInvite.inviter.id, guildID: member.guild.id}, defaults: {discordUser: usedInvite.inviter.id, invites: 0, guildID: member.guild.id}});
			if (foc.length > 0) {
				await client.invites.findOrCreate({where: {discordUser: member.id, guildID: member.guild.id}, defaults: {inviter: usedInvite.inviter.id, discordUser: member.id, guildID: member.guild.id}})
				await foc[0].increment('invites');
			};

			// if(!welcomeChannel) return;
			// let toSend = client.config.welcomeMessage.replace(/\{member\}/g, member.toString()).replace(/\{inviter\}/g, usedInvite.inviter.tag).replace(/\{invites\}/g, foc[0].invites + 1).replace(/\{code\}/g, usedInvite.code).replace(/\{mention\}/g, usedInvite.inviter.toString()).replace(/\{ID\}/g, member.id).replace(/\{inviterID\}/g, usedInvite.inviter.id);
			// welcomeChannel.send(toSend).catch(err => console.log(err));

		} catch (Ex) {
			console.log(Ex.message + "\n\n" + Ex.stack);
			return { msg: "Sorry, something went wrong while fetching this information." };
		};
	};
};