/*
	THECODINGBOT v5 APP
	Created 6/24/2021
*/



const app = {
    name: "TheCodingBot",
    shortName: "TCB",

    version: {
        major: 5,
        minor: 0,
        revision: 0,
        buildType: "A",
        toString: function() {
            var major = app.version.major,
                minor = app.version.minor,
                revision = app.version.revision;
            return major + "." + minor + "." + revision;
        },
        toBuildString: function() {
            var buildType = app.version.buildType;
            if (buildType == "A")
                buildType = "ALPHA";
            else if (buildType == "B")
                buildType = "BETA";
            else if (buildType == "R")
                buildType = "RELEASE";

            return buildType;
        },
        toFullString: function() {
            return app.version.toString() + " " + app.version.toBuildString();
        }
    },

    functions: {
        DB: {
            createUser: async function(id) {
                const userSetting = await app.DBs.userSettings.create({
                    userID: id,
                    prefix: "tB/",
                    language: "English",
                    acceptedEULA: false,
                    executedCommands: 0,
                    errorCommands: 0,
                    optedOut: false
                });
                app.logger.success("DB", `User data for ${id} created in database!`);

                return userSetting;
            },
            deleteUser: async function(id) {
                const userSetting = await app.DBs.userSettings.destroy({ where: { userID: id } });
                app.logger.warn("DB", `User data for ${id} removed from database!`);

                return userSetting;
            },
            createServer: async function(id) {
                const serverSetting = await app.DBs.serverSettings.create({
                    serverID: id,
                    loggingDeleteChannel: null,
                    loggingEditChannel: null,
                    loggingJoinChannel: null,
                    loggingLeaveChannel: null
                });
                app.logger.success("DB", `Server data for ${id} created in database!`);

                return serverSetting;
            },
            deleteServer: async function(id) {
                const serverSetting = await app.DBs.serverSettings.destroy({ where: { serverID: id } });
                app.logger.warn("DB", `Server data for ${id} removed from database!`);

                return serverSetting;
            }
        },

        sleep: function(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        ErrorHandler: function(app, userSettings, message, command, err, type) {
            var embedTitle = (type == "error") ? app.config.system.emotes.error + " **Error!**" : app.config.system.emotes.warning + " **Warning!**";
            var embedColor = (type == "error") ? app.config.system.embedColors.red : app.config.system.embedColors.yellow;

            var data = {};
            if ((err.message) ? err.message.includes("Command not found") : err.includes("Command not found"))
                data = {
                    embeds: [{
                        title: embedTitle,
                        color: embedColor,
                        description: `Command \`${((command.name) ? command.name : command)}\` was not found!`,
                        fields: [
                            { name: "Lost?", value: `You should check out the \`${userSettings.get("prefix")}help\`` }
                        ],
                        footer: { text: app.config.system.footerText }
                    }]
                }
            else {
                data = {
                    embeds: [{
                        title: embedTitle,
                        color: embedColor,
                        description: `Failed to execute \`${((command.name) ? command.name : command)}\`!`,
                        fields: [
                            { name: "Error Details", value: "```" + ((err.message) ? "js\n" + err.message : err) + "```" }

                        ],
                        footer: { text: app.config.system.footerText }
                    }]
                };
                if (err.stack) {
                    data.embeds[0].fields.push({ name: "Stacktrace", value: "```js\n" + err.stack + "```" });
                    userSettings.update({ executedCommands: (userSettings.get('errorCommands') + 1) }, { where: { userID: message.author.id } });
                };
            };

            app.functions.msgHandler(message, data, 0, true);
            console.log(err);
            return;
        },

        getTicks: () => { return ((new Date().getTime() * 10000) + 621355968000000000); },

        convertTimestamp: function(unix_timestamp, getDate, bigHour = false) {
            var date = new Date(unix_timestamp * 1); // Create Date from timestamp

            var hours = date.getHours(); // Hours part from the timestamp
            var minutes = "0" + date.getMinutes(); // Minutes part from the timestamp
            var seconds = "0" + date.getSeconds(); // Seconds part from the timestamp

            // Will display time in hh:mm:ss format
            var formattedTime = ((bigHour) ? ((hours > 12) ? (hours - 12) : (hours == 0) ? 12 : hours) : hours) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + ((bigHour) ? ((hours < 12) ? " AM" : " PM") : "");

            if (getDate) {
                var dd = String(date.getDate()).padStart(2, '0'),
                    mm = String(date.getMonth() + 1).padStart(2, '0'), //January is 0!
                    yyyy = date.getFullYear();
                formattedTime = mm + '/' + dd + '/' + yyyy + ' ' + formattedTime;
            };

            // Return that bad boy
            return formattedTime;
        },

        clearCache: function(module) {
            if (module == null)
                Object.keys(require.cache).forEach(function(key) { delete require.cache[key] });
            else
                delete require.cache[module];
        },

        removeItemAll: function(arr, value) {
            var i = 0;
            while (i < arr.length)
                if (arr[i] === value) arr.splice(i, 1);
                else ++i;
            return arr;
        },

        RPSSystem: function(app, action) {
            if (app.client == undefined) { return "RPS failed to attach to client! Create Discord Client first." } else if (app.config == undefined) { return "RPS failed to attach to client: Missing config data."; };

            if (action == "start") {
                if (app.config.system.rotatingStatus.enabled) {
                    if (app.RPS != undefined && app.RPS != null) {
                        if (!app.RPS.running) {
                            app.RPS.running = true;
                            app.RPS.intervalSystem = setInterval(function() {
                                app.functions.RPSSystem(app, "update");
                            }, (app.config.system.rotatingStatus.timeInSec * 1000));
                            app.client.user.setActivity("RPS: RPS v" + app.RPS.version + " for " + app.name + ", READY.");

                            setTimeout(function() {
                                app.client.user.setActivity("RPS: Loaded " + app.config.system.rotatingStatus.statuses.length + " statuses!");
                                setTimeout(function() {
                                    app.functions.RPSSystem(app, "update");
                                }, 2500);
                            }, 2500);
                        } else {
                            return "RPS already started: call RPSUpdate(client, \"stop\")";
                        };
                    } else {
                        return "RPS not ready: call RPSUpdate(client, \"init\")";
                    };
                };
            } else if (action == "update") {
                if (app.RPS != undefined && app.RPS != null) {
                    if (app.RPS.running && app.config.system.rotatingStatus.enabled) {
                        var playingstatusarr = app.config.system.rotatingStatus.statuses;
                        var playingstatus = playingstatusarr[Math.floor(Math.random() * playingstatusarr.length)];

                        if (playingstatus.includes("svrcount")) playingstatus = "Playing on " + app.client.guilds.cache.size + " servers!";
                        else if (playingstatus.includes("ver")) playingstatus = `Playing on ${app.version.toFullString()}.`;

                        var playingtype = playingstatus.split(" ")[0];

                        if (playingstatus.startsWith("Listening to")) playingstatus = playingstatus.replace("Listening to ", "");
                        else playingstatus = playingstatus.replace(playingtype + " ", "");

                        app.client.user.setActivity(playingstatus, { type: playingtype.toUpperCase() });
                        return playingtype + " - " + playingstatus;
                    } else {
                        return "RPS not started or disabled: call RPSUpdate(client, \"start\")";
                    };
                } else {
                    return "RPS not ready: call RPSUpdate(client, \"init\")";
                };
            } else if (action == "stop") {
                if (app.RPS != undefined && app.RPS != null) {
                    if (app.RPS.running) {
                        app.RPS.running = false;
                        clearInterval(app.RPS.intervalSystem);
                    } else {
                        return "RPS not started: call RPSUpdate(client, \"start\")";
                    };
                } else {
                    return "RPS not ready: not even initialized!";
                };
            } else if (action == "init") {
                if (app.RPS == undefined || app.RPS == null) {
                    if (app.config.system.rotatingStatus.enabled) {
                        app.RPS = {
                            "running": false,
                            "lastUpdate": 0,
                            "lastStatus": "",
                            "intervalSystem": null,
                            "version": "1.0.0"
                        };
                    } else {
                        return "RPS fail to init: RPS has been disabled.";
                    };
                } else {
                    return "RPS already started: call RPSUpdate(client, \"destroy\")";
                };
            } else if (action == "destroy") {
                if (app.RPS != undefined && app.RPS != null) {
                    if (app.RPS.running) {
                        app.functions.RPSSystem(app, "stop");
                    };

                    app.RPS = null;
                } else {
                    return "RPS not ready: not even initialized!";
                };
            } else {
                return "The RPS SYSTEM is confused on what you told it to do.";
            };
        },

        msgHandler: async function(message, options, action = 0, doReply = false, callback = null) { // action: 0 = Send, 1 = Edit
            if (action == 0) {
                if (doReply) options["reply"] = { messageReference: message.id };
                message.channel.send(options).then(msg => { if (callback != null) callback(msg); });
            } else if (action == 1)
                message.edit(options).then(msg => { if (callback != null) callback(msg); });
        },

        RemoveReactions: function(app, msg) {
            msg.reactions.removeAll().catch(error => {
                app.logger.error("DISCORD", "Could not remove ALL reactions due to " + error);
                app.functions.msgHandler(msg, {
                    embeds: [{
                        color: app.config.system.embedColors.red,
                        description: "Failed to remove all reactions! Will attempt to remove my reactions only...",
                        footer: { text: app.config.system.footerText }
                    }]
                }, 0, true, (async m => {
                    var myID = app.client.user.id;
                    var userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(myID));
                    try {
                        for (const reaction of userReactions.values()) await reaction.users.remove(myID);
                        m.delete();
                    } catch (err) {
                        app.functions.msgHandler(m, {
                            embeds: [{
                                color: app.config.system.embedColors.red,
                                description: "Failed to remove my reactions! well, that's an F.",
                                footer: { text: app.config.system.footerText }
                            }]
                        }, 1, true);
                        app.logger.error("DISCORD", "Could not remove my reactions due to " + err);
                    };
                }));
            });
        }
    },

    dependencies: [
        { name: "fs", required: true },
        { name: "path", required: true },
        { name: "util", required: true },
        { name: "node-fetch", required: true },
        { name: "discord.js", required: true },
        { name: "sequelize", required: true },
        { name: "http", required: false },
        { name: "canvas", required: false }
    ]
}

module.exports = app;