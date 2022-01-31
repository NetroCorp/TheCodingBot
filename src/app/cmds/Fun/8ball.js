module.exports = {
    name: "8ball",
    description: "The magic 8ball will answer *the* question.",
    category: "Fun",
    guildOnly: false,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["DEFAULT"],
    cooldown: 2,
    aliases: [""],
    syntax: [" <Question>"],
    execute: async(app, message, args) => {
        let question = args.slice(0).join(" ");

        if (!question) return app.functions.msgHandler(message, {
            embeds: [{
                title: `${app.config.system.emotes.error} Error`,
                color: app.config.system.embedColors.red,
                description: "You need to ask a question!",
                footer: { text: app.config.system.footerText + " | An error occurred." }
            }]
        });

        var responses = {
            "Yes!": "lime",
            "For sure": "lime",
            "Reach for the stars!": "lime",
            "Definitely!": "lime",
            "No.": "red",
            "Don't even think about it.": "red",
            "Why would you do that!?": "red",
            "Don't.": "red",
            "I actually don't know..": "purple",
            "Let me think about it": "purple",
            "Uhh...": "purple",
            "Just like the future, I'm uncertain on what to answer.": "purple"
        }
        var responsePick = Object.keys(responses)[Math.floor(Math.random() * Object.keys(responses).length)];

        app.functions.msgHandler(message, {
            embeds: [{
                title: ":8ball: 8Ball",
                color: app.config.system.embedColors[responses[responsePick]],
                description: "Some magic, please!",
                fields: [
                    { name: "Question", value: question },
                    { name: "Answer", value: responsePick }
                ],
                footer: { text: app.config.system.footerText }
            }]
        });
    }
};
