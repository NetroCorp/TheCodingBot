module.exports = {
	name: "inviteinfo",
	description: "Get the information of a server, based on its invite.",
	guildOnly: false,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["DEFAULT"],
	cooldown: 2,
	aliases: [ "i" ],
	syntax: [],
	execute: async(client, message, args) => {
		const getJSON = require('get-json');

		let invitelink = args[0];
		if (!invitelink || invitelink == null || invitelink == undefined) { 
			message.channel.send({ embed: {
				title: client.config.system.emotes.error + " **Invite Information**",
				color: client.config.system.embedColors.red,
				description: `Could not load Invite Information for **${invite}**.`,
				fields: [
					{ name: "Reason", value: "No invite to check, enter a valid Discord invite." }
				],
				footer: { text: client.config.system.footerText }
			}});
		};

		var invite = invitelink.replace(/[\/]/g, '');
		invite = invite.replace("https:", "");
		invite = invite.replace("http:", "");
		invite = invite.replace("discord.gg", "");
		var info = {};

		getJSON(`https://discordapp.com/api/v8/invites/${invite}?with_counts=true`, function(error, response){
			if (error) {
				log("X", "SYS", "Failed to get invite information.");
				console.log(error);
				return message.channel.send({ embed: {
					title: client.config.system.emotes.error + " **Invite Information Error**",
					color: client.config.system.embedColors.red,
					description: `Could not load Invite Information for **${invite}**.`,
					fields: [
						{ name: "Reason", value: "The invite may be expired, invaild, or the API is said, \"yeet\"." }
					],
					footer: { text: client.footertxt }
				}});
			}


			info = response;

			var guildiconurl = "";
			if (info.guild.icon == null) guildiconurl = "";
			else guildiconurl = "https://cdn.discordapp.com/icons/" + info.guild.id + "/" + info.guild.icon;

			if (info.guild.icon.startsWith("a_")) guildiconurl = guildiconurl + ".gif";
			else guildiconurl = guildiconurl + ".png";

			return message.channel.send({ embed: {
				thumbnail: { url: guildiconurl },
				title: client.config.system.emotes.information + " **Invite Information**",
				color: client.config.system.embedColors.blue,
				description: "**Invite Information for `" + invite + "`**",
				fields: [
					{ "name": "Guild Name", "value": `${info.guild.name} (${info.guild.id})` },
					{ "name": "Guild Approx. Member Count", "value": info.approximate_member_count },
					{ "name": "Guild Inviter", "value": (info.inviter != null) ? info.inviter.username + "#" + info.inviter.discriminator + " (" + info.inviter.id + ")" : "No one (it might be from the widget or a vanity URL)." },
					{ "name": "Guild Features", "value": (info.guild.features.length > 0) ? "`" + info.guild.features.join("`, `") + "`" : "`NONE`"  },
					{ "name": "Guild Invite Channel", "value": `#${info.channel.name} (${info.channel.id}) <#${info.channel.id}>` }
				],
				footer: { text: client.footertxt }
			}});
		});
	}
};