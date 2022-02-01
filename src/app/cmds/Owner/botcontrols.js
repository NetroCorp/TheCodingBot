module.exports = {
    name: "botcontrols",
    description: "Bot Control.",
    guildOnly: false,
    authorizedGuilds: [],
    hidden: true,
    permissions: ["BOT_OWNER"],
    cooldown: 0,
    aliases: ["bc"],
    syntax: [" <restart/shutdown>"],
    execute: async(app, message, args) => {

        function srHandle(message, type) {
            const { MessageActionRow, MessageButton } = app.modules["discord.js"];
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId('agree')
                    .setLabel(`Yes, ${type.toLowerCase()} now`)
                    .setStyle('SUCCESS'),
                    new MessageButton()
                    .setCustomId('disagree')
                    .setLabel('Nevermind')
                    .setStyle('DANGER')
                );

            app.functions.msgHandler(message, {
                embeds: [{
                    title: `${app.config.system.emotes.warning} **${type}**`,
                    color: app.config.system.embedColors.yellow,
                    fields: [
                        { name: `Are you sure you wish for me to ${type}?`, value: `To confirm, use the buttons.${((type == "Restart") ? "\n*This will not reload the main bot file.*" : "")}` }
                    ],
                    footer: { text: app.config.system.footerText }
                }],
                components: [row]
            }, 0, true, (msg => {
                const filter = i => ["agree", "disagree"].includes(i.customId) && i.user.id === message.author.id;
                const collector = message.channel.createMessageComponentCollector({ filter, max: 1, time: 90000 });

                collector.on('collect', async i => {
                    if (i.customId === 'agree') {
                        app.config.system.commandState = type;
                        var actionDoing = ((type == "Shutdown") ? "Shutting down" : "Restarting");
                        app.functions.msgHandler(msg, {
                            embeds: [{
                                title: `${app.config.system.emotes.wait} **${actionDoing}**`,
                                color: app.config.system.embedColors.blue,
                                description: `I'm ${((type == "Shutdown") ? "shutting down and will be gone in a moment." : "restarting! Be back soon!")}`,
                                footer: { text: app.config.system.footerText }
                            }],
                            components: []
                        }, 1, true, (async() => {
                            app.logger.debug("SYS", `${app.name} ${actionDoing.toLowerCase()} as of ${new Date()}.`);
                            if (type == "Restart") {
                                await process.exitHandler({ app: app, cleanup: true, exit: false }, 0);

                                await app.functions.clearCache();
                                await app.botStart(msg.channel.id + "-" + msg.id);
                            } else { process.exitHandler({ app: app, cleanup: true, exit: true }, 0); };
                        }));
                        denied = false, buttonStuffWaiting = false;

                    } else if (i.customId === 'disagree') {
                        await i.update({
                            embeds: [{
                                title: `${app.config.system.emotes.error} **${type}**`,
                                color: app.config.system.embedColors.red,
                                description: "Operation cancelled.",
                                footer: { text: app.config.system.footerText }
                            }],
                            components: []
                        });

                        buttonStuffWaiting = false;
                    };
                });

                collector.on('end', async(collected) => {
                    if (collected.size < 1) {
                        app.functions.msgHandler(msg, {
                            embeds: [{
                                title: `${app.config.system.emotes.error} **${type}**`,
                                color: app.config.system.embedColors.red,
                                description: "Operation timed out.",
                                footer: { text: app.config.system.footerText }
                            }],
                            components: []
                        }, 1, true);
                    };
                    buttonStuffWaiting = false;
                });
            }));
        };

        var action = args[0];
        if (!action) return app.functions.msgHandler(message, { content: "Improper syntax used!" }, 0, true);

        switch (action) {
            case "shutdown":
                srHandle(message, "Shutdown");
                break;
            case "restart":
                srHandle(message, "Restart");
                break;
            default:
                app.functions.msgHandler(message, { content: "I do not know what you want me to do!" }, 0, true);
                break;
        }

    }
}