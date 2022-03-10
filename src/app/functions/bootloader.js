/*
	THECODINGBOT v5
	Bootloader
	6/24/2021

	https://tcb.nekos.tech/source
	https://themattchannel.com
*/

class BootLoader {

    printLogo = function() {
        console.log("\n\n");
        console.log(" ________       _____        ___           ___       __ ");
        console.log("/_  __/ /  ___ / ___/__  ___/ (_)__  ___ _/ _ )___  / /_");
        console.log(" / / / _ \\/ -_) /__/ _ \\/ _  / / _ \\/ _ `/ _  / _ \\/ __/ ");
        console.log("/_/ /_//_/\\__/\\___/\\___/\\_,_/_/_//_/\\_, /____/\\___/\\__/ ");
        console.log("				   /___/                               ");
        // console.log("           Copyright TMC Software 2018-2021.          ");
        console.log("           Copyright TMC Software 2018-" + new Date().getFullYear() + ".          ");
        console.log("\n\n");
    }

    extraHandler = async function(app, extras, hideLoadingText = false, fromBoot = true) {
        var results = { success: [], fail: [] };
        app.functions.clearCache(); // Clear cache :>


        var startTime = new Date(),
            err = false;

        for (var i = 0; i < extras.length; i++) {
            var extra = extras[i];
            try {
                if (extra.extraEnab) {
                    app.extras[extra.extraName] = {
                        extraName: extra.extraName,
                        extraCfg: require(process.cwd() + "/app/extras/" + extra.extraCfg),
                        extraApp: require(process.cwd() + "/app/extras/" + extra.extraApp),
                    };

                    extra = app.extras[extra.extraName]; // redefine the extra, since now we actually in its instance now.

                    var missingDeps = extra.extraCfg.info.extraDeps.filter(function(x) { return !Object.keys(app.modules).includes(x); });
                    if (missingDeps.length > 0) {
                        var deps = [],
                            temp = [];
                        for (var mD = 0; mD < missingDeps.length; mD++) deps.push(Object.keys(missingDeps[mD]));

                        app.logger.warn("SYS", `${extra.extraName} cannot be enabled due to missing package(s): ${deps.join(", ")}; attempting to find and enable...`);

                        for (var mD = 0; mD < missingDeps.length; mD++) {
                            var name = (Object.keys(missingDeps[mD])[0]);
                            temp.push({ name: name, required: missingDeps[name] })
                        };
                        await app.bootloader.loadHandler(app, "dependency", temp, false, false);

                    };
                    app.logger.info("SYS", `Enabling Extra: ${extra.extraName}...`);
                    extra.extraApp = new extra.extraApp;
                    await extra.extraApp.init(app, extra.extraCfg.settings);
                };
            } catch (error) {
                err = error;
            } finally {
                var endTime = new Date();
                var elapsedMS = (endTime - startTime) / 1000;
                if (err === false) {
                    if (!hideLoadingText) app.logger.success("SYS", `Loaded & enabled ${extra.extraName} v${extra.extraCfg.info.extraVers} in ${elapsedMS}ms.`);
                    results["success"].push(extra.extraName);
                } else {
                    results["fail"].push(extra.extraName);

                    app.logger.error("SYS", `Could not load extra ${extra.extraName}.\n Error: ${err}`);
                    console.log(err.stack);
                };

            };
        };
        return results;
    }
    loadHandler = async function(app, varType, varToUse, hideLoadingText = false, fromBoot = true) {
        var results = { success: [], fail: [] };

        if (app.logger === undefined)
            console.log("Uh, yeah, the logger is gone. What did you do?!");

        if (fromBoot) {
            if (varType == "dependency") app.modules = {};
            else if (varType == "configuration") app.config = {};
            else if (varType == "database") {
                app.DBs = {};
                var err = false;
                const Sequelize = app.modules["sequelize"];
                try {
                    app.db = new Sequelize('database', 'user', 'password', {
                        host: 'localhost',
                        dialect: 'sqlite',
                        logging: data => { if (app.debugMode) app.logger.debug("DB", data); },
                        // SQLite only
                        storage: './app/cfg/app.sqlite',
                    });

                    app.DBs = {
                        // invites: app.db.define('invites', {
                        //     discordUser: Sequelize.STRING,
                        //     inviter: Sequelize.STRING,
                        //     invites: Sequelize.NUMBER,
                        //     guildID: Sequelize.STRING
                        // }),
                        userSettings: app.db.define('userSettings', {
                            userID: { // The executing user
                                type: Sequelize.STRING,
                                unique: true,
                                primaryKey: true
                            },
                            prefix: { // The user's desired command prefix
                                type: Sequelize.STRING,
                                defaultValue: "t/",
                                allowNull: false
                            },
                            language: { // The user's desired languager
                                type: Sequelize.STRING,
                                defaultValue: "English",
                                allowNull: false
                            },
                            acceptedEULA: Sequelize.BOOLEAN, // DID THE USER ACCEPT THE EOA?!
                            executedCommands: { // The user's count of executed commands (will be -1 if optedOut)
                                type: Sequelize.NUMBER,
                                defaultValue: 0,
                                allowNull: false
                            },
                            errorCommands: { // The user's count of errored commands (will be -1 if optedOut)
                                type: Sequelize.NUMBER,
                                defaultValue: 0,
                                allowNull: false
                            },
                            optedOut: { // Did the user opt-out of analytics?
                                type: Sequelize.BOOLEAN,
                                defaultValue: 0,
                                allowNull: false
                            },
                            AFKSettings: { // We'll be right back.
                                type: Sequelize.STRING,
                                defaultValue: null,
                                allowNull: true
                            }
                        }),
                        serverSettings: app.db.define('serverSettings', {
                            serverID: { // The executing server
                                type: Sequelize.STRING,
                                unique: true,
                                primaryKey: true
                            },
                            loggingMessageChannel: { // Message Update/Deletes
                                type: Sequelize.STRING,
                                defaultValue: null,
                                allowNull: true
                            },
                            loggingMemberChannel: { // Member Joins/Updates/Leaves
                                type: Sequelize.STRING,
                                defaultValue: null,
                                allowNull: true
                            },
                            loggingGuildChannel: { // Role Adds/Updates/Deletes, Emoji Adds/Updates/Deletes, Channel Adds/Updates/Deletes
                                type: Sequelize.STRING,
                                defaultValue: null,
                                allowNull: true
                            },
                            verification: { // Tells the verification system where to accept verification and what role to give
                                type: Sequelize.STRING,
                                defaultValue: null,
                                allowNull: true
                            },
                            reactionRoles: { // Reaction Roles :D
                                type: Sequelize.STRING,
                                defaultValue: null,
                                allowNull: true
                            },
                            other: { // Other settings - like join images, leave channel, etc.
                                type: Sequelize.STRING,
                                defaultValue: JSON.stringify({
                                    "join": {
                                        "channel": null,
                                        "msg": "test"
                                    },
                                    "leave": {
                                        "channel": null,
                                        "msg": "test!!"
                                    }
                                }, null, "\t"),
                                allowNull: true
                            }
                        }),
                        verification: app.db.define('verification', {
                            serverID: { // The executing server
                                type: Sequelize.STRING,
                                primaryKey: true
                            },
                            userID: { // The executing user
                                type: Sequelize.STRING,
                                defaultValue: null,
                                allowNull: true
                            },
                            messageID: { // Allows us to edit the same message (if in a server)
                                type: Sequelize.STRING,
                                defaultValue: null,
                                allowNull: true
                            },
                            userCode: { // The code generated
                                type: Sequelize.STRING,
                                unique: true,
                                allowNull: false
                            },
                        })
                    }; // damn this has gotten longer over the past month...
                    Object.keys(app.DBs).forEach(db => {
                        app.logger.debug("DB", "Syncing database table: " + db);
                        app.DBs[db].sync();
                    }); // Sync go brrr (Make sure the tables and stuff are created)
                } catch (error) {
                    err = error;
                } finally {
                    if (err === false && !hideLoadingText) {
                        app.logger.success("SYS", `Loaded ${varType}.`);
                    } else {

                        app.logger.error("SYS", `Could not load ${varType}.\n\tError Details:\n\t${err}`);
                        if (varType == "database") {
                            if (!hideLoadingText) app.logger.error("SYS", `A required dependency is missing and we are not able to boot.`);
                            process.exit(1);
                        };
                    };
                }
                return;
            } else if (varType == "event") {} // There's nothing to do for events, app.client handles that.
            else if (varType == "command") {
                try { app.commands = new app.modules["discord.js"].Collection(); } catch (err) {
                    app.logger.error("SYS", `Could not load Discord dependency.\n Error: ${err}`);
                    console.log(err.stack);
                    return results;
                };
            } else if (varType == "slashCommand") {
                try { app.slashCommands = new app.modules["discord.js"].Collection(); } catch (err) {
                    app.logger.error("SYS", `Could not load Discord dependency.\n Error: ${err}`);
                    console.log(err.stack);
                    return results;
                };
            } else { return; }; // Ignore this function call if all else fails.
        };
        for (var i = 0; i < varToUse.length; i++) {
            var startTime = new Date(),
                err = false,
                varName = ((varType == "dependency") ? varToUse[i] : ((varType == "configuration") ? varToUse[i].split(".json")[0] : varToUse[i].split(".js")[0]));
            var varSimpleName = ((varType == "dependency") ? varName["name"] : varName);

            if (!hideLoadingText) app.logger.debug("SYS", `Loading ${varType}: ${varSimpleName}...`);

            try {
                app.functions.clearCache(); // Clear cache :>

                if (!hideLoadingText) app.logger.debug("SYS", `Enabling ${varType}: ${varSimpleName}...`); // Lol this is Minecraft now
                if (varType == "dependency") {
                    app.modules[varSimpleName] = require(varSimpleName);
                } else if (varType == "configuration") {
                    app.config[varSimpleName] = require(process.cwd() + "/app/cfg/" + varSimpleName);
                } else if (varType == "event") {
                    var event = require(process.cwd() + "/app/evts/" + varSimpleName);
                    app.client.on(varSimpleName, event.bind(null, app));
                } else if (varType == "command") {
                    // Discord is gonna make us devs move to slash commands fully in the future.
                    // I think, personally, it's a bit overcomplicated but whatever.
                    // I'm not even a verified bot yet.

                    var fileLocation = process.cwd() + "/app/" + ((varSimpleName.split("/")[0] == "cmds") ? varSimpleName : "cmds/" + varSimpleName);
                    var command = require(fileLocation);
                    command.file = fileLocation;
                    command.category = ((varSimpleName.split("/")[0] == "cmds") ? "" : varSimpleName.split("/")[0]) || "Uncategorized";
                    app.commands.set(command.name, command);
                } else if (varType == "slashCommand") {
                    // app.client.api.applications(app.client.user.id).commands.post({data: {
                    //     name: 'ping',
                    //     description: 'ping pong!'
                    // }})

                    // var fileLocation = process.cwd() + "/app/cmds/" + varSimpleName;
                    // var command = require(fileLocation);
                    // command.file = fileLocation;
                    // app.client.api.applications(app.client.user.id).guilds('sometestguild').commands.post({
                    //     data: {
                    //         name: command.name,
                    //         description: command.description
                    //     }
                    // }).catch(err => { throw new err; });
                    // app.slashCommands.set(command.name, command);
                } else { return; };

            } catch (error) {
                err = error;
            } finally {
                var endTime = new Date();
                var elapsedMS = (endTime - startTime) / 1000;
                if (err === false) {
                    if (!hideLoadingText) app.logger.success("SYS", `Loaded & enabled ${varSimpleName} in ${elapsedMS}ms.`);
                    results["success"].push(varSimpleName);
                } else {
                    results["fail"].push(varSimpleName);

                    app.logger.error("SYS", `Could not load ${varType} ${varSimpleName}.\n\tError Details:\n\t${err}`);
                    console.log(err.stack);
                    if (varType == "dependency") {
                        if (varName["required"]) {
                            if (!hideLoadingText) app.logger.error("SYS", `A required dependency is missing and we are not able to boot.`);
                            process.exit(1);
                        } else {
                            if (!hideLoadingText) app.logger.error("SYS", `A dependency is missing but not required; attempting to boot anyways.`);
                        };
                    } else if (varType == "database") {
                        if (!hideLoadingText) app.logger.error("SYS", `A required dependency is missing and we are not able to boot.`);
                        process.exit(1);
                    };
                };

            };

        };
        return results;
    }
}


module.exports = BootLoader;