module.exports = {
	name: "explode",
	description: "Explodes anything and anyone! ",
	guildOnly: false,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["DEFAULT"],
	cooldown: 2,
	aliases: ["boom", "kaboom"],
	syntax: [" <UserID/@User>"],
	execute: async(client, message, args) => {
		var disallowed = [
			//"thecodingguy",
			//"tcg",
			//"222073294419918848",
			"thecodingbot",
			"tcb",
			"438532019924893707"
		];

		if (args[0] == null || args[0] == undefined) 
			return message.channel.send({ embed: {
				title: client.config.system.emotes.error + " **Explode Error!**",
				color: client.config.system.embedColors.red,
				description: "What are you trying to do? Blow yourself up?",
				footer: { text: client.config.system.footerText }
			}});
		var whoIsKaboom = args.join(" ");
		for (var i = 0; i < disallowed.length; i++)
			if (whoIsKaboom.toLowerCase() == disallowed[i] || whoIsKaboom.toLowerCase().includes(disallowed[i]))
				return message.channel.send({ embed: {
					title: client.config.system.emotes.error + " **Explode Error!**",
					color: client.config.system.embedColors.red,
					description: "You're trying to kaboom a entity that's in the disallowed list (" + disallowed[i] + ")",
					footer: { text: client.config.system.footerText }
				}});

		if (whoIsKaboom.includes(message.author.id) || whoIsKaboom.includes(message.author.tag))
			return message.channel.send({ embed: {
				title: client.config.system.emotes.error + " **Explode Error!**",
				color: client.config.system.embedColors.red,
				description: "No, I'm not going to blow you up.",
				footer: { text: client.config.system.footerText }
			}});
		
		var bombFiles = [
			"bomb1.gif",
			"bomb2.gif",
			"bomb3.gif",
			"bomb4.gif",
			"bomb5.gif",
			"bomb6.gif",
			"bomb7.gif",
			"bomb8.gif",
			"bomb9.gif",
			"bomb10.gif"
		];
		var bombFile = bombFiles[Math.floor(Math.random() * bombFiles.length)];

		var randomExplosionTexts = ["Kaboom!", "BOOM!", "Explooosion!", "爆発！", "Bombs have been fired!", "The name's Duke Nuke 'em"]
		var randomExplosionText = randomExplosionTexts[Math.floor(Math.random() * randomExplosionTexts.length)];

		message.channel.send({ embed: {
			title: client.config.system.emotes.wait + " **Explode!**",
			color: client.config.system.embedColors.aqua,
			description: client.config.system.emotes.d_wait + " Sending the bomb...",
			footer: { text: client.config.system.footerText }
		}}).then(msg => {
			// var bombURL = `https://officialtcgmatt.com/d/discord/TheCodingBot/imgs/explosion/${encodeURIComponent(bombFile)}`;
			//var bombURL = `https://i.otcgm.xyz/discord/TheCodingBot/explosion/${encodeURIComponent(bombFile)}`;
			var bombURL = `https://api.themattchannel.com/imgs/explosion/${encodeURIComponent(bombFile)}`;
			var request = require('request');
			request(bombURL, function (err, resp) {
				if (resp.statusCode == 200) {
					log("S", "SYS", "[EXPLODE] Using image: " + bombURL);

					msg.edit({ embed: {
						title: client.config.system.emotes.information + " **Explode!**",
						color: client.config.system.embedColors.aqua,
						fields: [
							{ name: randomExplosionText, value: whoIsKaboom + " is now kaboom!" },
							{ name: "But uh...", value: "That made a huge mess..." }
						],
						image: {
							url: bombURL
						},
						footer: { text: client.config.system.footerText }
					}
					});
				} else {
					msg.edit({ embed: {
						title: client.config.system.emotes.wait + " **Explode!**",
						color: client.config.system.embedColors.aqua,
						description: client.config.system.emotes.d_wait + " Sending the bomb... **" + client.config.system.emotes.error + " Server down!**\n" + client.config.system.emotes.d_wait + " Sending the bomb (via Fallback Server)...",
						footer: { text: client.config.system.footerText }
					}});
					setTimeout(function() {
						bombURL = `./bot_modules/imgs/explosion/${bombFile}`;
						log("S", "SYS", "[EXPLODE] Using image: " + bombURL);

						setTimeout(function() { msg.delete() }, 1500);
						message.channel.send({ embed: {
							title: client.config.system.emotes.information + " **Explode!**",
							color: client.config.system.embedColors.aqua,
							fields: [
								{ name: randomExplosionText, value: whoIsKaboom + " is now kaboom!" },
								{ name: "But uh...", value: "That made a huge mess..." }
							],
							files: [{
								attachment: bombURL,
								file: bombFile
							}],
							footer: { text: client.config.system.footerText + " | There was an error." }
						}
						});
					}, 3000);
				};
			});
		});
	},
};