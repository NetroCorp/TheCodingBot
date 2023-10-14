module.exports = async(app, message) => {
    if (!app.client.eulaMsgSent) app.client.eulaMsgSent = [];

    var userSettings = await app.DBs.userSettings.findOne({ where: { userID: message.author.id } });


    var buttonStuffWaiting = true,
        denied = true;
    const { MessageActionRow, MessageButton } = app.modules["discord.js"];
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('agree')
            .setLabel(app.lang.getLine(userSettings.get("language"), 'I agree to these terms.'))
            .setStyle('SUCCESS'),
            new MessageButton()
            .setCustomId('disagree')
            .setLabel(app.lang.getLine(userSettings.get("language"), 'I disagree to these terms.'))
            .setStyle('DANGER')
        );

    async function handleEOA(msg) {
        const filter = i => ["agree", "disagree"].includes(i.customId) && i.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter, max: 1, time: 90000 });

        collector.on('collect', async i => {
            if (i.customId === 'agree') {
                const affectedRows = await app.DBs.userSettings.update({ acceptedEULA: true }, { where: { userID: message.author.id } });
                if (affectedRows > 0) {
                    await i.update({
                        embeds: [{
                            title: `${app.config.system.emotes.success} **${app.lang.getLine(userSettings.get("language"), "End-User License Agreement")}**`,
                            color: app.config.system.embedColors.lime,
                            description: `${app.lang.getLine(userSettings.get("language"), "You successfully agreed to the EULA! Thank you and have fun!")}\n${app.lang.getLine(userSettings.get("language"), "(You may need to rerun your command again.)")}`,
                            footer: { text: app.config.system.footerText }
                        }],
                        components: []
                    });
                    app.logger.info("DISCORD", `[MESSAGE] ${message.author.id} accepted the EOA!`);

                    denied = false;
                } else {
                    await i.update({
                        embeds: [{
                            title: `${app.config.system.emotes.warning} **${app.lang.getLine(userSettings.get("language"), "End-User License Agreement")}**`,
                            color: app.config.system.embedColors.orange,
                            description: app.lang.getLine(userSettings.get("language"), "Could not save your acknowledgement. Please try again."),
                            footer: { text: app.config.system.footerText }
                        }],
                        components: []
                    });

                };
                buttonStuffWaiting = false;

            } else if (i.customId === 'disagree') {
                await i.update({
                    embeds: [{
                        title: `${app.config.system.emotes.error} **${app.lang.getLine(userSettings.get("language"), "End-User License Agreement")}**`,
                        color: app.config.system.embedColors.red,
                        description: app.lang.getLine(userSettings.get("language"), "You denied the EULA."),
                        footer: { text: app.config.system.footerText }
                    }],
                    components: []
                });

                buttonStuffWaiting = false;
            };
        });

        collector.on("end", async(collected) => {
            if (collected.size < 1) {
                app.functions.msgHandler(msg, {
                    embeds: [{
                        title: `${app.config.system.emotes.error} **${app.lang.getLine(userSettings.get("language"), "End-User License Agreement")}**`,
                        color: app.config.system.embedColors.red,
                        description: app.lang.getLine(userSettings.get("language"), "Operation timed out.")
                    }],
                    components: []
                }, 1, true);
            };
            buttonStuffWaiting = false;
        });
    };

    fields = [];
    if (userSettings)
        fields = app.lang.getLine(userSettings.get("language") || "English", "EULA");
    else
        fields = app.lang.getLine("English", "EULA");

    for (var i = 0; i < fields.length; i++) { // Placeholder moment
        var text = fields[i]["value"];
        if (text != null) {
            //            text = text.replaceAll("PREFIX", "Pref");
            fields[i]["value"] = text;
        };
    };

    await app.functions.msgHandler(message, {
        embeds: [{
            title: `${app.config.system.emotes.question} **${app.lang.getLine(userSettings.get("language"), "End-User License Agreement")}**`,
            color: app.config.system.embedColors.purple,
            description: app.lang.getLine(userSettings.get("language"), "Before continuing, you must agree to the bot's End-User License Agreement."),
            fields: fields
        }],
        components: [row]
    }, 0, true, (async msg => {
        // await message.react("📬");
        await handleEOA(msg);
        app.client.eulaMsgSent.push(message.author.id);
    }));

    while (buttonStuffWaiting) { await app.functions.sleep(1000); }

    var index = app.client.eulaMsgSent.indexOf(message.author.id);
    if (index > -1) { app.client.eulaMsgSent.splice(index, 1); };

    return { denied: denied, done: true };
};