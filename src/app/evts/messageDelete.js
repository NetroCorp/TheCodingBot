module.exports = async(app, message) => {
    if (message.partial) await message.fetch();

    //
    // TODO:
    // Send DMs (including message sent, updates, and deletes
    // to bot owner.
    //

    if (message.guild == null ||
        message.author.bot) return; // Stop if we not in a guild - and stop if we getting data from a bot.

    var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: message.guild.id } });
    if (!serverSettings) return;

    var channelID = serverSettings.get("loggingMessageChannel");
    var channel = app.client.channels.cache.get(channelID);
    if (!channel) return; // Something's wrong here?

    var msgAttachments;
    if (message.attachments.size > 0) {
        msgAttachments = await app.functions.downloadAttachments(message, message.attachments);

        while (app.client.waitingForMessageToDelete.includes(message.id)) {
            await app.functions.sleep(1000);
        };
    };

    embs = [{
        author: { name: `Message by ${message.author.tag} (${ message.author.id}) deleted.`, icon_url: message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) },
        color: app.config.system.embedColors.orange,
        description: `Message ID: ${message.id} | [Message link](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`,
        fields: [
            { name: "Content", value: message.content || "** **" },
            { name: "Deleted In", value: `${message.channel.name} (${message.channel.id}) | <#${message.channel.id}>` }
        ],
        footer: { text: app.config.system.footerText }
    }];

    if (message.attachments.size > 0) {
        embs[0].fields.push({
            name: "Attachments",
            value:
                ((msgAttachments.succeed.length > 0) ? `${msgAttachments.succeed.join("\n")}` : "") +
                ((msgAttachments.failed.length > 0) ? `**Failed (${msgAttachments.failed.length}):**\n ${msgAttachments.failed.join("\n ")}` : "")
        });
    };

    channel.send({
        embeds: embs
    });
}