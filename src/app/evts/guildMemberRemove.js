module.exports = async(app, oldMember) => {
    if (oldMember.partial) await oldMember.fetch().catch(err => {});

    if (oldMember.guild == null) return; // Stop if we not in a guild? (Just safety)
    var guild = oldMember.guild;

    var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: guild.id } });
    if (!serverSettings) return;

    var logChannelID = serverSettings.get("loggingMemberChannel");
    var logChannel = app.client.channels.cache.get(logChannelID);
    if (!logChannel) return; // Something's wrong here?

    var logMemberLeave = async() => {
        // -- LOG THAT USER LEFT

        var embed = {
            author: { name: `${guild.name} (${guild.id})`, icon_url: guild.iconURL({ format: 'png', dynamic: true, size: 1024 }) },
            title: `${(oldMember.user.bot) ? "Bot Removed" : "User Left"}`,
            color: app.config.system.embedColors.dark_blue,
            description: `There are now ${guild.members.cache.size} members.`,
            fields: [
                { name: "Full Tag", value: oldMember.user.tag, inline: true },
                { name: "ID", value: oldMember.user.id, inline: true },
                { name: "Joined", value: new Date(oldMember.joinedTimestamp).toString() }
            ],
            thumbnail: oldMember.user
        };

        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 6,
            type: "MEMBER_KICK",
        }).catch(err => {});
        if (fetchedLogs) {

            //define kickLog
            const kickLog = fetchedLogs.entries.find(entry => { // To avoid false positives, we look for a timeframe of when the ban was created, and if the user banned is the correct entry.
                Date.now() - entry.createdTimestamp < 5000
            });
            if (kickLog) {
                const { executor } = kickLog;

                embed.fields.push({ name: "Kicked by", value: `${executor.tag} (${executor.id})` });
                if (kickLog.reason)
                    embed.fields.push({ name: "Reason", value: kickLog.reason });
            };
        }; // May be missing permissions to fetch audit log.

        await app.functions.msgHandler(logChannel, { embeds: [embed] });
    };

    var announceMemberLeave = async() => {
        // -- GENERATE MEMBER LEAVE MESSAGES

        var otherSettings = serverSettings.get("other");
        if (!otherSettings) return;
        try { otherSettings = JSON.parse(otherSettings); } catch (Ex) { return; };

        leaveSettings = otherSettings["leave"];
        if (!leaveSettings) return;

        var announceChannelID = leaveSettings["channel"];
        var announceMessageTemplate = leaveSettings["msg"];
        var announceChannel = app.client.channels.cache.get(announceChannelID);
        if (!announceChannel || !announceMessageTemplate) return; // Something's wrong here?

        var announceMessage = null,
            placeholders = announceMessageTemplate.match(/%\w+%/g) || null;
        var safePlaceholders = app.functions.getTypes.replaceWith("leave");
        if (placeholders.length > 0) {
            for (var i = 0; i < placeholders.length; i++) {
                if (Object.keys(safePlaceholders).includes(placeholders[i])) {
                    // -- WARNING :: THIS IS DANGEROUS | DO NOT SEND ANYTHING OTHER THAN oldMember AND PLACEHOLDERS.
                    announceMessageTemplate = announceMessageTemplate.replaceAll(placeholders[i], new Function('oldMember, safePlaceholders, placeholders', 'return oldMember.' + safePlaceholders[placeholders[i]].replaceAll("|", "."))(oldMember, safePlaceholders, placeholders));
                };
            };
            announceMessage = announceMessageTemplate;
        };

        if (announceMessage != null)
            await app.functions.msgHandler(announceChannel, { content: announceMessage });
    };

    await logMemberLeave();
    await announceMemberLeave();
};