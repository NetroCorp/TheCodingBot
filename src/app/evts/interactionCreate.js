/*
	TheCodingBot v6
	https://tcb.nekos.tech
*/

module.exports = {
    name: "interactionCreate",
    description: "Fired when a new interaction (slash command usually) is sent.",
    author: ["Aisuruneko"],

    execute: async(app, interaction) => {
        // Slash Command
        if (interaction.isChatInputCommand()) {
            await interaction.deferReply({ ephemeral: false }).catch(() => {});

            const cmd = app.client.slashCommands.get(interaction.commandName);
            if (!cmd)
                return interaction.followUp({ content: "An error has occurred " });

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