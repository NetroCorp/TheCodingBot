module.exports = {
    name: "about",
    description: "Get info about me, ${app.client.user.tag}!",
    guildOnly: false,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["DEFAULT"],
    cooldown: 2,
    aliases: ["botinfo", "aboutme"],
    syntax: [],
    execute: async(app, message, args) => {
            app.functions.msgHandler(message, {
                    embeds: [{
                        title: app.config.system.emotes.information + ` All about your favorite bot, **${app.client.user.tag}**!`,
                        color: app.config.system.embedColors.blue,
                        thumbnail: { url: app.client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) }, 
                        fields: [
                        { name: "Bot Information", value: "** **" },
                        { name: "User Tag", value: `${app.client.user.tag}`, inline: true},
                        { name: "User ID", value: `${app.client.user.id}`, inline: true},
                        { name: "Bot Version", value: app.version.toFullString(), inline: true},
                        { name: "Bot Uptime", value: app.functions.TStoHR(app.client.uptime), inline: true},
                        { name: "Emote Count", value: `${Object.keys(app.config.system.emotes).length} total`, inline: true},
                        { name: "Embed Color Count", value: `${Object.keys(app.config.system.embedColors).length} total`, inline: true},
                        { name: "RPS Count", value: `${Object.keys(app.config.system.rotatingStatus.statuses).length} total`, inline: true},
                        { name: "Bot Memory Usage", value: (Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100) + " MiB", inline: true },
                        { name: "Servers I'm In", value: app.client.guilds.cache.size + " total", inline: true},
                        { name: "Host System Information", value: "** **" },
                        { name: "Node Version", value: `${process.version}`, inline: true },
                        { name: "Node Uptime", value: app.functions.TStoHR(process.uptime()* 1000), inline: true },
                        { name: "Node Execution Path", value: `${process.execPath}`, inline: true},
                        ]
                    }]
                });
            }
        }
        