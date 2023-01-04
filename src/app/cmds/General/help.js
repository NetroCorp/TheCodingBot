module.exports = {
    name: "help",
    description: "I need somebody (Help!) Not just anybody (Help!) From a command to all commands (Help!)",
    guildOnly: false,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["DEFAULT"],
    cooldown: 2,
    aliases: ["halp", "helpme"],
    syntax: [" [commandName/commandAlias]"],
    execute: async(app, message, args, userSettings) => {

        // Begin the functions for help.

        function allHelp(temp) {
            var cmds = {},
                fields = [];
            app.commands.forEach(cmd => {
                if (app.functions.hasPermissions(message, cmd) || !cmd.hidden) {
                    var category = cmd.category || app.lang.getLine(userSettings.get("language"), "Uncategorized");
                    if (cmds[category] == undefined) cmds[category] = [];
                    cmds[category].push("`" + cmd.name + "`");
                };
            });
            for (var i = 0; i < Object.keys(cmds).length; i++) {
                var category = Object.keys(cmds)[i];
                fields.push({ name: category, value: cmds[category].join(", ") });
            };

            return app.functions.msgHandler(message, {
                embeds: [{
                    title: `${app.config.system.emotes.information} ${app.name} ${app.lang.getLine(userSettings.get("language"), "Help")}`,
                    color: app.config.system.embedColors.blue,
                    description: ((temp) ? "The command or category '" + temp + "' is invalid." : `Yeaaah we got it! (Help! Help!)`),
                    fields: fields
                }]
            }, 0, true);
        };

        function categoryHelp(categoryName) {
            var commands = [],
                fields = [];
            app.commands.forEach(cmd => {
                var category = cmd.category || app.lang.getLine(userSettings.get("language"), "Uncategorized");
                if (category == categoryName && app.functions.hasPermissions(message, cmd))
                    commands.push("`" + cmd.name + "`");
            });
            if (commands.length < 1) { return app.functions.missingPerms(message, 0, "view help on " + categoryName); };

            fields.push({ name: categoryName, value: commands.join(", ") });

            return app.functions.msgHandler(message, {
                embeds: [{
                    title: `${app.config.system.emotes.information} ${app.name} ${app.lang.getLine(userSettings.get("language"), "Help")}`,
                    color: app.config.system.embedColors.pink,
                    description: `Showing commands for the '${categoryName}' category.`,
                    fields: fields
                }]
            }, 0, true);
        };

        function commandHelp(commandName) {
            var command = app.commands.get(commandName) || app.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

            if (!app.functions.hasPermissions(message, command)) { return app.functions.missingPerms(message, 0, "view help on " + commandName, command); };
            var fields = [
                { name: app.lang.getLine(userSettings.get("language"), "Category"), value: command.category || app.lang.getLine(userSettings.get("language"), "Uncategorized"), inline: true },
                { name: app.lang.getLine(userSettings.get("language"), "Server Only?"), value: (command.guildOnly ? "Yes" : "No"), inline: true },
                { name: app.lang.getLine(userSettings.get("language"), "Permissions"), value: ("`" + command.permissions.join("`, `") + "`"), inline: true },
                { name: app.lang.getLine(userSettings.get("language"), "Cooldown"), value: `${command.cooldown}s`, inline: true },
                { name: app.lang.getLine(userSettings.get("language"), "Aliases"), value: ((command.aliases.length > 0) ? "`" + command.aliases.join("`\n`") + "`" : "NONE"), inline: true },
                { name: app.lang.getLine(userSettings.get("language"), "Syntax"), value: ("`" + commandName + command.syntax.join("`\n`" + commandName) + "`"), inline: true }
            ]
            if (/(<|>|\[|\])/i.test(command.syntax))
                fields.push({ name: app.lang.getLine(userSettings.get("language"), "Heads up!"), value: "`<>` = " + app.lang.getLine(userSettings.get("language"), "Required") + "\n`[]` = " + app.lang.getLine(userSettings.get("language"), "Optional") });

            return app.functions.msgHandler(message, {
                embeds: [{
                    title: `${app.config.system.emotes.information} ${app.lang.getLine(userSettings.get("language"), "Help for")} ${commandName}`,
                    color: app.config.system.embedColors.lime,
                    description: command.description,
                    fields: fields
                }]
            }, 0, true);

        };

        // End of the functions for help.

        var temp = args[0]; // temp is just a placeholder. Functions will handle what it is after detection.
        if (temp) {
            var isCommand = app.commands.get(temp) || app.commands.find(cmd => cmd.aliases && cmd.aliases.includes(temp));
            if (!isCommand) {
                var isCategory = app.commands.find(cmd => cmd.category.toLowerCase() == temp.toLowerCase());
                if (!isCategory)
                    allHelp(temp); // Send all help and tell it's not valid.
                else
                    categoryHelp(temp); // Send category help
            } else
                commandHelp(temp); // Send command help
        } else
            allHelp(); // Send all help.


    }
};