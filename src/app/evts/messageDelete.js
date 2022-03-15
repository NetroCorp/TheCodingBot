module.exports = async(app, message) => {
    if (message.partial) await message.fetch(true, true).catch(() => { app.logger.warn("DISCORD", `[MESSAGE] Message with ID ${message.id} was not in cache when deleted. Cannot get details.`); return; });

    if (message.guild == null) // Stop if we not in a guild.
        return;
    else if (message.guild != null && message.author) // Or stop if we are in a guild and the author exists.
        if (message.author.bot) return; // - and stop if we getting data from a bot.

    var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: message.guild.id } });
    if (!serverSettings) return;

    var logChannelID = serverSettings.get("loggingMessageChannel");
    var logChannel = app.client.channels.cache.get(logChannelID);
    if (!logChannel) return; // Something's wrong here?

    var msgAttachments;
    if (message.attachments.size > 0) {
        msgAttachments = await app.functions.downloadAttachments(message, message.attachments);

        while (app.client.waitingForMessageToDelete.includes(message.id)) {
            await app.functions.sleep(1000);
        };
    };

    var embs = {
        color: app.config.system.embedColors.orange,
        description: `Message ID: ${message.id} | [Message link](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`,
        fields: [
            { name: ((message.partial) ? "Warning!" : "Content"), value: ((message.partial) ? "***Message was sent before cached. The contents are lost.***" : message.content) || "** **" },
            { name: "Deleted In", value: `${message.channel.name} (${message.channel.id}) | <#${message.channel.id}>` }
        ]
    };

    if (message.author) embs["author"] = { name: `Message by ${message.author.tag} (${ message.author.id}) deleted.`, icon_url: message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) };
    const fetchedLogs = await message.guild.fetchAuditLogs({
        limit: 6,
        type: "MESSAGE_DELETE",
    }).catch(err => {});
    if (fetchedLogs) {
        const deleteLog = fetchedLogs.entries.find(entry => // To avoid false positives, we sort by message author, message channel, and a timeframe of when the message was deleted.
            ((message.author) ? entry.executor.id !== message.author.id : true) &&
            entry.extra.channel.id === message.channel.id &&
            Date.now() - entry.createdTimestamp < 5000
        );
        if (deleteLog) { // If none, we may be missing permissions to fetch audit log.
            const { executor } = deleteLog;
            embs.fields.push({ name: "Deleted by", value: (executor) ? `${executor.tag} (${executor.id})` : "Unknown" });
            embs["thumbnail"] = executor;

        };
    }; // May be missing permissions to fetch audit log.


    if (message.attachments.size > 0) {
        embs.fields.push({
            name: "Attachments",
            value:
                ((msgAttachments.succeed.length > 0) ? `${msgAttachments.succeed.join("\n")}` : "") +
                ((msgAttachments.failed.length > 0) ? `**Failed (${msgAttachments.failed.length}):**\n ${msgAttachments.failed.join("\n ")}` : "")
        });
    };

    await app.functions.msgHandler(logChannel, {
        embeds: [embs]
    });
}