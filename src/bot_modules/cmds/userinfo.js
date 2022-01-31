module.exports = {
	name: "userinfo",
	description: "Get the information of a user.",
	guildOnly: false,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["DEFAULT"],
	cooldown: 2,
	aliases: [ "user", "u" ],
	syntax: [
		" <UserID/@User>"
	],
	execute: async(client, message, args) => {
		function fetchData(type, user, wasInCache) {

			var embedFields = [
				{ name: "Username", value: user.username, inline: true },
				{ name: "Discriminator", value: user.discriminator, inline: true },
				{ name: "Full Tag", value: (user.bot) ? user.tag + " **[BOT]**" : user.tag, inline: false },
				{ name: "ID", value: user.id, inline: true },
				{ name: "Joined Discord", value: user.createdAt, inline: true },
				{ name: "Avatar", value: "Click/Tap **[HERE]("+user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })+")** for full size!", inline: false }
			];

			var status = "Offline";
			var states = {
				"offline": client.config.system.emotes.discord.offline + " **Offline**",
				"idle": client.config.system.emotes.discord.idle + " **Idle**",
				"dnd": client.config.system.emotes.discord.dnd + " **Do Not Disturb**",
				"online": client.config.system.emotes.discord.online + " **Online**"
			};

			if (user.presence != "offline") {
				status = states[user.presence.status];
				if (user.presence.activities.length > 0) {
					for (var i=0;i<user.presence.activities.length;i++) {
						var activity = user.presence.activities[i];
						if (activity.type == "CUSTOM_STATUS")
							status += "\n**" + activity.name + "** " + activity.state;
						else
							status += "\n**" + activity.type + "** " + activity.name;
					};
				};
			};

			embedFields.push({ name: "Presence", value: status }); 

			if (!wasInCache)
				embedFields.unshift({ name: "Hold up!", value: "This user has never been seen by this bot.\nSome information may be inaccurate." });

			if (message.guild) {
				if (message.guild.members.cache.get(user.id) != null) {
					if (message.guild.members.cache.get(user.id).nickname != null)
						embedFields.push({ name: "Nickname", value: message.guild.members.cache.get(user.id).nickname });
					if (message.guild.members.cache.get(user.id).roles.cache.array().length > 1)
						embedFields.push({ name: "Roles", value: message.guild.members.cache.get(user.id).roles.cache.array().sort((a, b) => a.comparePositionTo(b)).reverse().map(role => role).join(" ").replace("@"+"everyone", "") }); // Thanks to Nooooah#9507
					else
						embedFields.push({ name: "Roles", value: "User has no roles.. :<" });

					function getJoinPosition(ID) {
						var memberJoins = message.guild.members.cache.array().sort((a, b) => a.joinedAt - b.joinedAt);
						for (var i = 0; i < memberJoins.length; i++){ if (memberJoins[i].id == ID) return i; } ;
					};

					embedFields.push(
						{ name: "Joined Server", value: new Date(message.guild.members.cache.get(user.id).joinedAt).toString(), inline: true },
						{ name: "Join Position", value: (getJoinPosition(user.id) + 1), inline: true }
					);
				} else { };
			};

			var embed = { embed: {
				thumbnail: { url: user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) },
				title: client.config.system.emotes.information + " **User Information**",
				color: client.config.system.embedColors.lime,
				fields: embedFields,
				footer: { text: client.config.system.footerText }
			}};

			return embed;
		};

		var userToGet = message.author.id, gotData = null;
		try {
			if (args[0] != null) {
				userToGet = args[0].replace(/[<@!>]/g, '');
			};
			var wasInCache = client.users.cache.get(userToGet) || false;

			await client.users.fetch(userToGet).then(function(user) {
				gotData = fetchData("user", user, wasInCache);
			});

			message.channel.send(gotData);
		} catch (Ex) {
			var embed = { embed: {
				title: client.config.system.emotes.error + " **User Information**",
				color: client.config.system.embedColors.red,
				footer: { text: client.config.system.footerText }
			}};

			if (Ex.message.includes("Unknown User"))
				embed.embed.description = "**That user does not exist!**\nCheck the ID and/or ping and try again.";
			else
					embed.embed.fields = [ { name: "Error! Error!", value: "```js\n" + Ex.stack + "```" } ];
			message.channel.send(embed);
		};
	}
};