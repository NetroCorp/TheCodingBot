module.exports = {
    name: "verify",
    description: "Verify yo self!",
    guildOnly: true,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["DEFAULT"],
    cooldown: 10,
    aliases: ["letmein"],
    syntax: [" <--channel:#channelORID> <--role:<@&role>ORID>"],
    execute: async(app, message, args) => {
        if (args[0] == "setup") {
            // Setting up a server for verification :O

            app.functions.msgHandler(message, {
                embeds: [{
                    title: `${app.config.system.emotes.wait} Preparing`,
                    color: app.config.system.embedColors.blue,
                    description: "Hello! We're loading the verification set up. Please wait."
                }],
                author: message.author
            }, 0, true, (async msg => {
                if (message.member.permissions.has("MANAGE_GUILD")) {
                    // Permission checks out, let's-a-go!

                    var parameters = await app.functions.getParameters(args.slice(0), "--");
                    if (parameters.length < 2 ||
                        !app.functions.doesArrayStartsWith("channel:", parameters) ||
                        !app.functions.doesArrayStartsWith("role:", parameters)
                    ) return app.functions.msgHandler(msg, {
                        embeds: [{
                            title: `${app.config.system.emotes.error} Missing Parameters`,
                            color: app.config.system.embedColors.red,
                            description: "You're missing `--channel:#channelORID` and/or `--role:<@&role>ORID`.\n" + ((parameters.length > 0) ? "Got parameters: `" + parameters.join("`, `") + "`" : "Got no parameters!")
                        }],
                        author: message.author
                    }, 1, true);
                    try {
                        var sParameters = {};
                        for (var i = 0; i < parameters.length; i++) {
                            var sTemp = parameters[i].split(":");
                            sParameters[sTemp[0]] = app.functions.getID(sTemp[1]) || sTemp[1];
                        };

                        var channel = message.guild.channels.cache.get(sParameters["channel"]);
                        if (!channel) throw new Error("UNKNOWN_CHANNEL");
                        var role = message.guild.roles.cache.get(sParameters["role"]);
                        if (!role) throw new Error("UNKNOWN_ROLE");

                        if (channel.type != "GUILD_TEXT") throw new Error("CHANNEL_NOT_PERMITTED")

                        await app.functions.msgHandler(msg, {
                            embeds: [{
                                title: `${app.config.system.emotes.wait} Configuring Verification...`,
                                color: app.config.system.embedColors.blue,
                                description: `Setting up verification with the following information:\n - **Role to give**: ${role.name}\n - **Channel to verify in**: #${channel.name} (<#${channel.id}>)`
                            }],
                            author: message.author
                        }, 1, true);

                        const affectedRows = await app.DBs.serverSettings.update({ verification: JSON.stringify(sParameters, null, "\t") }, { where: { serverID: message.guild.id } });
                        if (affectedRows > 0) {
                            await app.functions.msgHandler(msg, {
                                embeds: [{
                                    title: `${app.config.system.emotes.success} Configured Verification!`,
                                    color: app.config.system.embedColors.lime,
                                    description: `Great news! Verification is now setup!\nNow, go tell them newcomers to verify in ${channel.name} (<#${channel.id}>)!`
                                }],
                                author: message.author
                            }, 1, true);
                        } else {
                            throw new Error("Failed to save to database");
                        };

                    } catch (Ex) {
                        if (Ex.message == "UNKNOWN_CHANNEL" || Ex.message == "UNKNOWN_ROLE") {
                            var type = Ex.message.split("UNKNOWN_")[1].toLowerCase();
                            return app.functions.msgHandler(msg, {
                                embeds: [{
                                    title: `${app.config.system.emotes.error} Unknown ${type.replace(/^./, str => str.toUpperCase())}!`,
                                    color: app.config.system.embedColors.red,
                                    description: `Whoopsie! That ${type} does not exist!`,
                                    fields: [
                                        { name: "Here's what to do", value: " -> Please ensure you typed the name correctly and that it does exist.\n -> Please also verify that I have permissions to check its existence.\n -> Please try your request again" }
                                    ]
                                }],
                                author: message.author
                            }, 1, true);
                        } else if (Ex.message == "CHANNEL_NOT_PERMITTED")
                            return app.functions.msgHandler(msg, {
                                embeds: [{
                                    title: `${app.config.system.emotes.error} That doesn't look right...`,
                                    color: app.config.system.embedColors.red,
                                    description: `Here's what just happened: The channel specified cannot be used for verification.`,
                                    fields: [
                                        { name: "Here's what to do", value: " -> Please ensure that the channel you provided is a text channel - not a stage or voice channel.\n -> Please try your request again" }
                                    ]
                                }],
                                author: message.author
                            }, 1, true);
                        else
                            return app.functions.msgHandler(msg, {
                                embeds: [{
                                    title: `${app.config.system.emotes.error} Whoopsie! Something went wrong!`,
                                    color: app.config.system.embedColors.red,
                                    description: `Here's what just happened: ${Ex.message}`,
                                    fields: [
                                        { name: "Here's what to do", value: " -> Please try your request again" }
                                    ]
                                }],
                                author: message.author
                            }, 1, true);
                    };
                } else {
                    return app.functions.missingPerms(msg, 1, "configure verification on this server");
                }
            }));
        } else { // Do the verification here.
            message.delete().catch(err => {}); // Try to delete message, don't do anything if we can't.

            var verificationData = await app.DBs.verification.findOne({ where: { serverID: message.guild.id, userID: message.author.id } });
            app.functions.msgHandler(message, {
                embeds: [{
                    title: `${app.config.system.emotes.wait} Preparing to verify you...`,
                    color: app.config.system.embedColors.blue,
                    description: "Looking for you (in the database)..."
                }],
                author: message.author
            }, 0, false, (async msg => {
                async function errorDB(msg, Ex) {
                    var messages = {
                        "VERIFY_NOT_SETUP": ["Verification is not set up in this server", " -> Contact a Staff member"],
                        "ROLE_NOT_EXIST": ["The verified role does not exist", " -> Contact a Staff member"],
                        "CHANNEL_NOT_EXIST": ["The verification channel does not exist", " -> Contact a Staff member"],
                        "ALREADY_VERIFY": ["You have already been verified", " -> Contact a Staff member"],
                        "NOT_VERIFY_CHANNEL": ["This channel is not the verification channel", " -> Go to the correct channel\n -> If in correct channel, contact a Staff member"],
                        "DEFAULT": [Ex.message, " -> Please try your request again"]
                    };

                    await app.functions.msgHandler(msg, {
                        embeds: [{
                            author: { name: `Eep! Sorry about that, ${app.functions.pomeloHandler(message.author)}!`, icon_url: message.author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }) },
                            title: `${app.config.system.emotes.warning} Verification failed!`,
                            color: app.config.system.embedColors.orange,
                            description: `Here's what just happened: ${messages[Ex.message] ? messages[Ex.message][0] : messages["DEFAULT"][0]}.`,
                            fields: [{
                                name: "Here's what to do",
                                value: messages[Ex.message] ? messages[Ex.message][1] : messages["DEFAULT"][1]
                            }]
                        }],
                        components: []
                    }, 1, false, (async msgC => { setTimeout(function() { msgC.delete().catch(err => {}); }, 10000); })).catch(err => {});
                    app.logger.error("DISCORD", `[MESSAGE] Verification for ${message.author.id} failed! Error: ${Ex.stack}`);
                };

                try {

                    if (verificationData) try { await app.functions.DB.deleteVerification(message.guild.id, message.author.id); } catch (Ex) {};
                    var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: message.guild.id } });
                    var verificationSettings = serverSettings.get("verification");
                    if (!verificationSettings) throw new Error("VERIFY_NOT_SETUP");
                    verificationSettings = JSON.parse(verificationSettings);

                    if (!verificationSettings["channel"] || message.channel.id != verificationSettings["channel"]) throw new Error("NOT_VERIFY_CHANNEL");
                    if (!verificationSettings["role"] || !message.guild.roles.cache.get(verificationSettings["role"])) throw new Error("ROLE_NOT_EXIST");

                    if (message.member.roles.cache.has(verificationSettings["role"])) throw new Error("ALREADY_VERIFY");

                    // DM-ing is kinda broken, so we're just editing in the channel for right now.
                    var codeGen = app.functions.generateRandomCode(8);

                    await app.functions.DB.createVerification(message.guild.id, message.author.id, msg.id, codeGen);
                    return app.functions.msgHandler(msg, {
                        embeds: [{
                            title: `${app.config.system.emotes.information} Welcome to the server!`,
                            color: app.config.system.embedColors.blue,
                            fields: [
                                { name: `Welcome to ${message.guild.name}!`, value: "Ah, a newcomer! How fun!\nPlease ensure to read the server rules." },
                                { name: "Okay, enough talk.", value: `Your code is: \`${codeGen}\`.\nYour next message should be the code.` },
                            ]
                        }],
                        author: message.author
                    }, 1, false, (async msg => {
                        await collectVerificationCode(codeGen, msg);
                    }));
                } catch (Ex) {
                    return errorDB(msg, Ex);
                };



                // FUNCTIONS
                async function collectVerificationCode(codeGen, msg) {
                    const filter = m => { return m.channel.id === message.channel.id && m.author.id === message.author.id };
                    const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000, errors: ["time", "max"] });

                    collector.on("collect", async m => {
                        if (m.content == codeGen) {
                            try {
                                // collector.dispose();
                                m.delete().catch(err => {});
                                try { await app.functions.DB.deleteVerification(message.guild.id, message.author.id); } catch (Ex) {};
                                if (verificationData) try { await app.functions.DB.deleteVerification(message.guild.id, message.author.id); } catch (Ex) {};
                                var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: message.guild.id } });
                                var verificationSettings = serverSettings.get("verification");
                                if (!verificationSettings) throw new Error("VERIFY_NOT_SETUP");
                                verificationSettings = JSON.parse(verificationSettings);

                                if (!verificationSettings["channel"] || message.channel.id != verificationSettings["channel"]) throw new Error("NOT_VERIFY_CHANNEL");
                                if (!verificationSettings["role"] || !message.guild.roles.cache.get(verificationSettings["role"])) throw new Error("ROLE_NOT_EXIST");

                                if (message.member.roles.cache.has(verificationSettings["role"])) throw new Error("ALREADY_VERIFY");

                                message.member.roles.add(verificationSettings["role"]).catch(err => { throw new Error(err); });

                                await app.functions.msgHandler(msg, {
                                    embeds: [{
                                        author: { name: `Whoop whoop, ${app.functions.pomeloHandler(message.author)}!`, icon_url: message.author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }) },
                                        title: `${app.config.system.emotes.success} Verified!`,
                                        color: app.config.system.embedColors.lime,
                                        description: `Here's what just happened: You successfully verified!\nHave fun and enjoy your stay!`
                                    }],
                                    components: []
                                }, 1, false, (async msgC => { setTimeout(function() { msgC.delete().catch(err => {}); }, 10000); })).catch(err => {});
                                app.logger.info("DISCORD", `[MESSAGE] ${message.author.id} sucessfully verified.`);

                            } catch (Ex) {
                                errorDB(msg, Ex);
                            }
                        } else {
                            m.react(app.config.system.emotes.error).catch(err => {});
                        }
                    });

                    collector.on("end", async(collected) => {
                        var codeEnteredGood = collected.map(x => x.content == codeGen);
                        if (!codeEnteredGood[0]) return errorDB(msg, new Error(`You did not enter the code ${((collected.size < 1) ? "in time" : "correctly")}`));
                    });
                };
            }));
        }
    }
};