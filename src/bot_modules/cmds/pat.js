module.exports = {
	name: "pat",
	description: "Give someone a nice little pat.",
	guildOnly: false,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["DEFAULT"],
	cooldown: 2,
	aliases: [],
	syntax: [],
	execute: async(client, message, args) => {
		var msg = "<@" + message.author.id + ">";

		if (args[0] && args[0] != null && args[0] != "" && args[0] != " ") {
			 for (var i = 0; i < args.length; i++)
			 	args[i] = args[i].replace(args[i].replace(/[<@!>]/g, ''), args[i].replace(/[<@!>]/g, ''));

			msg = msg + " pats " + args.join(", ");
		} else
			msg = msg + ", it seems you need a pat. Here! *pats you*";

		const getJSON = require('get-json');
		getJSON(`https://api.themattchannel.com/imgs/pat/`, function(error, response){
			if (error) {
				log("X", "SYS", "Failed to load pat image.");
				console.log(error);

				return message.channel.send({ embed: {
					title: ":thumbsup: **Pat**",
					color: client.config.system.embedColors.blue,
					description: msg,
					footer: { text: client.config.system.footerText + " | Error getting GIF." }
				}});
			};

			return message.channel.send({ embed: {
				title: ":thumbsup: **Pat**",
				color: client.config.system.embedColors.pink,
				description: msg,
				image: { url: response.url },
				footer: { text: client.config.system.footerText }
			}});
		});
	}

};