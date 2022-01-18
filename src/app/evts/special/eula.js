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
                            description: "You successfully agreed to the EOA! Thank you and have fun!\n(Please rerun your command.)",
                            footer: { text: app.config.system.footerText }
                        }],
                        components: []
                    }).then(m => setTimeout(() => {
                        if (m.guild)
                            m.delete();
                    }, 10000));
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
                        description: "Operation timed out.",
                        footer: { text: app.config.system.footerText }
                    }],
                    components: []
                }, 1, true);
            };
            buttonStuffWaiting = false;
        });
    };

    await app.functions.msgHandler(message, {
        embeds: [{
            title: `${app.config.system.emotes.question} **End-User Agreement Agreement**`,
            color: app.config.system.embedColors.purple,
            description: "Before continuing, you must agree to the bot's End-User Agreement.",
            fields: [
                { name: "**1. Treat All Fairly.**", value: "Any actions performed to gain an unfair advantage over other users are explicitly against the rules. This includes but is not limited to:\n -- Using macros, scripts, etc.\n -- Using multiple accounts.\n -- Trading any items within this bot outside of the bot itself." },
                { name: "**2. Your Responsibility.**", value: "We know things happen, however you automatically assume full responsibility for any actions that is done on your account.\n *Do not share your Discord account credentials or allow any form of access to your Discord account that may result in violation of the rules.*" },
                { name: "**3. Analytical Data.**", value: "This bot will collect analytical data for the sole purporse of error tracking, usage information, and how the bot can be improved. By agreeing to this EOA, you also agree to the Privacy Policy.\n *You may opt-out by running command_placeholder_lol.*" },
                { name: "**If a breach of these rules is suspected...**", value: "...any and all users associated with the rule(s) violation may result in any account(s) created on this bot terminated and/or blacklist from this bot." },
                { name: "**This bot has a Terms of Service and Privacy Policy!**", value: "See the [Terms of Service](https://tcb.nekos.tech/terms) and [Privacy Policy](https://tcb.nekos.tech/privacy) before continuing!" }
            ],
            footer: { text: app.config.system.footerText }
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