module.exports = async(app, oldEmoji) => {
    if (oldEmoji.partial) await oldEmoji.fetch().catch(err => {});

    if (oldEmoji.guild == null) return; // Stop if we not in a guild? (Just safety)
    var guild = oldEmoji.guild;

    var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: guild.id } });
    if (!serverSettings) return;

    var logChannelID = serverSettings.get("loggingGuildChannel");
    var logChannel = app.client.channels.cache.get(logChannelID);
    if (!logChannel) return; // Something's wrong here?

    var embed = {
        author: { name: `${guild.name} (${guild.id})`, icon_url: guild.iconURL({ format: 'png', dynamic: true, size: 1024 }) },
        title: `${(oldEmoji.animated) ? "Animated" : "Standard"} Emoji deleted!`,
        color: app.config.system.embedColors.dark_blue,
        description: `There are now ${guild.emojis.cache.size} emojis.`,
        fields: [
            { name: "Name", value: oldEmoji.name, inline: true },
            { name: "ID", value: oldEmoji.id, inline: true },
            { name: "Deleted At", value: new Date().toString() },
        ]
    };

    const fetchedLogs = await guild.fetchAuditLogs({
        limit: 6,
        type: "EMOJI_DELETE",
    }).catch(err => {});
    if (fetchedLogs) {

        //define emojiLog
        const emojiLog = fetchedLogs.entries.find(entry => // To avoid false positives, we look for a timeframe of when the emoji was created.
            Date.now() - entry.createdTimestamp < 5000
        );
        if (emojiLog) {
            const { executor } = emojiLog;

            embed.fields.push({ name: "Deleted by", value: `${app.functions.pomeloHandler(executor)} (${executor.id})` })
            embed["thumbnail"] = { url: `https://cdn.discordapp.com/emojis/${oldEmoji.id}.${(oldEmoji.animated) ? "gif" : "png"}` };
        };
    }; // May be missing permissions to fetch audit log.

    await app.functions.msgHandler(logChannel, { embeds: [embed] });
};