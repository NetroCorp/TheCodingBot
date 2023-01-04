module.exports = async(app, message) => {
    if (message.author.bot) return;

    if (!app.client.eulaMsgSent) app.client.eulaMsgSent = [];
    if (!app.client.cooldowns) app.client.cooldowns = {};

    var serverSettings = null;
    if (message.guild) {
        serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: message.guild.id } });
        if (!serverSettings) {
            await app.functions.DB.createServer(message.guild.id);
            serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: message.guild.id } });
        };
    };

    var userSettings = await app.DBs.userSettings.findOne({ where: { userID: message.author.id } });
    if (!userSettings) {
        await app.functions.DB.createUser(message.author.id);
        userSettings = await app.DBs.userSettings.findOne({ where: { userID: message.author.id } });
    };


    if (userSettings.get("AFKSettings")) {
        var AFKSettings = JSON.parse(userSettings.get("AFKSettings")) || null;
        if (AFKSettings != null) {
            try {
                app.functions.msgHandler(message, {
                    embeds: [{
                        title: `${app.config.system.emotes.success} ${app.lang.getLine(userSettings.get("language"), "Welcome back!")}`,
                        color: app.config.system.embedColors.lime,
                        description: `${app.lang.getLine(userSettings.get("language"), "You were AFK for")} **${app.functions.TStoHR(new Date().getTime() - AFKSettings["timestamp"])}**.${(AFKSettings["mentions"] > 0) ? "\nYou were mentioned **" + AFKSettings["mentions"] + "** times!" : ""}`
                    }]
                }, 0, true, (async msg => {
                    var rowsUpdated = await app.DBs.userSettings.update({ AFKSettings: null }, { where: { userID: message.author.id } });
                    if (rowsUpdated < 1)
                        return app.functions.msgHandler(message, { content: app.lang.getLine(userSettings.get("language"), "Something went wrong while updating your database entry!") }, 0, true);
                    userSettings = await app.DBs.userSettings.findOne({ where: { userID: message.author.id } });
                    setTimeout(function() { msg.delete(); }, 6000);
                }));
            } catch (Ex) {};
        };
    };

    var prefix = userSettings.get("prefix");
    if (!prefix) {
        prefix = app.config.system.defaultPrefix;

        var rowsUpdated = await app.DBs.userSettings.update({ prefix: prefix }, { where: { userID: message.author.id } });
        if (rowsUpdated < 1)
            return app.functions.msgHandler(message, { content: app.lang.getLine(userSettings.get("language"), "Something went wrong while updating your database entry!") }, 0, true);
        userSettings = await app.DBs.userSettings.findOne({ where: { userID: message.author.id } });
    };

    if (!message.content.startsWith(prefix)) { // If the user did not include prefix
        if (message.mentions.has(app.client.user.id) && !message.mentions.everyone && !message.reference) // ...and did not reply to & actually pinged the bot.
            return app.functions.msgHandler(message, { content: `n-nya! My prefix is \`${prefix}\`` }, 0, true);
        else if (!message.mentions.has(app.client.user.id) && !message.mentions.everyone) {
            var AFKpeeps = [];
            var usersSettings = await app.DBs.userSettings.findAll({ where: {}, raw: true }); // WARNING: Do not expose this variable.
            for (user in usersSettings) {
                user = usersSettings[user];
                if (user["AFKSettings"] != null) {
                    var AFKSettings = JSON.parse(user["AFKSettings"]);
                    if (message.mentions.has(user["userID"])) {
                        AFKSettings["mentions"]++;
                        AFKpeeps.push(`${app.client.users.cache.get(user["userID"]).tag} ${app.lang.getLine(userSettings.get("language"), "has been AFK since")} ${app.functions.TStoHR(new Date().getTime() - AFKSettings["timestamp"])} ago${((AFKSettings["reason"]) != "." ? ": " + AFKSettings["reason"]: "")}`);
                        try { await app.DBs.userSettings.update({ AFKSettings: JSON.stringify(AFKSettings, null, "\t") }, { where: { userID: user["userID"] } }); } catch (Ex) {};
                    };
                };
            };

            if (AFKpeeps.length > 0)
                app.functions.msgHandler(message, {
                    content: `${AFKpeeps.join("\n") || app.lang.getLine(userSettings.get("langugage"), "Something went wrong while fetching AFK data.")}`
                }, 0, true);
            return;
        } else return;
    };

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();


    if (!commandName) {
        app.logger.info("DISCORD", `[MESSAGE] ${message.author.id} just triggered prefix. (${prefix})`);
        return;
    };

    var command = app.commands.get(commandName) || app.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return app.functions.ErrorHandler(app, userSettings, message, commandName, new Error(app.lang.getLine(userSettings.get("language"), "Command not found.")), "warning");

    if (!args ||
        args && args.slice(0))
        app.logger.info("DISCORD", `[MESSAGE] ${message.author.id} running ${commandName}`);
    else
        app.logger.info("DISCORD", `[MESSAGE] ${message.author.id} running ${commandName} with args: ${args.join(" ")}`);




    try {

        if (app.client.cooldowns[message.author.id]) {
            var userCooldown = app.client.cooldowns[message.author.id].filter(item => item.command == command.name);
            if (userCooldown.length > 0) {
                var cooldownTime = (userCooldown[0].time - message.createdTimestamp);
                if (cooldownTime > 1000) {
                    var responses = app.lang.getLine(userSettings.get("language"), "coolDownResponse");
                    return app.functions.msgHandler(message, {
                        embeds: [{
                            color: app.config.system.embedColors.red,
                            description: `${responses[Math.floor(Math.random() * responses.length)]}\n*(${app.lang.getLine(userSettings.get("language"), "On cooldown for")} ${app.functions.TStoHR(cooldownTime)})*`
                        }]
                    }, 0, true);
                } else {
                    app.client.cooldowns[message.author.id] = [userCooldown][0] = null;
                }
            };

        };

        if (!app.config.system.owners.includes(message.author.id)) {
            if (app.config.system.commandState == "Disabled") {
                app.logger.info("DISCORD", `[MESSAGE] Return ${message.author.id} command: Disabled.`);

                return app.functions.ErrorHandler(app, userSettings, message, command.name, new Error(app.lang.getLine(userSettings.get("language"), "Commands are disabled!")), "warning");

            };
        };
        var eC = command.category + "/" + command.name;
        loaded = await app.bootloader.loadHandler(app, "command", [eC], true, false);
        if (loaded.success[0] == eC) {
            if (userSettings.get('acceptedEULA') === false && command.category != "Moderation" && command.name != "eval") {
                if (app.client.eulaMsgSent.includes(message.author.id))
                    return;

                var eulaFile = `./special/eula.js`;
                await app.functions.clearCache(eulaFile);
                var eulaResult = { denied: false, done: false };
                try {
                    var eula = require(eulaFile);
                    eulaResult = await eula(app, message);
                    if (eulaResult["denied"]) return;
                } catch (Ex) {
                    return app.functions.ErrorHandler(app, userSettings, message, command.name, new Error(`Nya.. ${app.lang.getLine(userSettings.get("language"), "End-User Agreement failed to load. How does that even happen...")}`), "error");
                };

            };

            if (command.guildOnly == true && message.guild == null) {
                app.logger.info("DISCORD", `[MESSAGE] Return ${message.author.id} command: server-only.`);
                return app.functions.ErrorHandler(app, userSettings, message, command.name, new Error("Server-only command!"), "warning");
            };
            if (app.functions.hasPermissions(message, command)) {
                try {
                    await app.functions.clearCache(command.file); // Clear cache :>
                    command = require(command.file);
                    await command.execute(app, message, args, userSettings);
                    if (!userSettings.get('optedOut'))
                        userSettings.update({ executedCommands: (userSettings.get('executedCommands') + 1) }, { where: { userID: message.author.id } });
                    if (command.cooldown != null) {
                        if (command.cooldown < 0) { // how do you even have a negative cooldown??
                            var defaultCooldown = 2;
                            app.logger.info("SYS", `Command ${command.name} has a cooldown of ${command.cooldown} (expected 0 or higher); it's been set to ${defaultCooldown}.`);
                            command.cooldown = defaultCooldown;
                        };
                        if (command.cooldown != 0) {
                            if (!app.client.cooldowns[message.author.id]) app.client.cooldowns[message.author.id] = [];
                            app.client.cooldowns[message.author.id].push({ command: command.name, time: (message.createdTimestamp + (command.cooldown * 1000)) })
                        };
                    };
                } catch (err) {
                    app.logger.error("DISCORD", "[MESSAGE] Whoops! Something went wrong!\n" + err);

                    return app.functions.ErrorHandler(app, userSettings, message, command.name, err, "error");
                };
                app.logger.success("DISCORD", "[MESSAGE] Command execution complete.");
            } else return app.functions.missingPerms(message, 0, "execute the " + command.name + " command", command);
        } else {
            throw new Error("There was an unknown error while loading the command: " + command.name);
        }
    } catch (err) {
        app.logger.error("DISCORD", "[MESSAGE] Whoops! Something went wrong!\n" + err);

        return app.functions.ErrorHandler(app, userSettings, message, command.name, err, "error");
    };
};