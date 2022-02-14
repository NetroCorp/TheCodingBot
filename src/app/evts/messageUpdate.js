module.exports = async(app, omessage, nmessage) => {
    if (omessage.partial) await omessage.fetch(true).catch(err => {});
    if (nmessage.partial) await nmessage.fetch(true).catch(err => {});

    if (omessage.content == nmessage.content) return;

    if (omessage.guild == null) // Stop if we not in a guild.
        return;
    else if (omessage.guild != null && omessage.author) // Or stop if we are in a guild and the author exists.
        if (omessage.author.bot) return; // - and stop if we getting data from a bot.
        else {}
    else return;

    var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: omessage.guild.id } });
    if (!serverSettings) return;

    var logChannelID = serverSettings.get("loggingGuildChannel");
    var logChannel = app.client.channels.cache.get(logChannelID);
    if (!logChannel) return; // Something's wrong here?

    logChannel.send({
        embeds: [{
            author: { name: `Message by ${omessage.author.tag} (${ omessage.author.id}) edited.`, icon_url: omessage.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) },
            color: app.config.system.embedColors.yellow,
            description: `Message ID: ${omessage.id} | [Go to message](https://discord.com/channels/${omessage.guild.id}/${omessage.channel.id}/${omessage.id})`,
            fields: [
                { name: "Before", value: omessage.content },
                { name: "After", value: nmessage.content },
                { name: "Edited In", value: `${omessage.channel.name} (${omessage.channel.id}) | <#${omessage.channel.id}>` }
            ],
            footer: { text: app.config.system.footerText }
        }]
    }).catch(err => { app.logger.warn("DISCORD", `[MESSAGE] Message edited but an error occurred when trying to send log! Error: ${err.message}`) });
}