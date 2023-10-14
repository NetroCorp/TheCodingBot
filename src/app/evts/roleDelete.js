module.exports = async(app, oldRole) => {
    if (oldRole.partial) await oldRole.fetch().catch(err => {});

    if (oldRole.guild == null) return; // Stop if we not in a guild? (Just safety)
    var guild = oldRole.guild;

    var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: guild.id } });
    if (!serverSettings) return;

    var logChannelID = serverSettings.get("loggingGuildChannel");
    var logChannel = app.client.channels.cache.get(logChannelID);
    if (!logChannel) return; // Something's wrong here?

    var embed = {
        author: { name: `${guild.name} (${guild.id})`, icon_url: guild.iconURL({ format: 'png', dynamic: true, size: 1024 }) },
        title: "Role deleted!",
        color: app.config.system.embedColors.dark_blue,
        description: `There are now ${guild.roles.cache.size} roles.`,
        fields: [
            { name: "Name", value: oldRole.name, inline: true },
            { name: "ID", value: oldRole.id, inline: true },
            { name: "Deleted At", value: new Date().toString() }
        ]
    };

    const fetchedLogs = await guild.fetchAuditLogs({
        limit: 6,
        type: "ROLE_DELETE",
    }).catch(err => {});
    if (fetchedLogs) {

        //define roleLog
        const roleLog = fetchedLogs.entries.find(entry => // To avoid false positives, we look for a timeframe of when the role was deleted.
            Date.now() - entry.createdTimestamp < 5000
        );
        if (roleLog) {
            const { executor } = roleLog;

            embed.fields.push({ name: "Deleted by", value: `${app.functions.pomeloHandler(executor)} (${executor.id})` })
            embed["thumbnail"] = executor;
        };
    }; // May be missing permissions to fetch audit log.

    await app.functions.msgHandler(logChannel, { embeds: [embed] });
};