/*
	TheCodingBot v6
	https://tcb.nekos.tech
*/

module.exports = {
    name: "interactionCreate",
    description: "Fired when a new interaction (slash command usually) is received.",
    author: ["Aisuruneko"],

    execute: async(app, interaction) => {
        // Slash Command
        if (interaction.isChatInputCommand()) {
            await interaction.deferReply({ ephemeral: false }).catch(() => {});

            const cmd = app.client.slashCommands.get(interaction.commandName);
            if (!cmd)
                return interaction.followUp({ content: app.lang.get(interaction.userInfo.get("language"), "errors.commands.generic") });

			interaction.member = interaction.guild.members.cache.get(interaction.user.id) || null;
			interaction.channel = interaction.guild.channels.cache.get(interaction.channelId) || app.client.channels.cache.get(interaction.channelId);

			// Check if they have agreed to the EULA
			// PLACEHOLDER

			// Check if they have permissions
			if (!app.functions.interactions.hasPermissions(interaction, cmd)) {
				return interaction.followUp({ content: app.lang.get(interaction.userInfo.get("language"), "errors.commands.no_permission") });
			}

            const args = [];

            for (let option of interaction.options.data) {
                if (option.type === "SUB_COMMAND") {
                    if (option.name) args.push(option.name);
                    if (option.options)
                        option.options.forEach((x) => {
                            if (x.value) args.push(x.value);
                        });
                } else if (option.value) args.push(option.value);
            };

			// Get their info from DB
			interaction.userInfo = await app.DBs.TheCodingBot.userSettings.findOne({ where: { userID: interaction.user.id } });
			const analyticalData = (!(interaction.userInfo.get("optedOut")) ? await app.DBs.TheCodingBot.analytics.findOne({ where: { userID: interaction.user.id } }) : null);

            try {
				await cmd.execute(app, interaction, args);

				if (analyticalData != null) await app.DBs.TheCodingBot.analytics.update({ commandsExecuted: (analyticalData.get("commandsExecuted") + 1) }, { where: { userID: interaction.user.id } });
			} catch (Ex) {
				interaction.followUp({
					embeds: [{
						title: app.lang.get(interaction.userInfo.get("language"), "errors.generic"),
						color: app.config.system.embedColors.red,
						fields: [
							{ name: Ex.message, value: "```js\n" + ((Ex.stack) ? Ex.stack : Ex.message) + "```" }
						],
						footer: { text: app.config.system.footerText }
					}]
				});

				if (analyticalData != null) await app.DBs.TheCodingBot.analytics.update({ commandsErrored: (analyticalData.get("commandsErrored") + 1) }, { where: { userID: interaction.user.id } });
			}

			return;
        }

        // Context Menu
        if (interaction.isContextMenuCommand()) {
            await interaction.deferReply({ ephemeral: false });
            const command = app.client.slashCommands.get(interaction.commandName);
            if (command) command.execute(app, interaction);

			return;
        }
    }
}