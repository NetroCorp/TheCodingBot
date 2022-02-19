module.exports = {
    name: "config",
    description: "Configure your server the way you want!",
    guildOnly: true,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["MANAGE_SERVER", "MANAGE_ROLES", "MANAGE_MESSAGES"],
    cooldown: 5,
    aliases: ["configuration"],
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
                var dropdownData = [{
                    label: "Logging",
                    description: "Configure logging settings.",
                    value: "logging"
                }, {
                    label: "Join & Leave Messages",
                    description: "Configure join and leave messages.",
                    value: "joinleave"
                }];

                await app.functions.msgHandler(msg, {
                    embeds: [{
                        title: `${app.config.system.emotes.question} Configure ${app.name} - Select Option`,
                        color: app.config.system.embedColors.purple,
                        description: "Alright - from the dropdown - what are we going to be configuring?",
                    }],
                    components: [new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu()
                            .setCustomId("select")
                            .setPlaceholder("Choose an option!")
                            .addOptions(dropdownData),
                        )
                    ],
                    author: message.author
                }, 1, true, (async() => {

                    const filter = i => { return ["select"].includes(i.customId) && i.user.id === message.author.id };
                    const collector = message.channel.createMessageComponentCollector({ filter, time: 30000, errors: ["time"] });

                    const cancelFilter = m => { if (m.user) return m.user.id === message.author.id; };
                    const cancelCollector = message.channel.createMessageCollector({ filter: cancelFilter, time: 30000, errors: ["time"] });
                    cancelCollector.on("collect", async m => {
                        if (!m.content == "cancel") return;
                        collector.stop("cancelled by user");
                        cancelCollector.stop("cancelled by user");
                        m.react(app.config.system.emotes.success).catch(err => {});
                    });

                    collector.on("collect", async i => {
                        if (i.customId === "select" && i.values.length > 0) {
                            for (var v in i.values) {
                                i.deferUpdate();
                                cancelCollector.stop("done");
                                collector.stop("done");
                                var val = i.values[v];

                                if (val == "logging") {
                                    // Have to hardcore this for now. eww..
                                    dropdownData = [{
                                        label: "Member Event Channel",
                                        description: "The channel member events are logged to (joins, leaves, and updates)",
                                        value: "loggingMemberChannel"
                                    }, {
                                        label: "Server Event Channel",
                                        description: "The channel guild events are logged to (role + channel creates/updates/deletes & server updates)",
                                        value: "loggingGuildChannel"
                                    }, {
                                        label: "Message Event Channel",
                                        description: "The channel message events are logged to (message updates/deletes/bulkdeletes)",
                                        value: "loggingMessageChannel"
                                    }];

                                    await app.functions.msgHandler(msg, {
                                        embeds: [{
                                            title: `${app.config.system.emotes.question} Configure ${app.name} - Type of Logging`,
                                            color: app.config.system.embedColors.purple,
                                            description: "My favorite! Alright, what type of logging should we configure?",
                                        }],
                                        components: [new MessageActionRow()
                                            .addComponents(
                                                new MessageSelectMenu()
                                                .setCustomId("select")
                                                .setPlaceholder("Choose an option!")
                                                .addOptions(dropdownData),
                                            )
                                        ],
                                        author: message.author
                                    }, 1, true, (async menumsg => {
                                        await collectLoggingType(menumsg);

                                    }));
                                } else if (val == "joinleave") {
                                    // Have to hardcore this for now. eww..
                                    dropdownData = [{
                                        label: "Join Messages & Channel",
                                        description: "Hello (user) and welcome to the server!",
                                        value: "join"
                                    }, {
                                        label: "Leave Messages & Channel",
                                        description: "Oh no! (user) left the server!",
                                        value: "leave"
                                    }];

                                    await app.functions.msgHandler(msg, {
                                        embeds: [{
                                            title: `${app.config.system.emotes.question} Configure ${app.name} - Join or Leave??`,
                                            color: app.config.system.embedColors.purple,
                                            description: "Bet! What would you like to set up?",
                                        }],
                                        components: [new MessageActionRow()
                                            .addComponents(
                                                new MessageSelectMenu()
                                                .setCustomId("select")
                                                .setPlaceholder("Choose an option!")
                                                .addOptions(dropdownData),
                                            )
                                        ],
                                        author: message.author
                                    }, 1, true, (async menumsg => {
                                        await collectJoinLeave(menumsg);

                                    }));
                                };
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

                var defaults = app.defaults;

                // FUNCTIONS
                async function collectLoggingType() {

                    const filter = i => { return ["select"].includes(i.customId) && i.user.id === message.author.id };
                    const collector = message.channel.createMessageComponentCollector({ filter, time: 30000, errors: ["time"] });

                    const cancelFilter = m => { if (m.user) return m.user.id === message.author.id };
                    const cancelCollector = message.channel.createMessageCollector({ filter: cancelFilter, time: 30000, errors: ["time"] });
                    cancelCollector.on("collect", async m => {
                        if (!m.content == "cancel") return;
                        collector.stop("cancelled by user");
                        cancelCollector.stop("cancelled by user");
                        m.react(app.config.system.emotes.success).catch(err => {});
                    });

                    collector.on("collect", async i => {
                        if (i.customId === "select" && i.values.length > 0) {
                            for (var v in i.values) {
                                i.deferUpdate();
                                cancelCollector.stop("done");
                                collector.stop("done");
                                var val = i.values[v];
                                await collectNewLoggingChannel(val);
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
                };

                async function collectNewLoggingChannel(typeOfLog) {
                    if (!typeOfLog) return;
                    var cData = [];
                    var logID = serverSettings.get(typeOfLog) || "";

                    var bigChannelSize = (message.guild.channels.cache.size > 25),
                        filteredChannels = await message.guild.channels.cache.filter(c => c.type == "GUILD_TEXT" && c.id != logID).map(x => ({ x, r: Math.random() })).sort((a, b) => a.r - b.r).map(a => a.x).slice(0, 25);
                    await filteredChannels.forEach(channel => {
                        var topic = (channel["topic"]) ? channel["topic"].match(/.{1,100}/g)[0] : "No topic.";
                        cData.push({
                            label: "#" + ((channel["id"] == message.channel.id) ? `${channel["name"]} (This channel)` : channel["name"]),
                            description: topic,
                            value: channel["id"]
                        });
                    });

                    var warning = (bigChannelSize) ? app.config.system.emotes.warning + "**You have more than the amount of channels we can show (25).** The list is random. If you do not see your desired channel, send `cancel` and rerun this command." : "";

                    await app.functions.msgHandler(msg, {
                        embeds: [{
                            title: `${app.config.system.emotes.question} Configure ${app.name} - Select Logging Channel`,
                            color: app.config.system.embedColors.purple,
                            description: "Sick! What channel are we going to be setting this up in?\n" + warning,
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

                        const cancelFilter = m => { if (m.user) return m.user.id === message.author.id };
                        const cancelCollector = message.channel.createMessageCollector({ filter: cancelFilter, time: 30000, errors: ["time"] });
                        cancelCollector.on("collect", async m => {
                            if (!m.content == "cancel") return;
                            collector.stop("cancelled by user");
                            cancelCollector.stop("cancelled by user");
                            m.react(app.config.system.emotes.success).catch(err => {});
                        });

                        collector.on("collect", async i => {
                            if (i.customId === "select" && i.values.length > 0) {
                                for (var v in i.values) {
                                    collector.stop("done");
                                    var channelID = i.values[v];
                                    await app.functions.msgHandler(msg, {
                                        embeds: [{
                                            title: `${app.config.system.emotes.wait} Configure ${app.name} - Logging Channel Saving`,
                                            color: app.config.system.embedColors.blue,
                                            description: "Fantastic! Saving your settings..."
                                        }],
                                        components: [],
                                        author: message.author
                                    }, 1, true, (async() => {
                                        const affectedRows = await app.DBs.serverSettings.update({
                                            [typeOfLog]: channelID
                                        }, { where: { serverID: message.guild.id } });
                                        if (affectedRows > 0) {
                                            await app.functions.msgHandler(msg, {
                                                embeds: [{
                                                    title: `${app.config.system.emotes.success} Configure ${app.name}`,
                                                    color: app.config.system.embedColors.lime,
                                                    description: `Woohoo! We're done here!\nYour selected logs is ready to go!`
                                                }],
                                                components: [],
                                                author: message.author
                                            }, 1, true);
                                        } else {
                                            new Error("Database saving failed!");
                                        };
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
                };



                async function collectJoinLeave() {
                    const filter = i => { return ["select"].includes(i.customId) && i.user.id === message.author.id };
                    const collector = message.channel.createMessageComponentCollector({ filter, time: 30000, errors: ["time"] });

                    const cancelFilter = m => { if (m.user) return m.user.id === message.author.id };
                    const cancelCollector = message.channel.createMessageCollector({ filter: cancelFilter, time: 30000, errors: ["time"] });
                    cancelCollector.on("collect", async m => {
                        if (!m.content == "cancel") return;
                        collector.stop("cancelled by user");
                        cancelCollector.stop("cancelled by user");
                        m.react(app.config.system.emotes.success).catch(err => {});
                    });

                    collector.on("collect", async i => {
                        if (i.customId === "select" && i.values.length > 0) {
                            for (var v in i.values) {
                                i.deferUpdate();
                                cancelCollector.stop("done");
                                collector.stop("done");
                                var val = i.values[v];

                                await app.functions.msgHandler(msg, {
                                    embeds: [{
                                        title: `${app.config.system.emotes.question} Configure ${app.name} - ${val.substr(0, 1).toUpperCase() + val.substr(1)} Message`,
                                        color: app.config.system.embedColors.purple,
                                        description: "Great! What should the " + val + " message be? Send `done` when done or if you like the current, send `next`.\nDefault: `" + defaults[val]["msg"] + "`",
                                        fields: [
                                            { name: "Variable Help", value: app.functions.getTypes.desc(val).join("\n") }
                                        ]
                                    }],
                                    components: [],
                                    author: message.author
                                }, 1, true, (async() => {

                                    const msgFilter = m => { return m.author.id === message.author.id };
                                    const msgCollector = message.channel.createMessageCollector({ msgFilter, time: 30000, errors: ["time"] });

                                    msgCollector.on("collect", async m => {
                                        if (m.content === "cancel") {
                                            msgCollector.stop("cancelled by user");
                                            m.react(app.config.system.emotes.success).catch(err => {});
                                        } else if (m.content == "next") {
                                            var tmpContent = JSON.parse(serverSettings.get("other")[val]) || { msg: defaults[val][msg], channel: null };
                                            if (tmpContent["msg"]) {
                                                msgCollector.stop("done");
                                                await collectJoinLeaveChannel(val, null);
                                                m.react(app.config.system.emotes.success).catch(err => {});
                                            } else m.react(app.config.system.emotes.error).catch(err => {});
                                        } else {
                                            msgCollector.stop("done");
                                            var tmpContent = { msg: m.content || defaults[val][msg], channel: null };
                                            await collectJoinLeaveChannel(val, tmpContent);
                                            m.react(app.config.system.emotes.success).catch(err => {});
                                        }
                                    });

                                    msgCollector.on("end", async(collected) => {
                                        if (collected.size < 1) {
                                            app.functions.msgHandler(msg, {
                                                embeds: msg.embeds || [],
                                                components: []
                                            }, 1, true);
                                        };
                                    })
                                }));
                            };
                        };
                    });
                };

                async function collectJoinLeaveChannel(evtType, evtData) {
                    if (!evtType) return;
                    if (!evtData) evtData = serverSettings.get("other")[evtType + "Channel"];
                    if (!evtData) return;

                    var cData = [];
                    var bigChannelSize = (message.guild.channels.cache.size > 25),
                        filteredChannels = await message.guild.channels.cache.filter(c => c.type == "GUILD_TEXT" || evtData["channel"] && c.id != evtData).map(x => ({ x, r: Math.random() })).sort((a, b) => a.r - b.r).map(a => a.x).slice(0, 25);
                    await filteredChannels.forEach(channel => {
                        var topic = (channel["topic"]) ? channel["topic"].match(/.{1,100}/g)[0] : "No topic.";
                        cData.push({
                            label: "#" + ((channel["id"] == message.channel.id) ? `${channel["name"]} (This channel)` : channel["name"]),
                            description: topic,
                            value: channel["id"]
                        });
                    });

                    var warning = (bigChannelSize) ? app.config.system.emotes.warning + "**You have more than the amount of channels we can show (25).** The list is random. If you do not see your desired channel, send `cancel` and rerun this command." : "";

                    await app.functions.msgHandler(msg, {
                        embeds: [{
                            title: `${app.config.system.emotes.question} Configure ${app.name} - Select ${evtType.substr(0, 1).toUpperCase() + evtType.substr(1)} Channel`,
                            color: app.config.system.embedColors.purple,
                            description: "Sick! What channel are we going to be setting this up in?\n" + warning,
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

                        const cancelFilter = m => { if (m.user) return m.user.id === message.author.id };
                        const cancelCollector = message.channel.createMessageCollector({ filter: cancelFilter, time: 30000, errors: ["time"] });
                        cancelCollector.on("collect", async m => {
                            if (!m.content == "cancel") return;
                            collector.stop("cancelled by user");
                            cancelCollector.stop("cancelled by user");
                            m.react(app.config.system.emotes.success).catch(err => {});
                        });

                        collector.on("collect", async i => {
                            if (i.customId === "select" && i.values.length > 0) {
                                for (var v in i.values) {
                                    collector.stop("cancelled by user");
                                    cancelCollector.stop("cancelled by user");
                                    var channelID = i.values[v];
                                    await app.functions.msgHandler(msg, {
                                        embeds: [{
                                            title: `${app.config.system.emotes.wait} Configure ${app.name} - ${evtType.substr(0, 1).toUpperCase() + evtType.substr(1)} Saving`,
                                            color: app.config.system.embedColors.blue,
                                            description: "Fantastic! Saving your settings..."
                                        }],
                                        components: [],
                                        author: message.author
                                    }, 1, true, (async() => {
                                        var data = { join: { msg: defaults["join"]["msg"], channel: null }, leave: { msg: defaults["leave"]["msg"], channel: null } };
                                        if (serverSettings.get("other"))
                                            data = JSON.parse(serverSettings.get("other"))
                                        data[evtType] = {
                                            msg: evtData["msg"],
                                            channel: channelID
                                        };

                                        const affectedRows = await app.DBs.serverSettings.update({
                                            other: JSON.stringify(data, null, "\t")
                                        }, { where: { serverID: message.guild.id } });
                                        if (affectedRows > 0) {
                                            await app.functions.msgHandler(msg, {
                                                embeds: [{
                                                    title: `${app.config.system.emotes.success} Configure ${app.name}`,
                                                    color: app.config.system.embedColors.lime,
                                                    description: `Woohoo! We're done here!\nYour ${evtType} message & channel are both ready to go!`
                                                }],
                                                components: [],
                                                author: message.author
                                            }, 1, true);
                                        } else {
                                            new Error("Database saving failed!");
                                        };
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
                };


            } catch (Ex) {
                app.functions.msgHandler(msg, {
                    embeds: [{
                        author: { name: `Something happened, ${message.author.tag}!`, icon_url: message.author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }) },
                        title: `${app.config.system.emotes.information} Configure ${app.name} - Unexpected Error`,
                        color: app.config.system.embedColors.red,
                        description: `Sadly, we ran into an error while setting up your reaction roles. Here's what we know: ${Ex.message}`
                    }]
                });
            };
        }));

    }
};