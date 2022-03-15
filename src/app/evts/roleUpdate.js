module.exports = async(app, oldRole, newRole) => {
    if (oldRole.partial) await oldRole.fetch().catch(err => {});
    if (newRole.partial) await newRole.fetch().catch(err => {});

    if (oldRole == newRole) return; // how does this even work

    if (oldRole.guild == null) return; // Stop if we not in a guild? (Just safety)
    var guild = oldRole.guild;

    var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: guild.id } });
    if (!serverSettings) return;

    var logChannelID = serverSettings.get("loggingGuildChannel");
    var logChannel = app.client.channels.cache.get(logChannelID);
    if (!logChannel) return; // Something's wrong here?

    var embed = {
        author: { name: `${guild.name} (${guild.id})`, icon_url: guild.iconURL({ format: 'png', dynamic: true, size: 1024 }) },
        title: "Role updated!",
        color: app.config.system.embedColors.yellow,
        fields: []
    };

    if (oldRole.name !== newRole.name) // Check role name
        embed.fields.push({ name: "Name", value: oldRole.name + " -> " + newRole.name, inline: true });
    else
        embed.fields.push({ name: "Name", value: oldRole.name, inline: true });
    embed.fields.push({ name: "ID", value: oldRole.id, inline: true });

    if (oldRole.icon != newRole.icon) // Check role icon
        embed.fields.push({ name: "Icon", value: oldRole.icon + " -> " + newRole.icon });

    if (oldRole.unicodeEmoji != newRole.unicodeEmoji) // Check role emoji
        embed.fields.push({ name: "Unicode Emoji", value: oldRole.unicodeEmoji + " -> " + newRole.unicodeEmoji });

    if (oldRole.color != newRole.color) // Check role color
        embed.fields.push({ name: "Color", value: oldRole.color + " -> " + newRole.color });

    if (oldRole.hoist != newRole.hoist) // Check role is hoisted
        embed.fields.push({ name: "Hoisted", value: oldRole.hoist + " -> " + newRole.hoist });

    if (oldRole.rawPosition != newRole.rawPosition) // Check role position
        embed.fields.push({ name: "Position", value: oldRole.rawPosition + " -> " + newRole.rawPosition });

    if (oldRole.permissions !== newRole.permissions) { // Check role permissions
        const oldPerms = oldRole.permissions.serialize(),
            newPerms = newRole.permissions.serialize(),
            permUpdated = [];

        for (const [key, element] of Object.entries(oldPerms)) {
            if (newPerms[key] !== element) permUpdated.push(`\`${key}\``);
        }
        if (oldRole.permissions > newRole.permissions) embed.fields.push({ name: "Permissions Removed", value: permUpdated.join(", ") }); // rip permissions
        else if (oldRole.permissions < newRole.permissions) embed.fields.push({ name: "Permissions Added", value: permUpdated.join(", ") }); // ooo permissions
    };

    if (oldRole.mentionable != newRole.mentionable) // Check role is mentionable
        embed.fields.push({ name: "Mentionable", value: oldRole.mentionable + " -> " + newRole.mentionable });

    embed.fields.push({ name: "Updated At", value: new Date().toString() })

    const fetchedLogs = await guild.fetchAuditLogs({
        limit: 6,
        type: "ROLE_UPDATE",
    }).catch(err => {});
    if (fetchedLogs) {

        //define roleLog
        const roleLog = fetchedLogs.entries.find(entry => // To avoid false positives, we look for a timeframe of when the role was updated.
            Date.now() - entry.createdTimestamp < 5000
        );
        if (roleLog) {
            const { executor } = roleLog;

            embed.fields.push({ name: "Updated by", value: `${executor.tag} (${executor.id})` })
            embed["thumbnail"] = executor;
        };
    }; // May be missing permissions to fetch audit log.

    await app.functions.msgHandler(logChannel, { embeds: [embed] });
};