/*
 * TheCodingBot v6
 * codingbot.gg
 * (c) 2023 Netro Corporation
*/

class interactionCreate {
	constructor() {
		this.functions = [];
	}

	meta = () => {
		return {
			name: "interactionCreate",
			type: "normal"
		};
	}

	add = (fun) => {
		this.functions.push(fun);
	}

	run = (app, params) => {
		this.default(app, params); // Run default function
		this.functions.forEach(fun => fun(app, params)); // Run other functions.
	}

	default = async(bot, params) => {
		const interaction = params[0];

		interaction.userSettings = {

		};

		if (interaction.isChatInputCommand()) {
			const command = bot.commands.slash.get(interaction.commandName);
			if (!command) return interaction.reply("I couldn't find that command.");

			if (command.meta.ownerOnly && !bot.config.discord.owners.includes(interaction.user.id)) 
				return interaction.reply({ embeds: [{
					title: `${bot.config.emojis.error} This command can only be ran by bot owners.`,
					color: bot.config.colors.red
				}] });

			try {
				// Run command.
				await command.execute(bot, interaction);
			} catch (Ex) {
				const errEmbed = await bot.functions.genError(
					interaction,
					Ex
				);

				return interaction.reply({ embeds: [ errEmbed ] });
			} finally {
				// Save command execution.
			}
			return;
		};
	}
}

module.exports = function() { return new interactionCreate() }