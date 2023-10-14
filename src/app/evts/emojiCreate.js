module.exports = async(app, newEmoji) => {
    if (newEmoji.partial) await newEmoji.fetch().catch(err => {});

    if (newEmoji.guild == null) return; // Stop if we not in a guild? (Just safety)
    var guild = newEmoji.guild;

    var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: guild.id } });
    if (!serverSettings) return;

    var logChannelID = serverSettings.get("loggingGuildChannel");
    var logChannel = app.client.channels.cache.get(logChannelID);
    if (!logChannel) return; // Something's wrong here?

    var embed = {
        author: { name: `${guild.name} (${guild.id})`, icon_url: guild.iconURL({ format: 'png', dynamic: true, size: 1024 }) },
        title: `${(newEmoji.animated) ? "Animated" : "Standard"} Emoji created!`,
        color: app.config.system.embedColors.green,
        description: `There are now ${guild.emojis.cache.size} emojis.`,
        fields: [
            { name: "Name", value: newEmoji.name, inline: true },
            { name: "ID", value: newEmoji.id, inline: true },
            { name: "Created At", value: new Date(newEmoji.createdTimestamp).toString() },
        ]
    };

    const fetchedLogs = await guild.fetchAuditLogs({
        limit: 6,
        type: "EMOJI_CREATE",
    }).catch(err => {});
    if (fetchedLogs) {

        //define emojiLog
        const emojiLog = fetchedLogs.entries.find(entry => // To avoid false positives, we look for a timeframe of when the emoji was created.
            Date.now() - entry.createdTimestamp < 5000
        );
        if (emojiLog) {
            const { executor } = emojiLog;

            embed.fields.push({ name: "Uploaded by", value: `${app.functions.pomeloHandler(executor)} (${executor.id})` })
            embed["thumbnail"] = { url: `https://cdn.discordapp.com/emojis/${newEmoji.id}.${(newEmoji.animated) ? "gif" : "png"}` };
        };
    }; // May be missing permissions to fetch audit log.

    await app.functions.msgHandler(logChannel, { embeds: [embed] });
};