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

			interaction.userInfo = {
				preferredLanguage: Object.keys(app.config.langs)[Math.floor(Math.random() * Object.keys(app.config.langs).length)]
			}

            const cmd = app.client.slashCommands.get(interaction.commandName);
            if (!cmd)
                return interaction.followUp({ content: app.lang.get(interaction.userInfo.preferredLanguage, "errors.commands.generic") });

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
            interaction.member = interaction.guild.members.cache.get(interaction.user.id);

            cmd.execute(app, interaction, args);

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