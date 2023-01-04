module.exports = {
    name: "about",
    description: `Get info about me!`,
    guildOnly: false,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["DEFAULT"],
    cooldown: 2,
    aliases: ["botinfo", "aboutme"],
    syntax: [],
    execute: async(app, message, args, userSettings) => {
        const os = app.modules["os"]; // Welcome to os(u)~!
        return app.functions.msgHandler(message, {
            embeds: [{
                title: `${app.config.system.emotes.information} ${app.lang.getLine(userSettings.get("language"), "All about your favorite bot")}, **${app.client.user.tag}**!`,
                color: app.config.system.embedColors.blue,
                thumbnail: { url: app.client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) },
                fields: [
                    { name: app.lang.getLine(userSettings.get("language"), "Bot Information"), value: "** **" },
                    { name: app.lang.getLine(userSettings.get("language"), "User Tag"), value: `${app.client.user.tag}`, inline: true },
                    { name: app.lang.getLine(userSettings.get("language"), "User ID"), value: `${app.client.user.id}`, inline: true },
                    { name: app.lang.getLine(userSettings.get("language"), "Bot Version"), value: app.version.toFullString(), inline: true },
                    { name: app.lang.getLine(userSettings.get("language"), "Bot Uptime"), value: app.functions.TStoHR(app.client.uptime), inline: true },
                    { name: app.lang.getLine(userSettings.get("language"), "Emote Count"), value: `${Object.keys(app.config.system.emotes).length} total`, inline: true },
                    { name: app.lang.getLine(userSettings.get("language"), "Embed Color Count"), value: `${Object.keys(app.config.system.embedColors).length} total`, inline: true },
                    { name: app.lang.getLine(userSettings.get("language"), "RPS Count"), value: `${Object.keys(app.config.system.rotatingStatus.statuses).length} total`, inline: true },
                    { name: app.lang.getLine(userSettings.get("language"), "Bot Memory Usage"), value: (Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100) + " MiB", inline: true },
                    { name: app.lang.getLine(userSettings.get("language"), "Servers I'm In"), value: app.client.guilds.cache.size + " total", inline: true },
                    { name: app.lang.getLine(userSettings.get("language"), "Host System Information"), value: "** **" },
                    { name: app.lang.getLine(userSettings.get("language"), "NodeJS Version"), value: `${process.version}`, inline: true },
                    { name: app.lang.getLine(userSettings.get("language"), "NodeJS Uptime"), value: app.functions.TStoHR(process.uptime() * 1000), inline: true },
                    { name: app.lang.getLine(userSettings.get("language"), "NodeJS Execution Path"), value: `${process.execPath}`, inline: true },
                    { name: app.lang.getLine(userSettings.get("language"), "Process PID"), value: `${process.pid}`, inline: true },
                    { name: app.lang.getLine(userSettings.get("language"), "System Platform"), value: `${process.platform}`, inline: true },
                    { name: app.lang.getLine(userSettings.get("language"), ((process.platform == "linux") ? "Kernel Version" : "System Version")), value: os.version(), inline: true }
                    // I'd like to have this show the current CPU usage, I'm open to ideas on how to get it to work. - IDeletedSystem64
                ]
            }]
        });
    }
}