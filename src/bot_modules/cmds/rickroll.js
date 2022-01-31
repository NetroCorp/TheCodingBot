module.exports = {
	name: "rickroll",
	description: "Rickroll",
	guildOnly: false,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["DEFAULT"],
	cooldown: 2,
	aliases: [],
	syntax: [ " <UserID/@User>" ],
	execute: async(client, message, args) => {

		var user = message.author.id;
		if (args[0] && args[0] != null && args[0] != "" && args[0] != " ")
			user = args[0].replace(/[<@!>]/g, '');

		var answers = [ "%user%.. you've been rickrolled!", "%user% is never gonna give you up, never gonna let you down, never gonna turn around and desert you.", "Never gonna give %user% up. Never gonna let %user% down. Never gonna turn around and desert %user%. Never gonna make %user% cry. Never gonna say goodbye. Never gonna run around and hurt %user%." ];
		var answer = answers[Math.floor(Math.random() * answers.length)];


		return message.channel.send({ embed: {
			title: client.config.system.emotes.rickroll + " **Rickroll**",
			color: client.config.system.embedColors.purple,
			description: answer.split("%user%").join("<@" + user + ">"),
			footer: { text: client.config.system.footerText }
		}});
	}	
};