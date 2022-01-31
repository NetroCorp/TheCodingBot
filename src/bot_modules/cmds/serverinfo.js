module.exports = {
	name: "serverinfo",
	description: "Get the information of the current server, or server based on its invite.",
	guildOnly: true,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["DEFAULT"],
	cooldown: 2,
	aliases: [ "server", "s" ],
	syntax: [],
	execute: async(client, message, args) => {
		var guild = message.guild;
		var usercount = guild.members.cache.filter(member => !member.user.bot).size;
		var botcount = guild.memberCount - usercount;

		message.channel.send({embed:{
			thumbnail: { url: guild.iconURL({ format: 'png', dynamic: true, size: 1024 }) },
			title: client.config.system.emotes.information + " **Server Information**",
			color: client.config.system.embedColors.lime,
			description: "**Server information for `" + guild.name + "`**",
			fields: [
				{ "name": "Guild Name (ID)", "value": guild.name + " (" + guild.id + ")" },
				{ "name": "Server Icon URL", "value": "[Click/Tap here to view in browser](" + guild.iconURL({ format: 'png', dynamic: true, size: 1024 }) + ")" },
				{ "name": "Owner (ID)", "value": client.users.cache.get(guild.ownerID).tag + " (" + guild.ownerID + ")" },
				{ "name": "Guild Features", "value": (guild.features.length > 0) ? "`" + guild.features.join("`, `") + "`" : "`NONE`" },
				{ "name": "Role Count", "value": guild.roles.cache.size, "inline": true },
				{ "name": "Channel Count", "value": guild.channels.cache.size, "inline": true },
				{ "name": "Member Count", "value": "There are **" + guild.memberCount + "** total.\nThere are **" + botcount + "** bots.\nThere are **" + usercount + "** users.", "inline": true },
				{ "name": "Large Server? (250+ members)", "value": guild.large, "inline": true },
				{ "name": "Region", "value": guild.region, "inline": true },
				{ "name": "Verification Level", "value": guild.verificationLevel, "inline": true },
				{ "name": "Server Created At", "value": guild.createdAt.toString() },
				{ "name": "TheCodingBot Joined At", "value": guild.joinedAt.toString() }
				],
			footer: { text: client.config.system.footerText }
		}});
	}
};