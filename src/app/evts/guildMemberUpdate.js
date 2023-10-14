module.exports = async(app, oldMember, newMember) => {
    if (oldMember.partial) await oldMember.fetch().catch(err => {});
    if (newMember.partial) await newMember.fetch().catch(err => {});

    if (oldMember == newMember) return; // how does this even work

    if (oldMember.guild == null) return; // Stop if we not in a guild? (Just safety)
    var guild = oldMember.guild;

    var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: guild.id } });
    if (!serverSettings) return;

    var logChannelID = serverSettings.get("loggingMemberChannel");
    var logChannel = app.client.channels.cache.get(logChannelID);
    if (!logChannel) return; // Something's wrong here?

    var embed = {
        author: { name: `${guild.name} (${guild.id})`, icon_url: guild.iconURL({ format: 'png', dynamic: true, size: 1024 }) },
        title: `${(oldMember.user.bot) ? "Bot" : "User"} updated!`,
        color: app.config.system.embedColors.yellow,
        fields: []
    };


    embed.fields.push({ name: "User", value: app.functions.pomeloHandler(oldMember.user), inline: true });
    embed.fields.push({ name: "ID", value: oldMember.user.id, inline: true });

    if (oldMember.nickname != newMember.nickname) // Check member nickname
        embed.fields.push({ name: "Nickname", value: oldMember.nickname + " -> " + newMember.nickname });

    // This doesn't seem to fire correctly, so it's disabled until probably D.JSv14 when I can get server banners/avatars to work.
    // if (oldMember.avatar != newMember.avatar) // Check member avatar
    //     embed.fields.push({ name: "Avatar", value: oldMember.avatar + " -> " + newMember.avatar, inline: true });

    // if (oldMember.banner != newMember.banner) // Check member banner
    //     embed.fields.push({ name: "Banner", value: oldMember.banner + " -> " + newMember.banner, inline: true });

    if (oldMember.roles.cache.size != newMember.roles.cache.size) { // Check member roles
        var roleUpdated = app.functions.arrayDifference(oldMember.roles.cache.filter(r => r.id != guild.id).map(rF => rF.name), newMember.roles.cache.filter(r => r.id != guild.id).map(rF => rF.name))
        for (var i = 0; i < roleUpdated.length; i++) roleUpdated[i] = "`" + roleUpdated[i] + "`";
        if (oldMember.roles.cache.size > newMember.roles.cache.size) embed.fields.push({ name: "Roles Removed", value: roleUpdated.join(", ") || "Failed to get roles removed" }); // rip features
        else if (oldMember.roles.cache.size < newMember.roles.cache.size) embed.fields.push({ name: "Roles Added", value: roleUpdated.join(", ") || "Failed to get roles added" }); // ooo features
    };

    if (embed.fields.length < 3) return; // Since we aren't subscribing to all updates, stop here if it was something else non-related to what we have.

    embed.fields.push({ name: "Updated At", value: new Date().toString() })

    const fetchedLogs = await guild.fetchAuditLogs({
        limit: 6,
    }).catch(err => {});
    if (fetchedLogs) {

        //define memberLog
        const memberLog = fetchedLogs.entries.filter(e => e.action === "MEMBER_UPDATE" || e.action === "MEMBER_ROLE_UPDATE").find(entry => // To avoid false positives, we look for a timeframe of when the member was updated.
            Date.now() - entry.createdTimestamp < 5000
        );
        if (memberLog) {
            const { executor } = memberLog;

            if (executor.id != oldMember.user.id)
                embed.fields.push({ name: "Updated by", value: `${app.functions.pomeloHandler(executor)} (${executor.id})` })
            embed["thumbnail"] = executor;
        };
    }; // May be missing permissions to fetch audit log.

    await app.functions.msgHandler(logChannel, { embeds: [embed] });
};