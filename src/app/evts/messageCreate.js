module.exports = async(app, message) => {

    if (!app.client.eulaMsgSent) app.client.eulaMsgSent = [];
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
    app.logger.info("DISCORD", `[MESSAGE] ${message.author.id} triggered prefix. (${prefix})`);


    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    var command = app.commands.get(commandName) || app.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return app.functions.ErrorHandler(app, userSettings, message, commandName, new Error("Command not found."), "warning");

    if (!args)
        app.logger.info("DISCORD", `[MESSAGE] ${message.author.id} running ${commandName} with no args`);
    else
        app.logger.info("DISCORD", `[MESSAGE] ${message.author.id} running ${commandName} with args: ${args.join(" ")}`);




    try {
        if (!app.config.system.owners.includes(message.author.id)) {
            if (app.config.system.commandState == "Disabled") {
                app.logger.info("DISCORD", `[MESSAGE] Return ${message.author.id} command: Disabled.`);

                return app.functions.ErrorHandler(app, userSettings, message, command.name, new Error("Commands are disabled!"), "warning");

            };
        };

        loaded = await app.bootloader.loadHandler(app, "command", [command.name], true, false);
        if (loaded.success[0] == command.name) {


            if (userSettings.get('acceptedEULA') === false && command.category != "Moderation" && command.name != "eval") {
                if (app.client.eulaMsgSent.includes(message.author.id))
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
                    return app.functions.ErrorHandler(app, userSettings, message, command.name, new Error("Nya.. End-User Agreement failed to load. How does that even happen..."), "error");
                };

            };

            if (command.guildOnly == true && message.guild == null) {
                app.logger.info("DISCORD", `[MESSAGE] Return ${message.author.id} command: server-only.`);

                return app.functions.ErrorHandler(app, userSettings, message, command.name, new Error("Server-only command!"), "warning");

            };
            if (command.permissions == "DEFAULT" ||
                command.permissions == "BOT_OWNER" && app.config.system.owners.includes(message.author.id) ||
                app.config.system.owners.includes(message.author.id) && app.client.bypassEnabled ||
                command.permissions != "BOT_OWNER" && message.member.permissions.has(command.permissions)) {
                try {
                    await app.functions.clearCache(command.file); // Clear cache :>
                    command = require(command.file);
                    await command.execute(app, message, args);
                    userSettings.update({ executedCommands: (userSettings.get('executedCommands') + 1) }, { where: { userID: message.author.id } });
                } catch (err) {
                    app.logger.error("DISCORD", "[MESSAGE] Whoops! Something went wrong!\n" + err);

                    return app.functions.ErrorHandler(app, userSettings, message, command.name, err, "error");
                };
                app.logger.success("DISCORD", "[MESSAGE] Command execution complete.");
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

                app.logger.info("DISCORD", "[MESSAGE] Return " + message.author.id + " lacking " + msg.split("lacking the ")[1]);


                return app.functions.ErrorHandler(app, userSettings, message, command.name, msg, "error");

            };
        };
    } catch (err) {
        app.logger.error("DISCORD", "[MESSAGE] Whoops! Something went wrong!\n" + err);

        return app.functions.ErrorHandler(app, userSettings, message, command.name, err, "error");
    };
};