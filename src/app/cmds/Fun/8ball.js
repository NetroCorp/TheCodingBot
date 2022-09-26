module.exports = {
    name: "8ball",
    description: "Ask the magic 8ball a question!",
    author: ["Aisuruneko"],
    aliases: [],
    syntax: [],
    permissions: ["DEFAULT"],
    cooldown: 2,
    guildOnly: false,
    hidden: false,
    options: [{
        name: 'question',
        description: 'The question of choice.',
        type: 3,
        required: true
    }],

    execute: (app, interaction, args) => {
        const question = interaction.options.get('question') ? interaction.options.get('question').value : null,
            responses = app.lang.get(interaction.userInfo.get("language"), "commands.8ball.responses");

        if (question == null) return interaction.followUp({ embeds: [{ title: app.lang.get(interaction.userInfo.get("language"), "commands.8ball.title"), color: app.config.system.embedColors.red, description: app.lang.get(interaction.userInfo.get("language"), "errors.commands.8ball.no_question"), footer: { text: app.config.system.footerText } }] });
        const responsePick = Object.keys(responses)[Math.floor(Math.random() * Object.keys(responses).length)];

        interaction.followUp({
            embeds: [{
                title: app.lang.get(interaction.userInfo.get("language"), "commands.8ball.title"),
                color: app.config.system.embedColors[responses[responsePick]],
                fields: [
                    { name: app.lang.get(interaction.userInfo.get("language"), "commands.8ball.question"), value: question },
                    { name: app.lang.get(interaction.userInfo.get("language"), "commands.8ball.answer"), value: responsePick }
                ],
                footer: { text: app.config.system.footerText }
            }]
        })
    }
}