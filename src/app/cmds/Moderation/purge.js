module.exports = {
    name: "purge",
    description: "Purge those spicy messages",
    category: "Moderation",
    guildOnly: false,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["MANAGE_MESSAGES"],
    cooldown: 2,
    aliases: ["prune"],
    syntax: [" <Message Count>"],
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
                                title: `${app.config.system.emotes.success} Purge Successfull`,
                                color: app.config.system.embedColors.lime,
                                description: `Successfully purged ${prunedMsgs.size} messages!`,
                                footer: { text: app.config.system.footerText }
                            }]
                            }, 0, true);
                });
            });
                } catch (e) {
                    
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
