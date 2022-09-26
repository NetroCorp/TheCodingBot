module.exports = {
    name: "kiss",
    description: "Kiss someone 😳!",
    author: ["Aisuruneko"],
    aliases: [],
    syntax: [],
    permissions: ["DEFAULT"],
    cooldown: 2,
    guildOnly: false,
    hidden: false,
    options: [{
        name: 'user',
        description: 'The user you want to kiss.',
        type: 6,
        required: true
    }],

    execute: (app, interaction, args) => {
        app.functions.interactions.getImg("kiss")
            .then((response) => {
                const kissedUser = interaction.guild.members.cache.get(interaction.options.get('user').value);
                let msg = `${interaction.user.toString()} **${app.lang.get(interaction.userInfo.get("language"), "commands.kiss.kisses")}** ${kissedUser.user.toString()}`;

                if (interaction.user.id === kissedUser.user.id) msg = `**${app.lang.get(interaction.userInfo.get("language"), "commands.kiss.personal")}** ${interaction.user.username}`;

                interaction.followUp({
                    content: msg,
                    embeds: [{
                        // title: app.lang.get(interaction.userInfo.get("language"), "commands.kiss.title"),
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
                        title: app.lang.get(interaction.userInfo.get("language"), "commands.kiss.title"),
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