module.exports = async(app, message) => {
    if (message.partial) await message.fetch().catch(() => { app.logger.warn("DISCORD", `[MESSAGE] Message with ID ${message.id} was not in cache when deleted. Cannot get details.`); return; });

    if (message.guild == null) // Stop if we not in a guild.
        return;
    else if (message.guild != null && message.author) // Or stop if we are in a guild and the author exists.
        if (message.author.bot) return; // - and stop if we getting data from a bot.

    var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: message.guild.id } });
    if (!serverSettings) return;

    var channelID = serverSettings.get("loggingMessageChannel");
    var channel = app.client.channels.cache.get(channelID);
    if (!channel) return; // Something's wrong here?

    var msgAttachments;
    if (message.attachments.size > 0) {
        msgAttachments = await app.functions.downloadAttachments(message, message.attachments);

        while (app.client.waitingForMessageToDelete.includes(message.id)) {
            await app.functions.sleep(1000);
        };
    };

    var embs = [{
        color: app.config.system.embedColors.orange,
        description: `Message ID: ${message.id} | [Message link](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`,
        fields: [
            { name: ((message.partial) ? "Warning!" : "Content"), value: ((message.partial) ? "***Message was sent before cached. The contents are lost.***" : message.content) || "** **" },
            { name: "Deleted In", value: `${message.channel.name} (${message.channel.id}) | <#${message.channel.id}>` }
        ],
        footer: { text: app.config.system.footerText }
    }];

    if (message.author) embs[0]["author"] = { name: `Message by ${message.author.tag} (${ message.author.id}) deleted.`, icon_url: message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) };


    if (message.attachments.size > 0) {
        embs[0].fields.push({
            name: "Attachments",
            value:
                ((msgAttachments.succeed.length > 0) ? `${msgAttachments.succeed.join("\n")}` : "") +
                ((msgAttachments.failed.length > 0) ? `**Failed (${msgAttachments.failed.length}):**\n ${msgAttachments.failed.join("\n ")}` : "")
        });
    };

    channel.send({
        embeds: embs
    }).catch(err => { app.logger.warn("DISCORD", `[MESSAGE] Message deleted but an error occurred when trying to send log! Error: ${err.message}`) });
}