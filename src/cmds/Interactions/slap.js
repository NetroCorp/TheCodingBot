/*
 * TheCodingBot v6
 * codingbot.gg
 * (c) 2023 Netro Corporation
*/

const { SlashCommandBuilder } = require("discord.js");
const INTERACTION_TYPE = "Slap";

const meta = () => {
	return new SlashCommandBuilder()
		.setName(INTERACTION_TYPE.toLowerCase())
		.setDescription(`${INTERACTION_TYPE} someone!~`)
		.addUserOption(option => option
			.setName("target")
			.setDescription("The target")
			.setRequired(true)
		);
};

const execute = async(bot, interaction) => {
	const target = interaction.options.getUser("target");
	const imgResponse = await bot.functions.fetchFromAPI(`/imgs/${INTERACTION_TYPE.toLowerCase()}`);

	let description;
	if (interaction.user.id === target.id) description = bot.lang.get(`${INTERACTION_TYPE.toLowerCase()}.description_self`, "en_US", { EXECUTOR: interaction.user.toString() })
	else if (interaction.user.id === bot.client.user.id) description = bot.lang.get(`${INTERACTION_TYPE.toLowerCase()}.description_bot`, "en_US", { EXECUTOR: interaction.user.toString() })
	else description = bot.lang.get(`${INTERACTION_TYPE.toLowerCase()}.description`, "en_US", { EXECUTOR: interaction.user.toString(), TARGET: target.toString() });

	await interaction.reply({ embeds: [{
		title: bot.lang.get(`${INTERACTION_TYPE.toLowerCase()}.title`, "en_US"),
		color: bot.config.colors.green,
		description,
		image: { url: (imgResponse && (imgResponse.data)) ? imgResponse.data.url : null }
	}] });
};

module.exports = (app) => {
	return {
		meta,
		execute
	}
};