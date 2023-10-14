module.exports = async(app, ban) => {
    if (ban.partial) await ban.fetch().catch(err => {});

    if (ban.guild == null) return; // Stop if we not in a guild? (Just safety)
    var guild = ban.guild,
        user = ban.user;

    if (!guild || !user) return; // We MUST have the guild and user so we can get the correct data. (Just safety)

    var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: guild.id } });
    if (!serverSettings) return;

    var logChannelID = serverSettings.get("loggingMemberChannel");
    var logChannel = app.client.channels.cache.get(logChannelID);
    if (!logChannel) return; // Something's wrong here?

    var embed = {
        author: { name: `${guild.name} (${guild.id})`, icon_url: guild.iconURL({ format: 'png', dynamic: true, size: 1024 }) },
        title: ((user.bot) ? "Bot" : "User") + " Unbanned!",
        color: app.config.system.embedColors.lime,
        fields: [
            { name: "Full Tag", value: app.functions.pomeloHandler(user), inline: true },
            { name: "ID", value: user.id, inline: true },
            { name: "Unbanned at", value: new Date().toString() }
        ]
    };

    const fetchedLogs = await guild.fetchAuditLogs({
        limit: 6,
        type: "MEMBER_BAN_REMOVE",
    }).catch(err => {});
    if (fetchedLogs) {

        //define banLog
        const banLog = fetchedLogs.entries.find(entry => { // To avoid false positives, we look for a timeframe of when the ban was created, and if the user banned is the correct entry.
            Date.now() - entry.createdTimestamp < 5000
        });
        if (banLog) {
            const { executor } = banLog;

            embed.fields.push({ name: "Unbanned by", value: `${app.functions.pomeloHandler(executor)} (${executor.id})` });

            if (banLog.reason)
                embed.fields.push({ name: "Reason", value: banLog.reason });
            embed["thumbnail"] = executor;
        };
    }; // May be missing permissions to fetch audit log.

    await app.functions.msgHandler(logChannel, { embeds: [embed] });
};