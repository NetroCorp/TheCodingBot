module.exports = {
    name: "slap",
    description: "Maybe... it's for wholesome reasons..? Right..?",
    author: ["Aisuruneko"],
    aliases: [],
    syntax: [],
    permissions: ["DEFAULT"],
    cooldown: 2,
    guildOnly: false,
    hidden: false,
    options: [{
        name: 'user',
        description: 'The user you want to slap.',
        type: 6,
        required: true
    }],

    execute: (app, interaction, args) => {
        app.functions.interactions.getImg("slap")
            .then((response) => {
                const slappedUser = interaction.guild.members.cache.get(interaction.options.get('user').value);
                let msg = `${interaction.user.toString()} **${app.lang.get(interaction.userInfo.get("language"), "commands.slap.slaps")}** ${slappedUser.user.toString()}`;

                if (interaction.user.id === slappedUser.user.id) msg = `**${app.lang.get(interaction.userInfo.get("language"), "commands.slap.personal")}** ${interaction.user.username}`;

                interaction.followUp({
                    content: msg,
                    embeds: [{
                        // title: app.lang.get(interaction.userInfo.get("language"), "commands.slap.title"),
                        // description: `${msg}`,
                        color: app.config.system.embedColors.lime,
                        image: { url: response.data.url },
                        footer: { text: app.config.system.footerText }
                    }]
                });
            })
            .catch((response) => {
                interaction.followUp({
                    embeds: [{
                        title: app.lang.get(interaction.userInfo.get("language"), "commands.slap.title"),
                        color: app.config.system.embedColors.red,
                        fields: [
                            { name: app.lang.get(interaction.userInfo.get("language"), "errors.generic"), value: response.error }
                        ],
                        footer: { text: app.config.system.footerText }
                    }]
                });
            })
    }
}