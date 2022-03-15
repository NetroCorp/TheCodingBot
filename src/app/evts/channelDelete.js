module.exports = async(app, oldChannel) => {
    if (oldChannel.partial) await oldChannel.fetch().catch(err => {});

    if (oldChannel.guild == null) return; // Stop if we not in a guild? (Just safety)
    var guild = oldChannel.guild;

    var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: guild.id } });
    if (!serverSettings) return;

    var logChannelID = serverSettings.get("loggingGuildChannel");
    var logChannel = app.client.channels.cache.get(logChannelID);
    if (!logChannel) return; // Something's wrong here?

    var embed = {
        author: { name: `${guild.name} (${guild.id})`, icon_url: guild.iconURL({ format: 'png', dynamic: true, size: 1024 }) },
        title: `${app.types.channels[oldChannel.type] || "Unknown Channel Type"} deleted!`,
        color: app.config.system.embedColors.dark_blue,
        description: `There are now ${guild.channels.cache.size} channels.`,
        fields: [
            { name: "Name", value: oldChannel.name, inline: true },
            { name: "ID", value: oldChannel.id, inline: true },
            { name: "Deleted At", value: new Date().toString() }
        ]
    };

    const fetchedLogs = await guild.fetchAuditLogs({
        limit: 6,
        type: "CHANNEL_DELETE",
    }).catch(err => { app.logger.warn("DISCORD", "Cannot fetch audit log because " + err.message); });
    if (fetchedLogs) {
        //define channelLog
        const channelLog = fetchedLogs.entries.find(entry => // To avoid false positives, we look for a timeframe of when the channel was deleted.
            Date.now() - entry.createdTimestamp < 5000
        );
        if (channelLog) {
            const { executor } = channelLog;

            embed.fields.push({ name: "Deleted by", value: `${executor.tag} (${executor.id})` })
            embed["thumbnail"] = executor;
        };
    }; // May be missing permissions to fetch audit log.

    await app.functions.msgHandler(logChannel, { embeds: [embed] });
};