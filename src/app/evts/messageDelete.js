module.exports = async(app, message) => {
    if (message.partial) await message.fetch();

    //
    // TODO:
    // Send DMs (including message sent, updates, and deletes
    // to bot owner.
    //

    if (message.guild == null ||
        message.author.bot) return; // Stop if we in a guild - and stop if we getting data from a bot.

    var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: message.guild.id } });
    if (!serverSettings) return;

    if (app.client.waitingForMessageToDelete == undefined) app.client.waitingForMessageToDelete = [];

    async function downloadAttachments(attachments) {
        var result = { failed: [], succeed: [] };
        app.client.waitingForMessageToDelete.push(message.id);

        for (var attachment of attachments) {
            var attachment = attachment[1]; // For some reason, doing it this way, we go into an array? [0] = id, [1] = MessageAttachment
            var msgAttachURL = ((attachment.proxyURL == null || attachment.proxyURL == "") ? attachment.url : attachment.proxyURL),
                file = attachment.name;
            var fileext = file.slice((file.lastIndexOf(".") - 1 >>> 0) + 2);
            var filename = file.replace("." + fileext, "");
            // someone tell me if there is a better write to write this.

            var postURL = `${app.config.system.logURL}TCB_Post.php?rand=${app.functions.getTicks()}&type=logging&url=${msgAttachURL}&guildID=${message.guild.id}&channelID=${message.channel.id}&messageID=${message.id}&filename=${filename}&fileext=${fileext}&size=${attachment.size}&return=JSON`;
            try {
                const res = await app.modules["node-fetch"](postURL);


                if (res.status != 200) {
                    throw new Error(res.status);
                } else {
                    const body = await res.json();
                    if (body["return"]["success"] == "true" && body["return"]["error"] == "none")
                        result["succeed"].push(`${app.config.system.logURL}${body["return"]["imgUrl"]}`);
                    else
                        result["failed"].push(`[WEBSERVER] ${body["return"]["error"]}`);
                };
            } catch (err) {
                app.logger.error("SYS", "[EVENTS] [MESSAGE DELETE] Whoops! Something went wrong! Downloading the file went OOF!\n" + err.message);
                if (attachment.proxyURL != null) result["failed"].push(`${attachment}`);
                else result["failed"](`[MEDIA_PROXY] ${msgAttachURL}`);
            };
        };

        app.client.waitingForMessageToDelete = app.functions.removeItemAll(app.client.waitingForMessageToDelete, message.id);
        return result;
    };

    var channelID = serverSettings.get("loggingMessageChannel");

    var channel = app.client.channels.cache.get(channelID);
    if (!channel) return; // Something's wrong here?

    var msgAttachments;
    if (message.attachments.size > 0)
        msgAttachments = await downloadAttachments(message.attachments);

    while (app.client.waitingForMessageToDelete.includes(message.id)) {
        await app.functions.sleep(1000);
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