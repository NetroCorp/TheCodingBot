module.exports = {
	name: "cookie",
	description: "Give someone a treat!",
	guildOnly: false,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["DEFAULT"],
	cooldown: 2,
	aliases: [ "treat"],
	syntax: [ " <@UserOrID>" ],
	execute: async(client, message, args) => {
		var msg = "<@" + message.author.id + ">";

		if (args[0] && args[0] != null && args[0] != "" && args[0] != " ") {
			 for (var i = 0; i < args.length; i++)
			 	args[i] = args[i].replace(args[i].replace(/[<@!>]/g, ''), args[i].replace(/[<@!>]/g, ''));

			msg = msg + " g" + ((args.length > 1) ? "ives cookies" : "ave a cookie") + " :cookie: to " + args.join(", ");
		} else
			msg = msg + ", *gives you a cookie :cookie:*";

		return message.channel.send({ embed: {
			color: client.config.system.embedColors.pink,
			description: msg,
			footer: { text: client.config.system.footerText }
		}});
	}

};