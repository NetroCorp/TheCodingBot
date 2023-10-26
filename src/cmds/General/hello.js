/*
 * TheCodingBot v6
 * codingbot.gg
 * (c) 2023 Netro Corporation
*/

const { SlashCommandBuilder } = require("discord.js");

const meta = () => {
	return new SlashCommandBuilder()
		.setName("hello")
		.setDescription("Hello world - testing.");
};

const execute = async(bot, interaction) => {
	await interaction.reply(`${bot.lang.get("hello_world.description", "en_US", { FULLVER: bot.version.getFull() })}`);
};

module.exports = (app) => {
	return {
		meta,
		execute
	}
};