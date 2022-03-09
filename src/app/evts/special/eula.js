module.exports = async(app, message) => {
    if (!app.client.eulaMsgSent) app.client.eulaMsgSent = [];

    var buttonStuffWaiting = true,
        denied = true;
    const { MessageActionRow, MessageButton } = app.modules["discord.js"];
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('agree')
            .setLabel('I agree to these terms.')
            .setStyle('SUCCESS'),
            new MessageButton()
            .setCustomId('disagree')
            .setLabel('I disagree to these terms.')
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
                            title: `${app.config.system.emotes.success} **End-User Agreement**`,
                            color: app.config.system.embedColors.lime,
                            description: "You successfully agreed to the EOA! Thank you and have fun!\n(You may need to rerun your command again.)",
                            footer: { text: app.config.system.footerText }
                        }],
                        components: []
                    });
                    app.logger.info("DISCORD", `[MESSAGE] ${message.author.id} accepted the EOA!`);

                    denied = false;
                } else {
                    await i.update({
                        embeds: [{
                            title: `${app.config.system.emotes.warning} **End-User Agreement**`,
                            color: app.config.system.embedColors.orange,
                            description: "Could not save your acknowledgement. Please try again.",
                            footer: { text: app.config.system.footerText }
                        }],
                        components: []
                    });

                };
                buttonStuffWaiting = false;

            } else if (i.customId === 'disagree') {
                await i.update({
                    embeds: [{
                        title: `${app.config.system.emotes.error} **End-User Agreement**`,
                        color: app.config.system.embedColors.red,
                        description: "You denied the EOA.",
                        footer: { text: app.config.system.footerText }
                    }],
                    components: []
                });

                buttonStuffWaiting = false;
            };
        });

        collector.on('end', async(collected) => {
            if (collected.size < 1) {
                app.functions.msgHandler(msg, {
                    embeds: [{
                        title: `${app.config.system.emotes.error} **End-User Agreement**`,
                        color: app.config.system.embedColors.red,
                        description: "Operation timed out."
                    }],
                    components: []
                }, 1, true);
            };
            buttonStuffWaiting = false;
        });
    };

    var fields = require("./eula-data.json");
    for (var i = 0; i < fields.length; i++) { // Placeholder moment
        var text = fields[i]["value"];
        if (text != null) {
            text = text.replaceAll("PREFIX", "Pref");
            fields[i]["value"] = text;
        };
    };

    await app.functions.msgHandler(message, {
        embeds: [{
            title: `${app.config.system.emotes.question} **End-User Agreement Agreement**`,
            color: app.config.system.embedColors.purple,
            description: "Before continuing, you must agree to the bot's End-User Agreement.",
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