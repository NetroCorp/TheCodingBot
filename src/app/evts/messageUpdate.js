module.exports = async(app, omessage, nmessage) => {
    if (omessage.content == nmessage.content) return;

    //
    // TODO:
    // Send DMs (including message updates, edits, and deletes
    // to bot owner.
    //

    if (omessage.guild == null) return; // Stop if we not in a guild?
    var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: omessage.guild.id } });
    if (!serverSettings) {
        await app.functions.DB.createServer(omessage.guild.id);
        serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: omessage.guild.id } });

        return;
    };

    var serverID = serverSettings.get("loggingEditChannel");

    var channel = app.client.channels.cache.get(serverID);
    if (!channel) return; // Something's wrong here?

    channel.send({
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
    });
}