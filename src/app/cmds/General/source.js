/*
	TheCodingBot v6
	https://tcb.nekos.tech
*/

module.exports = {
    name: "source",
    description: "Source Code?? Where??",
    author: ["Aisuruneko"],
	aliases: [],
	syntax: [],
	permissions: [ "DEFAULT" ],
	cooldown: 2,
	guildOnly: false,
	hidden: false,

    execute: async(app, interaction) => {
		interaction.followUp({
			embeds: [{
				title: app.lang.get(interaction.userInfo.get("language"), "commands.source.title"),
				description: app.lang.get(interaction.userInfo.get("language"), "commands.source.description").replace("LINK", "https://tcb.nekos.tech/source"),
				color: app.config.system.embedColors.blue,
				footer: { text: app.config.system.footerText }
			}]
		});
    }
}