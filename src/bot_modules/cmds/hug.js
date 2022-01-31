module.exports = {
	name: "hug",
	description: "Give someone a nice little hug.",
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

			msg = msg + " hug" + ((args.length > 1) ? "s" : "ged") + " " + args.join(", ");
		} else
			msg = msg + ", it seems you need a hug. Here! *hugs you*";

		const getJSON = require('get-json');
		getJSON(`https://api.themattchannel.com/imgs/hug/`, function(error, response){
			if (error) {
				log("X", "SYS", "Failed to load hug image.");
				console.log(error);

				return message.channel.send({ embed: {
					title: ":hugging: **Hug**",
					color: client.config.system.embedColors.blue,
					description: msg,
					footer: { text: client.config.system.footerText + " | Error getting GIF." }
				}});
			};

			return message.channel.send({ embed: {
				title: ":hugging: **Hug**",
				color: client.config.system.embedColors.pink,
				description: msg,
				image: { url: response.url },
				footer: { text: client.config.system.footerText }
			}});
		});
	}

};