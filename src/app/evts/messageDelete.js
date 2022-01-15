module.exports = async(app, message) => {
    if (message.partial) message = await message.fetch();

    //
    // TODO:
    // Send DMs (including message updates, edits, and deletes
    // to bot owner.
    //

    if (message.guild == null) return; // Stop if we not in a guild?
    async function downloadAttachments(attachments) {
        // TODO: Write Attachment handler
        return result;
    };

    var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: message.guild.id } });
    if (!serverSettings) {
        await app.functions.DB.createServer(message.guild.id);
        serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: message.guild.id } });

        return;
    };

    var serverID = serverSettings.get("loggingDeleteChannel");

    var channel = app.client.channels.cache.get(serverID);
    if (!channel) return; // Something's wrong here?

    embs = [{
        author: { name: `Message by ${message.author.tag} (${ message.author.id}) deleted.`, icon_url: message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) },
        color: app.config.system.embedColors.orange,
        description: `Message ID: ${message.id} | [Message link](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`,
        fields: [
            { name: "Content", value: message.content },
            { name: "Deleted In", value: `${message.channel.name} (${message.channel.id}) | <#${message.channel.id}>` }
        ],
        footer: { text: app.config.system.footerText }
    }]

    if (message.attachments.length > 0)
        embs[0].fields.push({ name: "Attachments", value: "Coming back soon again! Stay tuned!" });

    channel.send({
        embeds: embs
    });
}