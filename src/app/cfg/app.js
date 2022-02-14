/*
	THECODINGBOT v5
	App
	6/24/2021

	https://tcb.nekos.tech/source
	https://themattchannel.com
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
            if (buildType == "A") buildType = "ALPHA";
            else if (buildType == "B") buildType = "BETA";
            else if (buildType == "R") buildType = "RELEASE";

            return buildType;
        },
        toFullString: function() {
            return app.version.toString() + " " + app.version.toBuildString();
        }
    },

    types: {
        channels: {
            GUILD_TEXT: "Text Channel",
            GUILD_VOICE: "Voice Channel",
            GUILD_CATEGORY: "Category",
            GUILD_NEWS: "News Channel",
            GUILD_STAGE_VOICE: "Stage Channel"
        }
    },

    functions: {
        sleep: function(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        getTicks: () => { return ((new Date().getTime() * 10000) + 621355968000000000); },

        TStoHR: function(TS) {
            let totalSeconds = (TS / 1000);
            let days = Math.floor(totalSeconds / 86400);
            totalSeconds %= 86400;
            let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = totalSeconds % 60;
            let HR = `${days} days, ${hours} hours, ${minutes} minutes and ${Math.round(seconds)} seconds`;

            if (days == 0) HR = HR.replace(days + " days, ", "");
            else if (days == 1) HR = HR.replace("days", "day");

            if (hours == 0) HR = HR.replace(hours + " hours, ", "");
            else if (hours == 1) HR = HR.replace("hours", "hour");

            if (minutes == 0) HR = HR.replace(minutes + " minutes and ", "");
            else if (minutes == 1) HR = HR.replace("minutes", "minute");

            if (Math.round(seconds) == 1) HR = HR.replace("seconds", "second");

            return HR;
        },
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
            },

            createVerification: async function(serverID, userID, messageID, codeGenerated) {
                const verificationSetting = await app.DBs.verification.create({
                    serverID: serverID,
                    userID: userID,
                    messageID: messageID,
                    userCode: codeGenerated
                });
                app.logger.success("DB", `Verification started for ${userID} in ${serverID} with code ${codeGenerated}!`);

                return verificationSetting;
            },
            deleteVerification: async function(serverID, userID) {
                const verificationSetting = await app.DBs.verification.destroy({ where: { userID: userID, serverID: serverID } });
                app.logger.warn("DB", `Verification data for ${userID} in ${serverID} removed from database!`);

                return verificationSetting;
            }
        },
        downloadAttachments: async function(message, attachments) {
            if (app.client.waitingForMessageToDelete == undefined) app.client.waitingForMessageToDelete = [];

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
        },

        hasPermissions: function(message, command) {
            return (command.permissions == "DEFAULT" ||
                message.channel.type.toLowerCase() == "dm" && command.guildOnly ||
                command.permissions == "BOT_OWNER" && app.config.system.owners.includes(message.author.id) ||
                app.config.system.owners.includes(message.author.id) && app.client.bypassEnabled ||
                command.permissions != "BOT_OWNER" && message.member.permissions.has(command.permissions))
        },

        missingPerms: function(message, edit, cantdo, command) { // 0 = Send, 1 = Edit
            var lackedPerms = [];
            if (command) {
                for (var i = 0; i < command.permissions.length; i++) {
                    permission = command.permissions[i];
                    if (permission == "BOT_OWNER" ||
                        permission == "DEFAULT"
                    )
                        lackedPerms.push("`" + permission + "`");
                    else if (!message.member.permissions.has(permission))
                        lackedPerms.push("`" + permission + "`");
                };

                lackedPerms = lackedPerms.join(", ");
                app.logger.info("DISCORD", `[MESSAGE] Return ${message.author.id} lacking ${lackedPerms}`);
            } else lackedPerms = "permission";

            return app.functions.msgHandler(message, {
                embeds: [{
                    title: `${app.config.system.emotes.error} **Missing Permissions**`,
                    color: app.config.system.embedColors.red,
                    description: `You're lacking ${lackedPerms} to ${cantdo}.\nSorry about that...`,
                }]
            }, edit, true);
        },
        msgHandler: async function(message, options, action = 0, doReply = false, callback = null) { // action: 0 = Send, 1 = Edit
            if (options.embeds) {
                if (options["author"] != null) {
                    var author = options["author"];
                    if (author.id)
                        options.embeds[0]["author"] = { name: `Hello, ${author.tag}!`, icon_url: author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) };
                    delete options["author"];
                };
                if (!options.embeds[0]["footer"]) options.embeds[0]["footer"] = { text: app.config.system.footerText }; // Install branding.exe
            };

            if (action == 0) {
                if (doReply) options["reply"] = { messageReference: message.id };
                message.channel.send(options).then(msg => { if (callback != null) callback(msg); });
            } else if (action == 1) {
                if (message.edit) message.edit(options).then(msg => { if (callback != null) callback(msg); });
                else if (message.update) message.update(options).then(msg => { if (callback != null) callback(msg); });
            };
        },

        RemoveReactions: function(app, msg) {
            msg.reactions.removeAll().catch(error => {
                app.logger.error("DISCORD", "Could not remove ALL reactions due to " + error);
                app.functions.msgHandler(msg, {
                    embeds: [{
                        color: app.config.system.embedColors.red,
                        description: "Failed to remove all reactions! Will attempt to remove my reactions only..."
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
                            }]
                        }, 1, true);
                        app.logger.error("DISCORD", "Could not remove my reactions due to " + err);
                    };
                }));
            });
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
                        ]
                    }]
                }
            else {
                var msg = ((err.message && err.message != "") ? "js\n" + err.message : (err && err != "") ? err : "Unknown Error.");

                data = {
                    embeds: [{
                        title: embedTitle,
                        color: embedColor,
                        description: `Failed to execute \`${((command.name) ? command.name : command)}\`!`,
                        fields: [
                            { name: "Error Details", value: "```" + msg + "```" }

                        ]
                    }]
                };
                if (type == "error" && err.stack) {
                    var stack = err.stack,
                        maxLength = 1020,
                        msg = "(continued)";
                    //                     data.embeds[0].fields.push({ name: "Stacktrace", value: "```js\n" + err.stack + "```" });
                    userSettings.update({ executedCommands: (userSettings.get('errorCommands') + 1) }, { where: { userID: message.author.id } });
                };
            };

            app.functions.msgHandler(message, data, 0, true);
            console.log(err);
            return;
        },

        generateRandomCode: function(length, random = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789") { // random could be set to "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"@#$%^&()-=+[{]}"
            var code = "";
            for (var i = 0; i < length; i++) { code += random.charAt(Math.floor(Math.random() * random.length)); };
            return code;
        },
        getEmoji: function(app, emojiID, full = false) {
            var emoji = app.client.emojis.cache.find(e => e.id === emojiID) || null;

            var theEmoji = emoji;
            if (emoji && full) {
                theEmoji = "<";
                if (emoji.animated)
                    emoji += ":a";
                theEmoji += ":" + emoji["name"] + ":" + emoji["id"] + ">";
            };
            return theEmoji || null;
        },
        getID: function(string) { return string.replace(/[<#@&!>]/g, ''); },
        doesArrayStartsWith: function(string, array) { return array.findIndex((item) => { return item.startsWith(string); }, string) != -1; },

        clearCache: function(module) {
            if (module == null)
                Object.keys(require.cache).forEach(function(key) { delete require.cache[key] });
            else
                delete require.cache[module];
        },
        getFiles: async function(dir, filter = []) {
            if (filter.length > 2) return "Fliter too powerfuuuuul [startsWith, endsWith] only please, or no fliter.";

            const { resolve } = app.modules["path"];
            const { readdir } = app.modules["fs"].promises;

            const dirents = await readdir(dir, { withFileTypes: true });
            const files = await Promise.all(dirents.map((dirent) => {
                let res = resolve(dir, dirent.name);
                if (dirent.isDirectory()) return app.functions.getFiles(res, filter);
                else {

                    if (filter[0] != null || filter[0] != undefined || filter[0] != "")
                        if (!res.startsWith(filter[0])) return "";
                    if (filter[1] != null || filter[1] != undefined || filter[0] != "")
                        if (!res.endsWith(filter[1])) return "";
                    res = app.functions.splitMulti(res, ['\\', '\\\\', '/', '//'])
                    return res.slice((res.length - 2), res.length).join("/");
                };
            }));
            return files.flat().filter(Boolean);
        },
        splitMulti: function(str, tokens) {
            var tempChar = tokens[0];
            for (var i = 1; i < tokens.length; i++) {
                str = str.split(tokens[i]).join(tempChar);
            }
            str = str.split(tempChar);
            return str;
        },
        removeItemAll: function(arr, value) {
            var i = 0;
            while (i < arr.length)
                if (arr[i] === value) arr.splice(i, 1);
                else ++i;
            return arr;
        },
        getParameters: function(array, chars) {
            if (typeof array != "object" || !array.length) return "gimme a array, not whatever that was!";
            else if (typeof chars != "string" || !chars) return "What am I supposed to split?? Gimme a string!";
            var parameters = [];
            for (var i = 0; i < array.length; i++) {
                var parameter = array[i].split(chars)[1];
                if (parameter) parameters.push(parameter);
            };
            return parameters;
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
        { name: "canvas", required: false },
        { name: "os", required: true }
    ]
}

module.exports = app;