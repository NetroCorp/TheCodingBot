module.exports = async(app, messages) => {
    const firstMsg = messages.first() || null;
    if (!firstMsg) return;
    else if (firstMsg.guild == null) // Stop if we not in a guild.
        return;
    else if (firstMsg.guild != null && firstMsg.author) // Or stop if we are in a guild and the author exists.
        if (firstMsg.author.bot) return; // - and stop if we getting data from a bot.

    var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: messages.first().guild.id } });
    if (!serverSettings) return;

    var logChannelID = serverSettings.get("loggingMessageChannel");
    var logChannel = app.client.channels.cache.get(logChannelID);
    if (!logChannel) return; // Something's wrong here?

    var data = new Map();

    await messages.forEach(async message => {
        if (message.partial) { await message.fetch().catch(() => messages.delete(message)); return }; // Try to get the message.
        if (message.author.bot) { return messages.delete(message); }; // Stop if we getting data from a bot.

        var msgAttachments;
        if (message.attachments.size > 0) {
            msgAttachments = await app.functions.downloadAttachments(message, message.attachments);

            while (app.client.waitingForMessageToDelete.includes(message.id)) {
                await app.functions.sleep(1000);
            };
        };

        var temp = `[${message.id} | ${app.functions.convertTimestamp(message.createdTimestamp, true, true)}] ${message.author.tag}: ${message.content}`;
        if (message.attachments.size > 0) {
            temp = temp +
                ((msgAttachments.succeed.length > 0) ? `\n\tAttachments: ${msgAttachments.succeed.join("\n")}` : "") +
                ((msgAttachments.failed.length > 0) ? `\n\t**Failed (${msgAttachments.failed.length}):**\n ${msgAttachments.failed.join("\n ")}` : "");
        };

        data.set(message.id, temp);
    });

    while (data.size < messages.size) {
        await app.functions.sleep(1000);
    };

    data = new Map([...data.entries()].sort());
    var msgData = [];
    data.forEach(val => msgData.push(val));

    var options = {
        embeds: [{
            author: { name: `${messages.size} messages deleted.`, icon_url: app.client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) },
            color: app.config.system.embedColors.orange,
            description: `[Start Message link](https://discord.com/channels/${messages.first().guild.id}/${messages.first().channel.id}/${messages.first().id}) | [End Message link](https://discord.com/channels/${messages.last().guild.id}/${messages.last().channel.id}/${messages.last().id})`,
            fields: [
                { name: "Deleted In", value: `${messages.first().channel.name} (${messages.first().channel.id}) | <#${messages.first().channel.id}>` }
            ],
            footer: { text: app.config.system.footerText }
        }]
    };

    try { // WRITE TO THE FILEEE!!!
        const fileName = `bulkDel-${firstMsg.guild.id}-${firstMsg.channel.id}_${(new Date().getTime())}.txt`;
        const fs = app.modules["fs"],
            fileToExportTo = `${process.cwd()}/app/cache/${fileName}`;


        await fs.appendFile(fileToExportTo, `// Message Bulk Delete Log\n// Time deleted: ${app.functions.convertTimestamp(new Date().getTime(), true, true)}\n\n${((msgData) ? ((msgData.length > 0) ? msgData.join("\n") : "No messages fetched. Bummer.") : "Something went wrong?")}`, 'utf8', (err) => { if (err) { console.error(err); } });
        await app.functions.sleep(1000);

        logChannel.send(options);
        logChannel.send({ files: [fileToExportTo] }).catch(err => { app.logger.warn("DISCORD", `[MESSAGE] Message in bulk deleted but an error occurred when trying to send log! Error: ${err.message}`) });
    } catch (Ex) {
        console.log(Ex);
        options["embeds"][0]["fields"].unshift({ name: "Contents (First-Last)", value: ((msgData) ? ((msgData.length > 0) ? msgData.join("\n") : "No messages fetched. Bummer.") : "Something went wrong?") });
        logChannel.send(options).catch(err => { app.logger.warn("DISCORD", `[MESSAGE] Messages in bulk deleted but an error occurred when trying to send log! Error: ${err.message}`) });
    };


};