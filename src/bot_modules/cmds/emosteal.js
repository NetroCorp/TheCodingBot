module.exports = {
	name: "emosteal",
	description: "Steal-- I mean -- Grabs a emoji for you for you have for your own! ^^",
	guildOnly: true,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["MANAGE_EMOJIS"],
	cooldown: 2,
	aliases: ["emojisteal", "emotesteal"],
	syntax: [
		" <emoteIDEmoteURLorEmote>",
		" <emoteIDEmoteURLorEmote> <steal/upload> [emojiname]"
	],
	execute: async(client, message, args) => {

		if (args[0] == null) {
			message.channel.send({ embed: {
				title: client.config.system.emotes.error + " **Emoji Stealer**",
				color: client.config.system.embedColors.red,
				description: "What am I going to steal for you? **Frickin' air?!**",
				footer: { text: client.config.system.footerText }
			}});
		} else {

			try {
				var ErrMsg = client.config.system.emotes.error + " **Could not get this data.**";
				var emote = ErrMsg, emoteName = ErrMsg, emoteID = ErrMsg, emoteURL = ErrMsg, emoteURLSource = "https://cdn.discordapp.com/emojis/";

				// for (var i=0; i < args.slice(0).length; i++) { // For each emote
				// 	
				// };

				emote = args[0];

				if (emote.startsWith(emoteURLSource)) {
					emoteID = emote.split(emoteURLSource)[1].split(".")[0].replace(/[^0-9]+/g, '');
					emoteURL = args[0];
				} else if (emote.startsWith("<") || !isNaN(emote)) {
					emoteID = emote.replace(/[^0-9]+/g, '');
					emoteURL = `${emoteURLSource}${emoteID}.png?v=1`;
				} else {
					throw new Error("Emote is not a valid Discord emote. Does not match URL either.");
				};

				if (emote != emoteURL)
					emoteName = emote.toLowerCase().split(">")[0].replace("<a:", "").replace(/[^a-z]+/g, '');

				if (emote.startsWith("<a:") && !emote.startsWith(emoteURLSource))
					emoteURL = emoteURL.replace(".png", ".gif");

				if (!args[1] || args[1] != "upload" && args[1] != "steal") {
					return message.channel.send({ embed: {
						title: client.config.system.emotes.success + " **Emoji Stealer - View**",
						color: client.config.system.embedColors.lime,
						fields: [
							{ name: "Emote Name", value: emoteName },
							{ name: "Emote ID", value: emoteID }
						],
						image: {
							url: emoteURL
						},
						footer: { text: client.config.system.footerText }
					}});
				} else {
					var stolenEmoteName = emoteName;
					if (args[2] && args[2] != null) stolenEmoteName = args[2];

					message.channel.send({ embed: {
						thumbnail: { url: emoteURL },
						title: client.config.system.emotes.wait + " **Emoji Stealer**",
						color: client.config.system.embedColors.aqua,
						description: "**Uploading to the server as '" + stolenEmoteName + "'**",
						fields: [
							{ name: "Stolen Emote Name", value: client.config.system.emotes.d_wait + " **Processing...**" },
							{ name: "Stolen Emote ID", value: client.config.system.emotes.d_wait + " **Processing...**" },
							{ name: "Old Emote Name", value: emoteName },
							{ name: "Old Emote ID", value: emoteID }
						],
						footer: { text: client.config.system.footerText }
					}}).then(msg => {
						message.guild.emojis.create(emoteURL, stolenEmoteName).then(emoji => {
							msg.edit({ embed: {
								thumbnail: { url: emoteURL },
								title: client.config.system.emotes.success + " **Emoji Stealer - Steal the Emoji!!**",
								color: client.config.system.embedColors.lime,
								description: "**Some emojis are not authorized for use out of other servers. Make sure you obtain proper permissions before re-uploading.**",
								fields: [
									{ name: "Stolen Emote Name", value: emoji.name },
									{ name: "Stolen Emote ID", value: emoji.id },
									{ name: "Old Emote Name", value: emoteName },
									{ name: "Old Emote ID", value: emoteID }
								],
								footer: { text: client.config.system.footerText }
							}});
						}).catch(console.error);
					});
				};

			} catch (Ex) {
				message.channel.send({ embed: {
					title: client.config.system.emotes.error + " **Emoji Stealer**",
					color: client.config.system.embedColors.red,
					description: "**Sorry!**\nCould not fetch that amazing emote!\nPossible reasons:\n - The emote has been deleted or is invaild.\n - The emote is not allowed to be obtained via this bot.\n - The URL specified is not a Discord URL.\n - The Discord CDN is currently down.\n - Something else that needs to be addressed to the bot developer.",
					footer: { text: client.config.system.footerText }
				}});
			};
		};
	},
};