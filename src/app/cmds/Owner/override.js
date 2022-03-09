module.exports = {
    name: "override",
    description: "Override permission system.",
    guildOnly: false,
    authorizedGuilds: [],
    hidden: true,
    permissions: ["BOT_OWNER"],
    cooldown: 0,
    aliases: ["bypass"],
    syntax: [" <enable/disable>"],
    execute: async(app, message, args) => {
        if (!args[0]) return app.functions.msgHandler(message, (
            (app.client.bypassEnabled) ?
            `${app.config.system.emotes.success} **Bypass is enabled!**` :
            `${app.config.system.emotes.error} **Bypass is disabled!**`));

        else if (args[0] == "enable" || args[0] == "disable") {
            app.client.bypassEnabled = (args[0] == "enable");
            message.react(app.config.system.emotes.success);
        };
    }
};