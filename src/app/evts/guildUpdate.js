module.exports = async(app, oldGuild, newGuild) => {
    if (oldGuild.partial) await oldGuild.fetch().catch(err => {});
    if (newGuild.partial) await newGuild.fetch().catch(err => {});

    if (oldGuild == newGuild) return; // how does this even work

    var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: oldGuild.id } });
    if (!serverSettings) return;

    var logChannelID = serverSettings.get("loggingGuildChannel");
    var logChannel = app.client.channels.cache.get(logChannelID);
    if (!logChannel) return; // Something's wrong here?

    var embed = {
        author: { name: `${newGuild.name} (${newGuild.id})`, icon_url: newGuild.iconURL({ format: 'png', dynamic: true, size: 1024 }) },
        title: "Server updated!",
        color: app.config.system.embedColors.yellow,
        fields: []
    };

    if (oldGuild.name !== newGuild.name) // Check guild name
        embed.fields.push({ name: "Name", value: oldGuild.name + " -> " + newGuild.name, inline: true });
    else
        embed.fields.push({ name: "Name", value: oldGuild.name, inline: true });
    embed.fields.push({ name: "ID", value: oldGuild.id, inline: true });


    if (oldGuild.icon != newGuild.icon) // Check guild icon
        embed.fields.push({ name: "Icon", value: oldGuild.icon + " -> " + newGuild.icon });

    if (oldGuild.ownerId != newGuild.ownerId) // Check guild ownerId
        embed.fields.push({ name: "Owner ID", value: oldGuild.ownerId + " -> " + newGuild.ownerId });

    if (oldGuild.features !== newGuild.features) { // Check guild features
        var featureUpdated = app.functions.arrayDifference(oldGuild.features, newGuild.features)
        for (var i = 0; i < featureUpdated.length; i++) featureUpdated[i] = "`" + featureUpdated[i] + "`";
        if (oldGuild.features.length > newGuild.features.length) embed.fields.push({ name: "Features Removed", value: featureUpdated.join(", ") || "Failed to get features removed" }); // rip features
        else if (oldGuild.features.length < newGuild.features.length) embed.fields.push({ name: "Features Added", value: featureUpdated.join(", ") || "Failed to get features added" }); // ooo features
    };

    if (oldGuild.description != newGuild.description) // Check guild description
        embed.fields.push({ name: "Description", value: oldGuild.description + " -> " + newGuild.description });

    if (oldGuild.splash != newGuild.splash) // Check guild splash
        embed.fields.push({ name: "Splash", value: oldGuild.splash + " -> " + newGuild.splash });

    if (oldGuild.discoverySplash != newGuild.discoverySplash) // Check guild discoverySplash
        embed.fields.push({ name: "Discovery Splash", value: oldGuild.discoverySplash + " -> " + newGuild.discoverySplash });

    if (oldGuild.banner != newGuild.banner) // Check guild banner
        embed.fields.push({ name: "Banner", value: oldGuild.banner + " -> " + newGuild.banner });

    if (oldGuild.verificationLevel != newGuild.verificationLevel) // Check guild verificationLevel
        embed.fields.push({ name: "Verification Level", value: oldGuild.verificationLevel + " -> " + newGuild.verificationLevel });

    if (oldGuild.vanityURLCode != newGuild.vanityURLCode) // Check guild vanityURLCode
        embed.fields.push({ name: "Vanity URL Code", value: oldGuild.vanityURLCode + " -> " + newGuild.vanityURLCode });

    if (oldGuild.afkChannelId != newGuild.afkChannelId) // Check guild afkChannelId
        embed.fields.push({ name: "AFK Channel ID", value: oldGuild.afkChannelId + " -> " + newGuild.afkChannelId, inline: true });

    if (oldGuild.systemChannelId != newGuild.systemChannelId) // Check guild systemChannelId
        embed.fields.push({ name: "System Channel ID", value: oldGuild.systemChannelId + " -> " + newGuild.systemChannelId, inline: true });

    if (oldGuild.rulesChannelId != newGuild.rulesChannelId) // Check guild rulesChannelId
        embed.fields.push({ name: "Rules Channel ID", value: oldGuild.rulesChannelId + " -> " + newGuild.rulesChannelId, inline: true });

    if (oldGuild.rulesChannelId != newGuild.publicUpdatesChannelId) // Check guild publicUpdatesChannelId
        embed.fields.push({ name: "Public Updates Channel ID", value: oldGuild.publicUpdatesChannelId + " -> " + newGuild.publicUpdatesChannelId, inline: true });

    if (oldGuild.mfaLevel != newGuild.mfaLevel) // Check guild mfaLevel
        embed.fields.push({ name: "2FA Level", value: oldGuild.mfaLevel + " -> " + newGuild.mfaLevel });

    if (oldGuild.defaultMessageNotifications != newGuild.defaultMessageNotifications) // Check guild defaultMessageNotifications
        embed.fields.push({ name: "Default Message Notifications", value: oldGuild.defaultMessageNotifications + " -> " + newGuild.defaultMessageNotifications });

    if (!embed.fields.length > 2) return; // Since we aren't subscribing to all updates, stop here if it was something else non-related to what we have.


    embed.fields.push({ name: "Updated At", value: new Date().toString() })

    const fetchedLogs = await newGuild.fetchAuditLogs({
        limit: 6,
        type: "GUILD_UPDATE",
    }).catch(err => {});
    if (fetchedLogs) {

        //define guildLog
        const guildLog = fetchedLogs.entries.find(entry => // To avoid false positives, we look for a timeframe of when the guild was updated.
            Date.now() - entry.createdTimestamp < 5000
        );
        if (guildLog) {
            const { executor } = guildLog;

            embed.fields.push({ name: "Updated by", value: `${app.functions.pomeloHandler(executor)} (${executor.id})` })
            embed["thumbnail"] = executor;
        };
    }; // May be missing permissions to fetch audit log.

    await app.functions.msgHandler(logChannel, { embeds: [embed] });
};