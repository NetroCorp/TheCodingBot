const { MessageActionRow } = require("discord.js");
const BootLoader = require("../functions/bootloader");

module.exports = async(app, message) => {

    if (!app.client.tosMsgSent) app.client.tosMsgSent = [];

    app.client.currentServer = {
        betaStuff: {
            accessToBETA: true
        }
    };

    if (message.author.bot) return;

    var userSettings = await app.DBs.userSettings.findOne({ where: { userID: message.author.id } });
    if (!userSettings) {
        await app.functions.DB.createUser(message.author.id);
        userSettings = await app.DBs.userSettings.findOne({ where: { userID: message.author.id } });
    };


    var prefix = userSettings.get("prefix");

    if (!prefix) {
        prefix = app.config.system.defaultPrefix;

        var rowsUpdated = await app.DBs.userSettings.update({ prefix: prefix }, { where: { userID: message.author.id } });
        if (rowsUpdated < 1)
            return app.functions.msgHandler(message, { content: `Something went wrong while updating your database entry!` }, 0, true);
        userSettings = await app.DBs.userSettings.findOne({ where: { userID: message.author.id } });
    };

    if (!message.content.startsWith(prefix)) { // If the user did not include prefix
        if (message.mentions.has(app.client.user.id)) // And pinged the bot.
            return app.functions.msgHandler(message, { content: `n-nya! My prefix is \`${prefix}\`` }, 0, true);
        else return;
    } else {};
    app.logger.log("i", "DISCORD", `[MESSAGE] ${message.author.id} triggered prefix. (${prefix})`);




    if (app.client.user.id === app.config.system.knownIDs.beta) {
        if (app.client.currentServer.betaStuff["accessToBETA"] == false && prefix != "t/") {
            app.logger.log("i", "DISCORD", `[MESSAGE] ${message.guild.id} doesn't have BETA access! Big sad.`);
            return app.functions.msgHandler(message, { content: `${app.config.system.emotes.error} **This server lacks the \`BETA\` permissions.**\nIf you are looking for \`BETA\` access, please contact <@222073294419918848> (User Tag: TheCodingGuy#6697 | User ID: 222073294419918848).\n(Oh, if he exists in this server, now he knows.)` }, 0, true);
        };
    };

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    var command = app.commands.get(commandName) || app.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return app.functions.ErrorHandler(app, userSettings, message, commandName, new Error("Command not found."), "warning");

    if (!args)
        app.logger.log("i", "DISCORD", `[MESSAGE] ${message.author.id} running ${commandName} with no args`);
    else
        app.logger.log("i", "DISCORD", `[MESSAGE] ${message.author.id} running ${commandName} with args: ${args.join(" ")}`);




    try {
        if (!app.config.system.owners.includes(message.author.id)) {
            if (app.config.system.commandState == "Disabled") {
                app.logger.log("i", "DISCORD", `[MESSAGE] Return ${message.author.id} command: Disabled.`);

                return app.functions.ErrorHandler(app, userSettings, message, command.name, new Error("Commands are disabled!"), "warning");

            };
        };

        loaded = await app.bootloader.loadHandler(app, "command", [command.name], true, false);
        if (loaded.success[0] == command.name) {


            if (userSettings.get('acceptedEULA') === false && command.category != "Moderation" && command.name != "eval") {
                if (app.client.tosMsgSent.includes(message.author.id))
                    return;

                var eulaFile = `./special/eula.js`;
                await app.functions.clearCache(eulaFile);
                var eula = require(eulaFile);
                var eulaResult = { denied: false, done: false };
                try {
                    eulaResult = await eula(app, message);
                    // while (!eulaResult["done"]) { await app.functions.sleep(1000); };
                    if (eulaResult["denied"]) return;
                } catch (Ex) {
                    return app.functions.ErrorHandler(app, userSettings, message, command.name, new Error("Nya.. Terms of Service failed to load. How does that even happen..."), "error");
                };

            };

            if (command.guildOnly == true && message.guild == null) {
                app.logger.log("i", "DISCORD", `[MESSAGE] Return ${message.author.id} command: server-only.`);

                return app.functions.ErrorHandler(app, userSettings, message, command.name, new Error("Server-only command!"), "warning");

            };
            if (command.permissions == "DEFAULT" ||
                command.permissions == "BOT_OWNER" && app.config.system.owners.includes(message.author.id) ||
                app.config.system.owners.includes(message.author.id) && app.client.bypassEnabled ||
                command.permissions != "BOT_OWNER" && message.member.permissions.has(command.permissions)) {
                try {
                    await app.functions.clearCache(command.file); // Clear cache :>
                    command = require(command.file);
                    command.execute(app, message, args);
                    userSettings.update({ executedCommands: (userSettings.get('executedCommands') + 1) }, { where: { userID: message.author.id } });
                } catch (err) {
                    app.logger.log("X", "DISCORD", "[MESSAGE] Whoops! Something went wrong!\n" + err);

                    return app.functions.ErrorHandler(app, userSettings, message, command.name, err, "error");
                };
                app.logger.log("S", "DISCORD", "[MESSAGE] Command execution complete.");
            } else {

                var msg = "You're lacking the proper permission (PERMISSIONS_GO_HERE) to execute this command.";

                var lackingPerms = [];
                if (command.permissions == "BOT_OWNER")
                    lackingPerms.push("`BOT_OWNER`");
                else {
                    for (var i = 0; i < command.permissions.length; i++) {
                        if (!message.channel.permissionsFor(message.author).has(command.permissions[i])) {
                            lackingPerms.push("`" + command.permissions[i] + "`");
                        };
                    };
                };
                msg = msg.replace("PERMISSIONS_GO_HERE", lackingPerms.join(", "));


                if (lackingPerms.length > 1)
                    msg = msg.replace("permission", "permissions");

                app.logger.log("i", "DISCORD", "[MESSAGE] Return " + message.author.id + " lacking " + msg.split("lacking the ")[1]);


                return app.functions.ErrorHandler(app, userSettings, message, command.name, msg, "error");

            };
        };
    } catch (err) {
        app.logger.log("X", "DISCORD", "[MESSAGE] Whoops! Something went wrong!\n" + err);

        return app.functions.ErrorHandler(app, userSettings, message, command.name, err, "error");
    };
};