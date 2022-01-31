module.exports = {
	name: "nsfw",
	description: "( ͡° ͜ʖ ͡°)",
	guildOnly: false,
	authorizedGuilds: [

	],
	hidden: true,
	permissions: ["DEFAULT"],
	cooldown: 5,
	aliases: [],
	syntax: [
		" <type>"
	],
	execute: async(client, message, args) => {

		message.channel.send({ embed: {
			title: ":underage: **NSFW**",
			color: client.config.system.embedColors.red,
			description: "The NSFW command is currently not supported at this time.",
			footer: { text: client.config.system.hromefooterText }
		}});
	}
};