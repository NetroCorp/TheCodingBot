module.exports = async(app, member) => {
    if (member.partial) await member.fetch().catch(err => {});

    if (member.guild == null) return; // Stop if we not in a guild? (Just safety)
    var guild = member.guild;

    var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: guild.id } });
    if (!serverSettings) return;

    var logChannelID = serverSettings.get("loggingMemberChannel");
    var logChannel = app.client.channels.cache.get(logChannelID);
    if (!logChannel) return; // Something's wrong here?

    function nth(n) { return ["st", "nd", "rd"][((n + 90) % 100 - 10) % 10 - 1] || "th" };
    const memberNth = nth(guild.members.cache.size);

    logChannel.send({
        embeds: [{
            author: { name: `${guild.name} (${guild.id})`, icon_url: guild.iconURL({ format: 'png', dynamic: true, size: 1024 }) },
            thumbnail: { url: member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) },
            title: `${(member.user.bot) ? "Bot Added" : "User Joined"}`,
            color: app.config.system.embedColors.green,
            description: `They are the ${memberNth} member.`,
            fields: [
                { name: "Full Tag", value: member.user.tag, inline: true },
                { name: "ID", value: member.user.id, inline: true },
                { name: "Created", value: new Date(member.createdTimestamp).toString() }
            ],
            footer: { text: app.config.system.footerText }
        }]
    });
};