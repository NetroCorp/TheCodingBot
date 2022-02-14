module.exports = {
    name: "profile",
    description: "It's all about you - update, opt-out, delete, and more on your profile!",
    guildOnly: false,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["DEFAULT"],
    cooldown: 2,
    aliases: [],
    syntax: [],
    execute: async(app, message, args) => {

        const { MessageActionRow, MessageButton, MessageSelectMenu } = app.modules["discord.js"];

        var userSettings = await app.DBs.userSettings.findOne({ where: { userID: message.author.id } });

        app.functions.msgHandler(message, {
            embeds: [{
                title: app.config.system.emotes.wait + " **Loading**",
                color: app.config.system.embedColors.blue
            }]
        }, 0, true, (async msg => {
            try {
                if (!userSettings) throw new Error("No profile in database"); // How did they even do this command?
                app.functions.msgHandler(msg, {
                    embeds: [{
                        author: { name: `Welcome, ${message.author.tag}!`, icon_url: message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) },
                        title: `${app.config.system.emotes.information} It's all about you!`,
                        color: app.config.system.embedColors.lime,
                        fields: [
                            { name: "Your User Information", value: "** **" },
                            { name: "Language", value: userSettings.get("language") || "English", inline: true },
                            { name: "Prefix", value: userSettings.get("prefix") || app.config.system.defaultPrefix || "Error", inline: true },
                            { name: "Your User Statistics", value: "** **" },
                            { name: "Total Commands Executed", value: userSettings.get("executedCommands").toString() || "0", inline: true },
                            { name: "Total Commands Errored", value: userSettings.get("errorCommands").toString() || "0", inline: true }
                        ]
                    }],
                    components: [new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                            .setCustomId("cfgsettings")
                            .setLabel("Change Settings")
                            .setStyle("SECONDARY"),
                            new MessageButton()
                            .setCustomId(((userSettings.get("optedOut")) ? "optin" : "optout"))
                            .setLabel("Opt-" + ((userSettings.get("optedOut")) ? "in to" : "out of") + " analytics")
                            .setStyle("SECONDARY"),
                            new MessageButton()
                            .setCustomId("delete")
                            .setLabel("Delete profile")
                            .setStyle("DANGER")
                        )
                    ]
                }, 1, true, (async msg => {
                    await collectmenu1(msg);
                }));
            } catch (Ex) {
                app.functions.msgHandler(msg, {
                    embeds: [{
                        author: { name: `Something happened, ${message.author.tag}!`, icon_url: message.author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }) },
                        title: `${app.config.system.emotes.information} It's all about you!`,
                        color: app.config.system.embedColors.red,
                        description: `Sadly, we ran into an error while handling your profile. Here's what we know: ${Ex.message}`
                    }]
                })
            }
        }));



        // FUNCTIONS
        async function errorDB(i, title) {
            await i.update({
                embeds: [{
                    author: { name: `Eep! Sorry about that, ${message.author.tag}!`, icon_url: message.author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }) },
                    title: `${app.config.system.emotes.warning} User Settings - ${title}`,
                    color: app.config.system.embedColors.orange,
                    description: "Could not save your acknowledgement. Please try again.",
                }],
                components: []
            }).catch(err => {});
        };

        async function collectmenu1(msg) {
            const filter = i => { return ["cfgsettings", "optout", "optin", "delete"].includes(i.customId) && i.user.id === message.author.id };

            const collector = message.channel.createMessageComponentCollector({ filter, max: 1, dispose: true, time: 10000, errors: ["time"] });

            collector.on("collect", async i => {
                if (i.customId === "cfgsettings") {
                    i.deferUpdate();
                    await app.functions.msgHandler(msg, {
                        embeds: [{
                            author: { name: `Change change change, ${message.author.tag}!`, icon_url: message.author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }) },
                            title: `${app.config.system.emotes.question} User Settings - Change Settings`,
                            color: app.config.system.embedColors.purple,
                            description: "Alright - from the dropdown - what do you wish to change?"
                        }],
                        components: [new MessageActionRow()
                            .addComponents(
                                new MessageSelectMenu()
                                .setCustomId("select")
                                .setPlaceholder("Nothing selected")
                                .addOptions([{
                                        label: "Language",
                                        description: "Change your language from a list of supported languages!",
                                        value: "language",
                                    },
                                    {
                                        label: "Prefix",
                                        description: `Maybe you don't want '${userSettings.get("prefix")}' anymore.`,
                                        value: "prefix",
                                    },
                                ]),
                            )
                        ]
                    }, 1, true, (async menumsg => {
                        await collectmenu2(menumsg);
                    }));
                } else if (i.customId === "optout" || i.customId === "optin") {
                    var type = i.customId === "optout" ? "Opt-Out" : "Opt-In";
                    const affectedRows = await app.DBs.userSettings.update({ optedOut: (i.customId === "optout") }, { where: { userID: message.author.id } });
                    if (affectedRows > 0) {
                        await i.update({
                            embeds: [{
                                author: { name: `At your request, ${message.author.tag}!`, icon_url: message.author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }) },
                                title: `${app.config.system.emotes.success} User Settings - ${type}`,
                                color: app.config.system.embedColors.lime,
                                description: `Here's what just happened: You successfully ${((i.customId === "optout") ? "dis" : "en")}abled analytics.`,
                            }],
                            components: []
                        });
                        app.logger.info("DISCORD", `[MESSAGE] ${message.author.id} opted out.`);
                    } else {
                        errorDB(i, type);
                    };
                } else if (i.customId === "delete") {
                    const affectedRows = await app.functions.DB.deleteUser(message.author.id);
                    if (affectedRows > 0) {
                        await i.update({
                            embeds: [{
                                author: { name: `We're sad to see you go, ${message.author.tag}!`, icon_url: message.author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }) },

                                title: `${app.config.system.emotes.success} User Settings - Delete Account`,
                                color: app.config.system.embedColors.lime,
                                description: "Here's what just happened: You successfully deleted your account.",
                            }],
                            components: []
                        });
                        app.logger.info("DISCORD", `[MESSAGE] ${message.author.id} deleted their account.`);
                    } else {
                        errorDB(i, "Delete Account");
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

        async function collectmenu2(msg) {
            const filter = i => { return ["select"].includes(i.customId) && i.user.id === message.author.id };
            const collector = message.channel.createMessageComponentCollector({ filter, max: 1, time: 30000, errors: ["time"] });

            collector.on("collect", async i => {
                if (i.customId === "select" && i.values.length > 0) {
                    i.deferUpdate();
                    for (var v in i.values) {
                        var val = i.values[v];
                        if (val === "language") {
                            await app.functions.msgHandler(msg, {
                                embeds: [{
                                    author: { name: `Change change change, ${message.author.tag}!`, icon_url: message.author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }) },
                                    title: `${app.config.system.emotes.question} User Settings - Change Language`,
                                    color: app.config.system.embedColors.purple,
                                    description: "Neat, choose from the dropdown your new language!"
                                }],
                                components: [new MessageActionRow()
                                    .addComponents(
                                        new MessageSelectMenu()
                                        .setCustomId("select")
                                        .setPlaceholder("Nothing selected")
                                        .addOptions([{
                                            label: "English (en_US)",
                                            description: "English - United States",
                                            value: "en_US",
                                        }]),
                                    )
                                ]
                            }, 1, true, (async menumsg => {
                                await collectLanguage(menumsg);

                            }));
                        } else if (val == "prefix") {
                            await app.functions.msgHandler(msg, {
                                embeds: [{
                                    author: { name: `Change change change, ${message.author.tag}!`, icon_url: message.author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }) },
                                    title: `${app.config.system.emotes.question} User Settings - Change Prefix`,
                                    color: app.config.system.embedColors.purple,
                                    description: "Great! What should that new prefix be?\n*NOTE: If you enter a space, it will only take the first part before the space). Example: `a prefix` -> `a`*"
                                }],
                                components: []
                            }, 1, true, (async menumsg => {
                                await collectPrefix(menumsg);

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
        };

        async function collectLanguage(msg) {
            const filter = i => { return ["select"].includes(i.customId) && i.user.id === message.author.id };
            const collector = message.channel.createMessageComponentCollector({ filter, max: 1, time: 30000, errors: ["time"] });

            collector.on("collect", async i => {
                if (i.customId === "select" && i.values.length > 0) {
                    for (var v in i.values) {
                        var val = i.values[v];
                        if (val === "en_US") {
                            var newLang = msg.components[0]["components"][0]["options"][v]["label"]
                            const affectedRows = await app.DBs.userSettings.update({ language: newLang }, { where: { userID: message.author.id } });

                            if (affectedRows > 0) {
                                await i.update({
                                    embeds: [{
                                        author: { name: `Whoop whoop, ${message.author.tag}!`, icon_url: message.author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }) },

                                        title: `${app.config.system.emotes.success} User Settings - Change Language`,
                                        color: app.config.system.embedColors.lime,
                                        description: `Here's what just happened: You successfully changed your language to \`${newLang}\`.`
                                    }],
                                    components: []
                                });
                                app.logger.info("DISCORD", `[MESSAGE] ${message.author.id} changed their language.`);
                            } else {
                                errorDB(i, "Change Language");
                            };
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
        };

        async function collectPrefix(msg) {
            const filter = m => { return m.author.id === message.author.id };
            const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000, errors: ["time"] });

            collector.on("collect", async m => {
                if (m.content != userSettings.get("prefix")) {
                    var newPrefix = m.content.split(" ")[0];
                    const affectedRows = await app.DBs.userSettings.update({ prefix: newPrefix }, { where: { userID: message.author.id } });

                    if (affectedRows > 0) {
                        await app.functions.msgHandler(msg, {
                            embeds: [{
                                author: { name: `Whoop whoop, ${message.author.tag}!`, icon_url: message.author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }) },

                                title: `${app.config.system.emotes.success} User Settings - Change Prefix`,
                                color: app.config.system.embedColors.lime,
                                description: `Here's what just happened: You successfully changed your prefix to \`${newPrefix}\`.`
                            }],
                            components: []
                        }, 1, true);
                        app.logger.info("DISCORD", `[MESSAGE] ${message.author.id} changed their prefix.`);
                    } else {
                        errorDB(i, "Change Prefix");
                    };
                }
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
    }
};