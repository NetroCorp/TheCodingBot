module.exports = async(app, newChannel) => {
    if (newChannel.partial) await newChannel.fetch().catch(err => {});

    if (newChannel.guild == null) return; // Stop if we not in a guild? (Just safety)
    var guild = newChannel.guild;

    var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: guild.id } });
    if (!serverSettings) return;

    var logChannelID = serverSettings.get("loggingGuildChannel");
    var logChannel = app.client.channels.cache.get(logChannelID);
    if (!logChannel) return; // Something's wrong here?

    var embed = {
        author: { name: `${guild.name} (${guild.id})`, icon_url: guild.iconURL({ format: 'png', dynamic: true, size: 1024 }) },
        title: `${app.types.channels[newChannel.type] || "Unknown Channel Type"} created!`,
        color: app.config.system.embedColors.green,
        description: `There are now ${guild.channels.cache.size} channels.`,
        fields: [
            { name: "Name", value: newChannel.name, inline: true },
            { name: "ID", value: newChannel.id, inline: true },
            { name: "Created At", value: new Date(newChannel.createdTimestamp).toString() }
        ],
        footer: { text: app.config.system.footerText }
    };

    const fetchedLogs = await guild.fetchAuditLogs({
        limit: 6,
        type: "CHANNEL_CREATE",
    }).catch(err => {});
    if (fetchedLogs) {

        //define channelLog
        const channelLog = fetchedLogs.entries.find(entry => // To avoid false positives, we look for a timeframe of when the role was created.
            Date.now() - entry.createdTimestamp < 10000
        );
        if (channelLog) {
            const { executor } = channelLog;

            embed.fields.push({ name: "Created by", value: `${executor.tag} (${executor.id})` })
        };
    }; // May be missing permissions to fetch audit log.

    logChannel.send({ embeds: [embed] });
};