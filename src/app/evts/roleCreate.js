module.exports = async(app, newRole) => {
    if (newRole.partial) await newRole.fetch().catch(err => {});

    if (newRole.guild == null) return; // Stop if we not in a guild? (Just safety)
    var guild = newRole.guild;

    var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: guild.id } });
    if (!serverSettings) return;

    var logChannelID = serverSettings.get("loggingGuildChannel");
    var logChannel = app.client.channels.cache.get(logChannelID);
    if (!logChannel) return; // Something's wrong here?

    var embed = {
        author: { name: `${guild.name} (${guild.id})`, icon_url: guild.iconURL({ format: 'png', dynamic: true, size: 1024 }) },
        title: "Role created!",
        color: app.config.system.embedColors.green,
        description: `There are now ${guild.roles.cache.size} roles.`,
        fields: [
            { name: "Name", value: newRole.name, inline: true },
            { name: "ID", value: newRole.id, inline: true },
            { name: "Created At", value: new Date(newRole.createdTimestamp).toString() }
        ]
    };

    if (newRole.managed)
        embed["fields"].push({ name: "Managed", value: "This role was created and is managed by an application." });

    const fetchedLogs = await guild.fetchAuditLogs({
        limit: 6,
        type: "ROLE_CREATE",
    }).catch(err => {});
    if (fetchedLogs) {

        //define roleLog
        const roleLog = fetchedLogs.entries.find(entry => // To avoid false positives, we look for a timeframe of when the role was created.
            Date.now() - entry.createdTimestamp < 5000
        );
        if (roleLog) {
            const { executor } = roleLog;

            embed.fields.push({ name: "Created by", value: `${executor.tag} (${executor.id})` })
            embed["thumbnail"] = executor;
        };
    }; // May be missing permissions to fetch audit log.

    await app.functions.msgHandler(logChannel, { embeds: [embed] });
};