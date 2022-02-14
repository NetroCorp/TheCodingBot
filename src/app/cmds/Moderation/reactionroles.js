module.exports = {
    name: "reactionroles",
    description: "Setup reaction roles for your server!",
    guildOnly: true,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["MANAGE_MESSAGES", "MANAGE_ROLES"],
    cooldown: 5,
    aliases: ["rr", "rrmsg"],
    syntax: [],
    execute: async(app, message, args) => {
        const { MessageActionRow, MessageButton, MessageSelectMenu } = app.modules["discord.js"];

        var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: message.guild.id } });

        app.functions.msgHandler(message, {
            embeds: [{
                title: app.config.system.emotes.wait + " **Loading**",
                color: app.config.system.embedColors.blue
            }]
        }, 0, true, (async msg => {
            try {
                if (!serverSettings) throw new Error("No server in database"); // How did they even do this command?
                var cData = [];
                await message.guild.channels.cache.forEach(channel => {
                    if (channel.type == "GUILD_TEXT")
                        cData.push({
                            label: "#" + ((channel["id"] == message.channel.id) ? `${channel["name"]} (This channel)` : channel["name"]),
                            description: channel["topic"] || "No topic.",
                            value: channel["id"]
                        });
                });

                var channelID = 0,
                    messageID = 0,
                    reactions = [],
                    customTitle = "",
                    customDesc = "";


                await app.functions.msgHandler(msg, {
                    embeds: [{
                        title: `${app.config.system.emotes.question} Reaction Roles - Select Channel`,
                        color: app.config.system.embedColors.purple,
                        description: "Alright - from the dropdown - What channel are we going to be setting this up in?"
                    }],
                    components: [new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu()
                            .setCustomId("select")
                            .setPlaceholder("Choose a channel!")
                            .addOptions(cData),
                        )
                    ],
                    author: message.author
                }, 1, true, (async() => {

                    const filter = i => { return ["select"].includes(i.customId) && i.user.id === message.author.id };
                    const collector = message.channel.createMessageComponentCollector({ filter, time: 30000, errors: ["time"] });

                    collector.on("collect", async i => {
                        if (i.customId === "select" && i.values.length > 0) {
                            for (var v in i.values) {
                                collector.stop("done");
                                var val = i.values[v];
                                channelID = val;
                                await app.functions.msgHandler(msg, {
                                    embeds: [{
                                        title: `${app.config.system.emotes.question} Reaction Roles - Set title & description`,
                                        color: app.config.system.embedColors.purple,
                                        description: "Nice channel!\nPlease enter the embed title and description so your users know what is what!\nExample: `This is a test|Get roles here :)`",
                                    }],
                                    components: [],
                                    author: message.author
                                }, 1, true, (async menumsg => {
                                    await collectRRMsg(menumsg);

                                }));
                            };
                        };
                    });

                    collector.on("end", async(collected) => {
                        if (collected.size < 1) {
                            app.functions.msgHandler(msg, {
                                embeds: msg.embeds || [],
                                components: []
                            }, 1, true);
                        };
                    });
                }));

                // FUNCTIONS
                async function collectRRMsg() {
                    const filter = m => { return m.author.id === message.author.id };
                    const collector = message.channel.createMessageCollector({ filter, time: 30000, errors: ["time"] });

                    collector.on("collect", async m => {
                        if (m.content.includes("|")) {
                            m.delete().catch(err => {});
                            collector.stop("done");
                            var splitMsg = m.content.split("|");
                            customTitle = splitMsg[0],
                                customDesc = splitMsg[1];

                            await app.functions.msgHandler(msg, {
                                embeds: [{
                                    title: `${app.config.system.emotes.question} Reaction Roles - Create Reactions`,
                                    color: app.config.system.embedColors.purple,
                                    description: "Great! What should the reaction roles be? Send `done` when done.\nSend in this format: `:white_check_mark:|13-18|999999999999999999`\n(Example is below)"
                                }],
                                components: [],
                                author: message.author
                            }, 1, true, (async() => {
                                await app.functions.msgHandler(message, {
                                    embeds: [{
                                        title: customTitle,
                                        description: customDesc,
                                        footer: { text: " !! EXAMPLE !! - " + app.config.system.footerText }

                                    }]
                                }, 0, false, (async exMsg => { await collectRR(exMsg); }));
                            }));
                        } else if (m.content === "cancel") {
                            m.react(app.config.system.emotes.success).catch(err => {});
                            collector.stop("cancelled by user");
                        };
                    });

                    collector.on("end", async(collected) => {
                        if (collected.size < 1) {
                            app.functions.msgHandler(msg, {
                                embeds: msg.embeds || [],
                                components: []
                            }, 1, true);
                        };
                    });
                };

                async function collectRR(exMsg = null) {
                    const filter = m => { return m.author.id === message.author.id };
                    const collector = message.channel.createMessageCollector({ filter, time: 90000, errors: ["time"] });

                    var reactionroles = [];

                    collector.on("collect", async m => {
                        if (m.content == "done") {
                            collector.stop("done");
                            if (exMsg != null) exMsg.delete().catch(err => {});
                            await app.functions.msgHandler(msg, {
                                embeds: [{
                                    title: `${app.config.system.emotes.wait} Reaction Roles - Saving`,
                                    color: app.config.system.embedColors.blue,
                                    description: "Fantastic! Saving your settings..."
                                }],
                                components: [],
                                author: message.author
                            }, 1, true, (async() => {
                                var channel = message.guild.channels.cache.get(channelID),
                                    reactionsList = [];
                                for (var reaction in reactions) { reactionsList.push(reactions[reaction]["emoji"] + " " + reactions[reaction]["roleMsg"]); };
                                await channel.send({
                                    embeds: [{
                                        title: customTitle,
                                        description: customDesc + "\n\n" + reactionsList.join("\n"),
                                    }]
                                }).then(msg => {
                                    messageID = msg.id;

                                    for (var reaction in reactions) { msg.react(reactions[reaction]["emoji"]); };
                                }).catch(err => new Error(err));

                                var data = JSON.parse(serverSettings["reactionRoles"]) || {};
                                data[channelID] = {
                                    message: messageID,
                                    reactionRoles: reactions
                                };

                                const affectedRows = await app.DBs.serverSettings.update({ reactionRoles: JSON.stringify(data, null, "\t") }, { where: { serverID: message.guild.id } });

                                if (affectedRows > 0) {
                                    await app.functions.msgHandler(msg, {
                                        embeds: [{
                                            title: `${app.config.system.emotes.success} Reaction Roles`,
                                            color: app.config.system.embedColors.lime,
                                            description: `Woohoo! We're done here! Go see your lovely reaction roles [now](https://discord.com/channels/${message.guild.id}/${channelID}/${messageID}).\nPlease note that reactions may take a bit to apply due to ratelimits.`
                                        }],
                                        components: [],
                                        author: message.author
                                    }, 1, true);
                                } else {
                                    throw new Error("Database saving failed!");
                                };

                                m.react(app.config.system.emotes.success).catch(err => {});

                            }));
                        } else if (m.content === "cancel") {
                            m.react(app.config.system.emotes.success).catch(err => {});
                            collector.stop("cancelled by user");
                        } else {
                            var splitMsg = m.content.split("|");
                            if (splitMsg.length < 3) return; // Ignore the message.
                            var emoji = splitMsg[0],
                                roleMsg = splitMsg[1],
                                roleID = app.functions.getID(splitMsg[2]) || splitMsg[2];

                            reactions.push({
                                emoji: emoji,
                                roleID: roleID,
                                roleMsg: roleMsg
                            });

                            m.react(app.config.system.emotes.success).catch(err => {});
                        };
                    });
                    collector.on("end", async(collected) => {
                        if (collected.size < 1) {
                            app.functions.msgHandler(msg, {
                                embeds: msg.embeds || [],
                                components: []
                            }, 1, true);
                        };
                    });
                };
            } catch (Ex) {
                app.functions.msgHandler(msg, {
                    embeds: [{
                        author: { name: `Something happened, ${message.author.tag}!`, icon_url: message.author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }) },
                        title: `${app.config.system.emotes.information} Reaction Roles - Setup`,
                        color: app.config.system.embedColors.red,
                        description: `Sadly, we ran into an error while setting up your reaction roles. Here's what we know: ${Ex.message}`
                    }]
                });;
            }
        }));
    }
};