module.exports = async(app, oldChannel, newChannel) => {
    if (oldChannel.partial) await oldChannel.fetch().catch(err => {});
    if (newChannel.partial) await newChannel.fetch().catch(err => {});

    if (oldChannel == newChannel) return; // how does this even work

    if (oldChannel.guild == null) return; // Stop if we not in a guild? (Just safety)
    var guild = oldChannel.guild;

    var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: guild.id } });
    if (!serverSettings) return;

    var logChannelID = serverSettings.get("loggingGuildChannel");
    var logChannel = app.client.channels.cache.get(logChannelID);
    if (!logChannel) return; // Something's wrong here?

    var embed = {
        author: { name: `${guild.name} (${guild.id})`, icon_url: guild.iconURL({ format: 'png', dynamic: true, size: 1024 }) },
        title: `${app.types.channels[oldChannel.type] || "Unknown Channel Type"} updated!`,
        color: app.config.system.embedColors.yellow,
        fields: []
    };

    if (oldChannel.name !== newChannel.name) // Check channel name
        embed.fields.push({ name: "Name", value: oldChannel.name + " -> " + newChannel.name, inline: true });
    else
        embed.fields.push({ name: "Name", value: oldChannel.name, inline: true });
    embed.fields.push({ name: "ID", value: oldChannel.id, inline: true });

    if (oldChannel.topic != newChannel.topic) // Check channel topic 
        embed.fields.push({ name: "Topic", value: oldChannel.topic + " -> " + newChannel.topic });

    if (oldChannel.parentId != newChannel.parentId) // Check channel emoji
        embed.fields.push({ name: "Category", value: oldChannel.parentId + " -> " + newChannel.parentId });

    if (oldChannel.nsfw != newChannel.nsfw) // Check channel is nsfw
        embed.fields.push({ name: "NSFW", value: oldChannel.nsfw + " -> " + newChannel.nsfw });

    if (oldChannel.rawPosition != newChannel.rawPosition) // Check channel position
        embed.fields.push({ name: "Position", value: oldChannel.rawPosition + " -> " + newChannel.rawPosition });

    embed.fields.push({ name: "Updated At", value: new Date().toString() })

    const fetchedLogs = await guild.fetchAuditLogs({
        limit: 6,
        type: "CHANNEL_UPDATE",
    }).catch(err => {});
    if (fetchedLogs) {

        //define channelLog
        const channelLog = fetchedLogs.entries.find(entry => // To avoid false positives, we look for a timeframe of when the channel was updated.
            Date.now() - entry.createdTimestamp < 20000
        );
        if (channelLog) {
            const { executor } = channelLog;

            embed.fields.push({ name: "Updated by", value: `${executor.tag} (${executor.id})` })
            embed["thumbnail"] = executor;
        };
    }; // May be missing permissions to fetch audit log.

    await app.functions.msgHandler(logChannel, { embeds: [embed] });
};