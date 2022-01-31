module.exports = {
	name: "enlarge",
	description: "Enlarge and view that amazing emoji ^^",
	guildOnly: false,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["DEFAULT"],
	cooldown: 2,
	aliases: [],
	syntax: [" <emoteIDEmoteURLorEmote>"],
	execute: async(client, message, args) => {

		if (args[0] == null) {
			message.channel.send({ embed: {
				title: client.config.system.emotes.error + " **Emoji Stealer**",
				color: client.config.system.embedColors.red,
				description: "What am I going to enlarge for you? **The spacing of the keys on your keyboard?!**",
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

				return message.channel.send({ files: [emoteURL] });

			} catch (Ex) {
				message.channel.send({ embed: {
					title: client.config.system.emotes.error + " **Emoji Enlarger**",
					color: client.config.system.embedColors.red,
					description: "**Sorry!**\nCould not fetch that amazing emote!\nPossible reasons:\n - The emote has been deleted or is invaild.\n - The emote is not allowed to be obtained via this bot.\n - The URL specified is not a Discord URL.\n - The Discord CDN is currently down.\n - Something else that needs to be addressed to the bot developer.",
					footer: { text: client.config.system.footerText }
				}});
			};
		};
	},
};