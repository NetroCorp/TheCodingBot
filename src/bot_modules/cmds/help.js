module.exports = {
	name: "help",
	description: "Help for TheCodingBot Version 4.",
	guildOnly: false,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["DEFAULT"],
	cooldown: 0,
	aliases: ["halp", "helpme"],
	syntax: [" [commandName/commandAlias]"],
	execute: async(client, message, args) => {

		function hasPermissions(command) {
			if (message.channel.type != "dm")
				return (command.permissions == "DEFAULT"
					|| command.permissions == "BOT_OWNER" && client.config.system.owners.includes(message.author.id)
					|| command.permissions != "BOT_OWNER" && message.channel.permissionsFor(message.author).has(command.permissions)
				);
			else
				return (command.permissions == "DEFAULT" && !command.guildOnly
					|| command.permissions == "BOT_OWNER" && client.config.system.owners.includes(message.author.id)
				);
		};

		function allHelp(command) {
			var globalCommands = [],
			serverCommands = [],
			serverEXCCommands = [];

			client.commands.forEach(c => {
				if (hasPermissions(c)) {
					if (message.guild && c.authorizedGuilds.includes(message.guild.id)) {
						serverEXCCommands.push("`" + client.currentServer.prefix + c.name + "`");
					} else {
						if (!c.hidden) {
							if (c.guildOnly) serverCommands.push("`" + client.currentServer.prefix + c.name + "`");
							else globalCommands.push("`" + client.currentServer.prefix + c.name + "`");
						};
					};
				};
			});

			if (globalCommands.length == 0)
				globalCommands.push("`none`");

			if (serverCommands.length == 0)
				serverCommands.push("`none`");

			if (serverEXCCommands.length == 0)
				serverEXCCommands.push("`none`");

			var msgFields = [
					{ name: "All-purpose commands", value: globalCommands.join(", ") },
					{ name: "Server-only commands", value: serverCommands.join(", ") },
					{ name: "Server Specific commands", value: serverEXCCommands.join(", ") },
					{ name: "Looking for help on a specific command?", value: `Try \`${client.currentServer.prefix}help CommandHere\`~!` }
			];

			var msgColor = client.config.system.embedColors.blue;
			if (command != null) {
				msgFields.unshift({ name: "Uh-oh!", value: "That command doesn't appear to exist, hidden, or mispelled.\nPlease check the placement of characters and try again." });
				msgColor = client.config.system.embedColors.orange;
			};

			message.channel.send({ embed: {
				title: client.config.system.emotes.information + " **Help? Help!**",
				color: msgColor,
				description: "The bot's prefix is `" + client.currentServer.prefix + "`. To change it, run `" + client.currentServer.prefix + "config prefix (new_prefix_here)`.",
				fields: msgFields,
				footer: { text: client.config.system.footerText }
			}});
		};

		var commandName = args[0];

		if (commandName != null) { // OwO command given, let's see what we can do...
			var command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
			if (command) {
				if (!hasPermissions(command)) {
					return message.channel.send({ embed: {
						title: client.config.system.emotes.error + " **Uh-Oh!**",
						color: client.config.system.embedColors.red,
						description: "You're lacking permissions to view help on this command.",
						footer: { text: client.config.system.footerText }
					}});
				};
				var perms = (command.permissions.length > 0) ? `\`${command.permissions.join("`, `")}\`` : "`FETCH_PERMS_ERROR`",
				aliases   = (command.aliases.length > 0) ? `\`${command.name}\`, \`${command.aliases.join("`, `")}\`` : `\`${command.name}\``,
				syntax    = (command.syntax.length > 0) ? `\`${client.currentServer.prefix}${commandName}${command.syntax.join("`, `"+client.currentServer.prefix+commandName)}\`` : "`NONE`";

				message.channel.send({ embed: {
					title: client.config.system.emotes.information + " **Help? Help!**",
					color: client.config.system.embedColors.blue,
					fields: [
						{ name: "Description", value: command.description, inline: true },
						{ name: "Server-only command", value: command.guildOnly, inline: true },
						{ name: "Permissions Required", value: perms, inline: true },
						{ name: "Command Aliases", value: aliases, inline: true },
						{ name: "Command Syntax", value: "`<>` is required, `[]` is optional. DO NOT include `<>`, and `[]`.\n\n" + syntax, inline: true }
					],
					footer: { text: client.config.system.footerText }
				}});
			} else { // Aw, command not found, let's throw the message.
				allHelp(commandName);
			};
		} else { // No command given, let's give them all the commands.
			allHelp();
		};
	}
};