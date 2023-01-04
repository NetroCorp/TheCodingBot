module.exports = {
    name: "8ball",
    description: "The magic 8ball will answer *the* question.",
    guildOnly: false,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["DEFAULT"],
    cooldown: 2,
    aliases: [],
    syntax: [" <Question>"],
    execute: async(app, message, args, userSettings) => {
        let question = args.slice(0).join(" ");

        if (!question) return app.functions.msgHandler(message, {
            embeds: [{
                title: `${app.config.system.emotes.error} ${app.lang.getLine(userSettings.get("language"), "Error")}`,
                color: app.config.system.embedColors.red,
                description: "You need to ask a question!"
            }]
        }, 0, true);

        var responses = app.lang.getLine(userSettings.get("language"), "8ballResponse");
        var responsePick = Object.keys(responses)[Math.floor(Math.random() * Object.keys(responses).length)];

        app.functions.msgHandler(message, {
            embeds: [{
                title: ":8ball: 8Ball",
                color: app.config.system.embedColors[responses[responsePick]],
                description: app.lang.getLine(userSettings.get("language"), "Some magic, please!"),
                fields: [
                    { name: app.lang.getLine(userSettings.get("language"), "Question"), value: question },
                    { name: app.lang.getLine(userSettings.get("language"), "Answer"), value: responsePick }
                ]
            }]
        }, 0, true);
    }
};