module.exports = {
    name: "nsfw",
    description: "mmm the nice command ;)",
    guildOnly: false,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["DEFAULT"],
    cooldown: 2,
    aliases: [],
    syntax: [],
    execute: async(app, message, args) => {
        if (!message.channel.nsfw) {
            return app.functions.msgHandler(message, {
                files: [process.cwd() + "/app/imgs/bonk.gif"],
                embeds: [{
                    title: `${app.config.system.emotes.information} BONK!`,
                    color: app.config.system.embedColors.blue,
                    image: { url: "attachment://bonk.gif" },
                    footer: { text: app.config.system.footerText }
                }]
            }, 0, true);
        } else {
            return app.functions.msgHandler(message, {
                embeds: [{
                    title: `${app.config.system.emotes.error} NSFW`,
                    color: app.config.system.embedColors.red,
                    description: "We're sorry, but NSFW is still being worked on.\n***TIP:** Try running outside a NSFW channel.*",
                    footer: { text: app.config.system.footerText }
                }]
            }, 0, true);
        };
    }
};