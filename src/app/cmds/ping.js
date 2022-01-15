module.exports = {
    name: "ping",
    description: "Check bot latency!",
    category: "General",
    guildOnly: false,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["DEFAULT"],
    cooldown: 0,
    aliases: [""],
    syntax: [""],
    execute: async(app, message, args) => {
        app.functions.msgHandler(message, {
            embeds: [{
                color: app.config.system.embedColors.green,
                description: ":ping_pong: Pinging...",
                footer: { text: app.config.system.footerText }
            }]
        }, 0, true, (msg => {
            app.functions.msgHandler(msg, {
                embeds: [{
                    color: app.config.system.embedColors.green,
                    fields: [
                        { name: "Message Latency", value: ((msg.createdTimestamp - message.createdTimestamp) + "ms") },
                        { name: "Discord Latency", value: app.client.ws.ping + "ms" }
                    ],
                    footer: { text: app.config.system.footerText }
                }]
            }, 1, true)
        }));
    }
}