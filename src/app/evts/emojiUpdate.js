module.exports = async(app, oldEmoji, newEmoji) => {
    if (oldEmoji.partial) await oldEmoji.fetch().catch(err => {});
    if (newEmoji.partial) await newEmoji.fetch().catch(err => {});

    if (oldEmoji == newEmoji) return; // how does this even work

    if (oldEmoji.guild == null) return; // Stop if we not in a guild? (Just safety)
    var guild = oldEmoji.guild;

    var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: guild.id } });
    if (!serverSettings) return;

    var logChannelID = serverSettings.get("loggingGuildChannel");
    var logChannel = app.client.channels.cache.get(logChannelID);
    if (!logChannel) return; // Something's wrong here?

    var embed = {
        author: { name: `${guild.name} (${guild.id})`, icon_url: guild.iconURL({ format: 'png', dynamic: true, size: 1024 }) },
        title: `${(oldEmoji.animated) ? "Animated" : "Standard"} Emoji updated!`,
        color: app.config.system.embedColors.yellow,
        fields: []
    };

    if (oldEmoji.name !== newEmoji.name) // Check emoji name
        embed.fields.push({ name: "Name", value: oldEmoji.name + " -> " + newEmoji.name, inline: true });
    else
        embed.fields.push({ name: "Name", value: oldEmoji.name, inline: true });
    embed.fields.push({ name: "ID", value: oldEmoji.id, inline: true });

    if (oldEmoji.color != newEmoji.color) // Check emoji color
        embed.fields.push({ name: "Color", value: oldEmoji.color + " -> " + newEmoji.color });


    embed.fields.push({ name: "Updated At", value: new Date().toString() })

    const fetchedLogs = await guild.fetchAuditLogs({
        limit: 6,
        type: "EMOJI_UPDATE",
    }).catch(err => {});
    if (fetchedLogs) {

        //define emojiLog
        const emojiLog = fetchedLogs.entries.find(entry => // To avoid false positives, we look for a timeframe of when the emoji was updated.
            Date.now() - entry.createdTimestamp < 5000
        );
        if (emojiLog) {
            const { executor } = emojiLog;

            embed.fields.push({ name: "Updated by", value: `${app.functions.pomeloHandler(executor)} (${executor.id})` })
            embed["thumbnail"] = { url: `https://cdn.discordapp.com/emojis/${oldEmoji.id}.${(oldEmoji.animated) ? "gif" : "png"}` };
        };
    }; // May be missing permissions to fetch audit log.

    await app.functions.msgHandler(logChannel, { embeds: [embed] });
};