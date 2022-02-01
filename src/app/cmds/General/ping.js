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
    execute: async(app, message, args) => {
        app.functions.msgHandler(message, `${app.config.system.emotes.wait} :ping_pong: **Pinging...**`, 0, true, (msg => {
            app.functions.msgHandler(msg, {
                content: "** **",
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