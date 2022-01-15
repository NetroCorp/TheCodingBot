module.exports = { 
    name: "ping",
    description: "Check bot latency!",
    category: "General",
    guildOnly: false,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["DEFAULT"],
    cooldown: 0,
    aliases: [],
    syntax: [" <JSCode>"],
    execute: async(app, message, args) => {
        var ping = app.client.ws.ping
            message.channel.send({
                embeds: [{
                    color: app.config.system.embedColors.green,
                    fields: [
                        { name: ":ping_pong: Ping? Ping pong!", value: "\n" + ping + " ms." }
                    ],
                    footer: { text: app.config.system.footerText }
                }]
            });
        }}