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
            content: "** **", // This just makes it so when it says (edited) it don't look funny.
            embeds: [{
                title: app.config.system.emotes.wait + " **Latency Test**",
                color: app.config.system.embedColors.blue,
                fields: [
                    { name: "API", value: ":ping_pong: Pinging...", inline: true },
                    { name: "Messages", value: ":ping_pong: Pinging...", inline: true }
                ],
                footer: { text: app.config.system.footerText }
            }]
        }, 0, true, (msg => {
            app.functions.msgHandler(msg, {
                embeds: [{
                    title: app.config.system.emotes.information + " **Latency Test**",
                    color: app.config.system.embedColors.blue,
                    fields: [
                        { name: "API", value: app.client.ws.ping + "ms", inline: true },
                        { name: "Messages", value: ((msg.createdTimestamp - message.createdTimestamp) + "ms"), inline: true }
                    ],
                    footer: { text: app.config.system.footerText }
                }]
            }, 1, true)
        }));
    }
}