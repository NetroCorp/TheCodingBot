module.exports = {
    name: "ping",
    description: "Check bot latency!",
    guildOnly: false,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["DEFAULT"],
    cooldown: 2,
    aliases: [],
    syntax: [],
    execute: async(app, message, args, userSettings) => {
        app.functions.msgHandler(message, `${app.config.system.emotes.wait} :ping_pong: **${app.lang.getLine(userSettings.get("language"), "Pinging...")}**`, 0, true, (msg => {
            app.functions.msgHandler(msg, {
                content: "** **",
                embeds: [{
                    title: `${app.config.system.emotes.information} **${app.lang.getLine(userSettings.get("language"), "Latency Test")}** `,
                    color: app.config.system.embedColors.blue,
                    fields: [
                        { name: app.lang.getLine(userSettings.get("language"), "API"), value: app.client.ws.ping + "ms", inline: true },
                        { name: app.lang.getLine(userSettings.get("language"), "Messages"), value: ((msg.createdTimestamp - message.createdTimestamp) + "ms"), inline: true }
                    ]
                }]
            }, 1, true)
        }));
    }
}