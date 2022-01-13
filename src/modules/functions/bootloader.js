/*
	THECODINGBOT v5 BOOTLOADER
	Created 6/24/2021
*/


class BootLoader {

    printLogo = function() {
        console.log("\n\n");
        console.log(" ________       _____        ___           ___       __ ");
        console.log("/_  __/ /  ___ / ___/__  ___/ (_)__  ___ _/ _ )___  / /_");
        console.log(" / / / _ \\/ -_) /__/ _ \\/ _  / / _ \\/ _ `/ _  / _ \\/ __/ ");
        console.log("/_/ /_//_/\\__/\\___/\\___/\\_,_/_/_//_/\\_, /____/\\___/\\__/ ");
        console.log("				   /___/                               ");
        console.log("           Copyright TMC Software 2018-2021.          ");
        console.log("\n\n");
    }

    loadHandler = async function(app, varType, varToUse, hideLoadingText = false, fromBoot = true) {
        var results = { success: [], fail: [] };

        if (app.logger === undefined)
            console.log("Uh, yeah, the logger is gone. What did you do?!");

        if (fromBoot) {
            if (varType == "dependency")
                app.modules = {};
            else if (varType == "configuration")
                app.config = {};
            else if (varType == "database") {
                app.DBs = {};
                var err = false;
                const Sequelize = app.modules["sequelize"];
                try {
                    app.db = new Sequelize('database', 'user', 'password', {
                        host: 'localhost',
                        dialect: 'sqlite',
                        logging: data => { if (app.debugMode) app.logger.log("i", "DB", data); },
                        // SQLite only
                        storage: './modules/cfg/app.sqlite',
                    });

                    // app.client.invites = app.db.define('invite', {
                    //     discordUser: Sequelize.STRING,
                    //     inviter: Sequelize.STRING,
                    //     invites: Sequelize.NUMBER,
                    //     guildID: Sequelize.STRING
                    // });
                    // app.client.invites.sync();

                    app.DBs.userSettings = app.db.define('userSettings', {
                        userID: {
                            type: Sequelize.STRING,
                            unique: true
                        },
                        prefix: {
                            type: Sequelize.STRING,
                            defaultValue: "t/",
                            allowNull: false
                        },
                        language: {
                            type: Sequelize.STRING,
                            defaultValue: "English",
                            allowNull: false
                        },
                        acceptedEULA: Sequelize.BOOLEAN,
                        executedCommands: {
                            type: Sequelize.NUMBER,
                            defaultValue: 0,
                            allowNull: false
                        },
                        errorCommands: {
                            type: Sequelize.NUMBER,
                            defaultValue: 0,
                            allowNull: false
                        },
                        optedOut: Sequelize.BOOLEAN
                    });
                    app.DBs.userSettings.sync();

                    app.DBs.serverSettings = app.db.define('serverSettings', {
                        serverID: {
                            type: Sequelize.STRING,
                            unique: true
                        },
                        loggingDeleteChannel: {
                            type: Sequelize.STRING,
                            defaultValue: null,
                            allowNull: true
                        },
                        loggingEditChannel: {
                            type: Sequelize.STRING,
                            defaultValue: null,
                            allowNull: true
                        },
                        loggingJoinChannel: {
                            type: Sequelize.STRING,
                            defaultValue: null,
                            allowNull: true
                        },
                        loggingLeaveChannel: {
                            type: Sequelize.STRING,
                            defaultValue: null,
                            allowNull: true
                        }
                    });
                    app.DBs.serverSettings.sync();

                } catch (error) {
                    err = error;
                } finally {
                    if (err === false && !hideLoadingText) {
                        app.logger.log("S", "SYS", `Loaded ${varType}.`);
                    } else {

                        app.logger.log("X", "SYS", `Could not load ${varType}.\n Error: ${err}`);
                    };
                }
                return;
            } else if (varType == "event") {} // There's nothing to do for events, app.client handles that.
            else if (varType == "command") {
                try {
                    app.commands = new app.modules["discord.js"].Collection();
                } catch (err) {
                    app.logger.log("X", "SYS", `Could not load Discord dependency.\n Error: ${err}`);
                    console.log(err.stack);
                    return results;
                };
            } else if (varType == "slashCommand") {
                try {
                    app.slashCommands = new app.modules["discord.js"].Collection();
                } catch (err) {
                    app.logger.log("X", "SYS", `Could not load Discord dependency.\n Error: ${err}`);
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

            if (!hideLoadingText) app.logger.log("i", "SYS", `Loading ${varType}: ${varSimpleName}...`);

            try {
                app.functions.clearCache(); // Clear cache :>

                if (!hideLoadingText) app.logger.log("i", "SYS", `Enabling ${varType}: ${varSimpleName}...`); // Lol this is Minecraft now
                if (varType == "dependency") {
                    app.modules[varSimpleName] = require(varSimpleName);
                } else if (varType == "configuration") {
                    app.config[varSimpleName] = require(process.cwd() + "/modules/cfg/" + varSimpleName);
                } else if (varType == "event") {
                    var event = require(process.cwd() + "/modules/evts/" + varSimpleName);
                    app.client.on(varSimpleName, event.bind(null, app));
                } else if (varType == "command") {
                    // Discord is gonna make us devs move to slash commands fully in the future.
                    // I think, personally, it's a bit overcomplicated but whatever.
                    // I'm not even a verified bot yet.

                    var fileLocation = process.cwd() + "/modules/cmds/" + varSimpleName;
                    var command = require(fileLocation);
                    command.file = fileLocation;
                    app.commands.set(command.name, command);
                } else if (varType == "slashCommand") {
                    // app.client.api.applications(app.client.user.id).commands.post({data: {
                    //     name: 'ping',
                    //     description: 'ping pong!'
                    // }})

                    var fileLocation = process.cwd() + "/modules/cmds/" + varSimpleName;
                    var command = require(fileLocation);
                    command.file = fileLocation;
                    app.client.api.applications("513450834256723978").guilds('505935809002602506').commands.post({
                        data: {
                            name: command.name,
                            description: command.description
                        }
                    }).catch(err => { throw new err; });
                    app.slashCommands.set(command.name, command);
                } else { return; };

            } catch (error) {
                err = error;
            } finally {
                var endTime = new Date();
                var elapsedMS = (endTime - startTime) / 1000;
                if (err === false) {
                    if (!hideLoadingText) app.logger.log("S", "SYS", `Loaded & enabled ${varSimpleName}${((varType == "dependency") ? ((app.modules[varSimpleName].version) ? " v" + app.modules[varSimpleName].version : "") : "")} in ${elapsedMS}ms.`);
                    results["success"].push(varSimpleName);
                } else {
                    results["fail"].push(varSimpleName);

                    app.logger.log("X", "SYS", `Could not load ${varType} ${varSimpleName}.\n Error: ${err}`);
                    console.log(err.stack);
                    if (varType == "dependency") {
                        if (varName["required"]) {
                            if (!hideLoadingText) app.logger.log("X", "SYS", `A required dependency is missing and we are not able to boot.`);
                            process.exit(1);
                        } else {
                            if (!hideLoadingText) app.logger.log("X", "SYS", `A dependency is missing but not required; attempting to boot anyways.`);
                        };
                    };
                };

            };

        };
        return results;
    }
}


module.exports = BootLoader;