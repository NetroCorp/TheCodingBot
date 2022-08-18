/*
	TheCodingBot v6
	https://tcb.nekos.tech
*/

module.exports = {
	name: "test",
	description: "Test command.",
	author: ["Aisuruneko"],
	aliases: [],
	syntax: [],
	permissions: [ "DEFAULT" ],
	cooldown: 2,
	guildOnly: false,
	hidden: false,

	execute: async(app, interaction) => {
		interaction.followUp({ content: app.lang.get(interaction.userInfo.get("language"), "commands.test.test") });
	}
}