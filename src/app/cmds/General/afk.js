module.exports = {
    name: "afk",
    description: "See ya next time!",
    guildOnly: false,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["DEFAULT"],
    cooldown: 10,
    aliases: [],
    syntax: [],
    execute: async(app, message, args, userSettings) => {
        if (!userSettings) return app.functions.msgHandler(message, { embeds: [{ color: app.config.system.embedColors.red, description: `${app.config.system.emotes.error} **Could not set to AFK due to missing User Settings.**` }] })

        var reason = args.slice(0).join(" ") || "";
        var AFKSettings = {
            "timestamp": new Date().getTime(),
            "reason": reason,
            "mentions": 0
        };

        const affectedRows = await app.DBs.userSettings.update({ AFKSettings: JSON.stringify(AFKSettings, null, "\t") }, { where: { userID: message.author.id } });
        if (affectedRows.length > 0) {
            await app.functions.msgHandler(message, {
                embeds: [{
                    title: `${app.config.system.emotes.success} ${app.lang.getLine(userSettings.get("language"), "You're now AFK")}${((reason != "" ? ": " + reason: "!"))}`,
                    color: app.config.system.embedColors.lime
                }],
                author: message.author
            }, 0, true, (async msg => {
                setTimeout(function() { msg.delete() }, 6000);
            }));
        } else {
            return app.functions.msgHandler(message, { embeds: [{ color: app.config.system.embedColors.red, description: `${app.config.system.emotes.error} **${app.lang.getLine(userSettings.get("language"), "Could not set to AFK due to Database Error!")}**` }] })
        };
    }
};