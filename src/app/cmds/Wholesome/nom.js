module.exports = {
    name: "nom",
    description: "Mmm, tasty.",
    author: ["Aisuruneko"],
    aliases: [],
    syntax: [],
    permissions: ["DEFAULT"],
    cooldown: 2,
    guildOnly: false,
    hidden: false,
    options: [{
        name: 'user',
        description: 'The user you want to nom.',
        type: 6,
        required: true
    }],

    execute: (app, interaction, args) => {
        app.functions.interactions.getImg("nom")
            .then((response) => {
                const nommedUser = interaction.guild.members.cache.get(interaction.options.get('user').value);
                let msg = `${interaction.user.toString()} **${app.lang.get(interaction.userInfo.get("language"), "commands.nom.noms")}** ${nommedUser.user.toString()}`;

                if (interaction.user.id === nommedUser.user.id) msg = `**${app.lang.get(interaction.userInfo.get("language"), "commands.nom.personal")}** ${interaction.user.username}`;

                interaction.followUp({
                    content: msg,
                    embeds: [{
                        // title: app.lang.get(interaction.userInfo.get("language"), "commands.nom.title"),
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
                        title: app.lang.get(interaction.userInfo.get("language"), "commands.nom.title"),
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