/*
 * TheCodingBot v6
 * codingbot.gg
 * (c) 2023 Netro Corporation
*/

const { SlashCommandBuilder } = require("discord.js");

const meta = () => {
	return new SlashCommandBuilder()
		.setName("invite")
		.setDescription("Add me to a server!~");
};

const execute = async(bot, interaction) => {
	await interaction.reply({ embeds: [{
		title: bot.lang.get("invite.title", "en_US"),
		color: bot.config.colors.green,
		description: bot.lang.get("invite.description", "en_US", { INVITELINK: bot.config.discord.botInvite })
	}] });
	
	// `${bot.lang.get("hello_world.description", "en_US", { FULLVER: bot.version.getFull() })}`);
};

module.exports = (app) => {
	return {
		meta,
		execute
	}
};