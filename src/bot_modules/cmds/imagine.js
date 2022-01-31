module.exports = {
	name: "imagine",
	description: "Show off your imagination!",
	guildOnly: false,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["DEFAULT"],
	cooldown: 5,
	aliases: [],
	syntax: [],
	execute: async(client, message, args) => {
		message.channel.send({ embed: {
			title: client.config.system.emotes.information + " **Imagine**",
			color: client.config.system.embedColors.blue,
			fields: [
				{ name: `${message.author.username} is imagining...`, value: args.slice(0).join(" ") }
			],
			footer: { text: client.config.system.footerText }
		}});
	},
};