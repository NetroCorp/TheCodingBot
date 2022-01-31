module.exports = {
	name: "kiss",
	description: "Kiss someone :flushed:",
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

			msg = msg + " kiss" + ((args.length > 1) ? "es" : "ed") + " " + args.join(", ") + " :flushed:";
		} else
			msg = msg + ", it seems you need a kiss. Here! *kisses you*";

		const getJSON = require('get-json');
		getJSON(`https://api.themattchannel.com/imgs/kiss/`, function(error, response){
			if (error) {
				log("X", "SYS", "Failed to load kiss image.");
				console.log(error);

				return message.channel.send({ embed: {
					title: ":kiss: **Kiss**",
					color: client.config.system.embedColors.blue,
					description: msg,
					footer: { text: client.config.system.footerText + " | Error getting GIF." }
				}});
			};

			return message.channel.send({ embed: {
				title: ":kiss: **Kiss**",
				color: client.config.system.embedColors.pink,
				description: msg,
				image: { url: response.url },
				footer: { text: client.config.system.footerText }
			}});
		});
	}

};