module.exports = {
	name: "ver",
	description: "Gets Version Information for TheCodingBot.",
	guildOnly: false,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["DEFAULT"],
	cooldown: 2,
	aliases: ["version"],
	syntax: [],
	execute: async(client, message, args) => {
		return message.channel.send({ embed: {
			title: client.config.system.emotes.information + " **TheCodingBot Version Information**",
			color: client.config.system.embedColors.blue,
			fields: [
				{ name: "Version", value: `${client.config.system.version.build}${client.config.system.version.branchS} (v${client.config.system.version.build} ${client.config.system.version.branch})` },
			],
			footer: { text: client.config.system.footerText }
		}});
	}
};