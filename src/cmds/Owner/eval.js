/*
 * TheCodingBot v6
 * codingbot.gg
 * (c) 2023 Netro Corporation
*/

const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

const meta = () => {
	return new SlashCommandBuilder()
		.setName("eval")
		.setDescription("Run JS code.")
		.addStringOption(option => option
			.setName("code")
			.setDescription("The code to execute")
			.setRequired(true)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages);
};

const execute = async(bot, interaction) => {
	try {
		const { inspect } = require("util");
		const code = interaction.options.getString("code");

		let evaluated = inspect(eval(code, { depth: 0 }));
		if (evaluated !== "Promise { <pending> }") {
			return await interaction.reply({ embeds: [{
				title: bot.lang.get("eval.title", "en_US"),
				color: bot.config.colors.green,
				description: "```js\n" + ((evaluated == "") ? "" : evaluated) + "```"
			}]});
		} else return await interaction.reply({ content: "** **" });
	} catch (Ex) {
		return await interaction.reply({ embeds: [{
			title: bot.lang.get("eval.title", "en_US"),
			color: bot.config.colors.red,
			description: "```js\n" + Ex.stack + "```"
		}]});
	};
};

module.exports = (app) => {
	return {
		meta,
		execute
	}
};