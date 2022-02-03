module.exports = {
    name: "purge",
    description: "Purge those spicy messages",
    guildOnly: true,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["MANAGE_MESSAGES"],
    cooldown: 5,
    aliases: ["prune"],
    syntax: [" <Count>"],
    execute: async(app, message, args) => {
        let msgcount = args.slice(" ")
        
        if (!isNaN(args[0])) {
            try {
                message.delete();
                await message.channel.messages.fetch({ limit: msgcount }).then(fetchedMsgs => {
                    const msgsPrune = fetchedMsgs.filter(msg => !msg.pinned);
                    return message.channel.bulkDelete(msgsPrune).then(prunedMsgs => {
                        app.functions.msgHandler(message, {
                            embeds: [{
                                title: `${app.config.system.emotes.success} Purge Successful!`,
                                color: app.config.system.embedColors.lime,
                                description: `Successfully purged ${prunedMsgs.size} spicy messages!`,
                                footer: { text: app.config.system.footerText + " | This message will blow up in 5 seconds."}
                            }]
                            }, 0, false, (msg => { setTimeout(() => msg.delete(), 5000) }));
                            });
            });
                } catch (e) {
                    app.functions.msgHandler(message, {
                        embeds: [{
                            title: `${app.config.system.emotes.error} Uh-Oh! Something went wrong!`,
                            color: app.config.system.embedColors.red,
                            description: `e.message`,
                            footer: { text: app.config.system.footerText + " | An error occurred."}
                        }]
                    });
            }
        } else {
            app.functions.msgHandler(message, {
            embeds: [{
                title: `${app.config.system.emotes.error} Purge Error`,
                color: app.config.system.embedColors.red,
                description: "You need to specify how many messages to delete!",
                footer: { text: app.config.system.footerText + " | An error occurred." }
            }]
            }, 0, true);
        }
    }
}
