module.exports = async(app, member) => {
    if (member.partial) await member.fetch();

    if (member.guild == null) return; // Stop if we not in a guild? (Just safety)
    var guild = member.guild;

    var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: guild.id } });
    if (!serverSettings) return;

    var channelID = serverSettings.get("loggingMemberChannel");

    var channel = app.client.channels.cache.get(channelID);
    if (!channel) return; // Something's wrong here?

    channel.send({
        embeds: [{
            thumbnail: { url: member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) },
            title: `${(member.user.bot) ? "Bot Removed" : "User Left"}`,
            color: app.config.system.embedColors.blue,
            description: `There are now ${guild.members.cache.size} members.`,
            fields: [
                { name: "Full Tag", value: member.user.tag, inline: true },
                { name: "ID", value: member.user.id, inline: true },
                { name: "Joined", value: new Date(member.joinedTimestamp).toString() }
            ],
            footer: { text: app.config.system.footerText }
        }]
    });
};