module.exports = {
	name: "botcontrols",
	description: "Configuration for TCBv4.",
	guildOnly: false,
	authorizedGuilds: [],
	hidden: true,
	permissions: ["BOT_OWNER"],
	cooldown: 0,
	aliases: ["bcontrols", "bc"],
	syntax: [
		" -Test",
		" -shutdown",
		" -restart",
		" -reload <commands/events/all>"
	],
	execute: async(client, message, args) => {

		function RemoveReactions(msg, title) {
			msg.reactions.removeAll().catch(error => {
				log("X", "DISCORD", "Could not remove ALL reactions due to " + error);
				msg.channel.send({ embed: {
					title: client.config.system.emotes.error + " **" + title + "**",
					color: client.config.system.embedColors.red,
					description: "Failed to remove all reactions! Will attempt to remove my reactions only...",
					footer: { text: client.config.system.footerText }
				}}).then(async m => {
					var myID = client.user.id;
					var userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(myID));
					try {
						for (const reaction of userReactions.values()) {
							await reaction.users.remove(myID);
						};
						m.delete();
					} catch (err) {
						m.edit({ embed: {
							title: client.config.system.emotes.error + " **" + title + "**",
							color: client.config.system.embedColors.red,
							description: "Failed to remove my reactions! well, that's an F.",
							footer: { text: client.config.system.footerText }
						}});
						log("X", "DISCORD", "Could not remove my reactions due to " + err);
					};
				});
			});
		};

		if (args[0] == "-Test")
			message.channel.send(client.config.system.emotes.information + " **Ya, I'm alive.**");
		else if (args[0] == "-shutdown")
		{
			message.channel.send({ embed: {
				title: client.config.system.emotes.warning + " **Shutdown**",
				color: client.config.system.embedColors.yellow,
				description: "Hey! Are you sure you want me to shutdown?\nUse the reactions to confirm.",
				footer: { text: client.config.system.footerText }
			}}).then(msg => {
				msg.react('👍').then(r => {
					msg.react('👎');
				});
				const filter = (reaction, user) => {
					return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
				};
				
				msg.awaitReactions(filter, { max: 1, time: 15000, errors: ['time'] }).then(collected => {
					const reaction = collected.first();
				
					if (reaction.emoji.name === '👍') {
						client.config.system.commandState = "Shutdown";
						msg.edit({ embed: {
							title: client.config.system.emotes.wait + " **Shutting down**",
							color: client.config.system.embedColors.blue,
							description: "I'm shutting down. Oof.",
							footer: { text: client.config.system.footerText }
						}}).then(m => shutdownBot(client, message, false, m));
					} else if (reaction.emoji.name === "👎") {
						msg.edit({ embed: {
							title: client.config.system.emotes.error + " **Shutdown**",
							color: client.config.system.embedColors.red,
							description: "Operation cancelled by user.",
							footer: { text: client.config.system.footerText }
						}});
					};
					RemoveReactions(msg, "Shutdown");
					
				}).catch(collected => {
					msg.edit({ embed: {
						title: client.config.system.emotes.error + " **Shutdown**",
						color: client.config.system.embedColors.red,
						description: "Operation cancelled due to timeout.",
						footer: { text: client.config.system.footerText }
					}});
					RemoveReactions(msg, "Shutdown");
				});
			});
		}
		else if (args[0] == "-restart")
		{
			message.channel.send({ embed: {
				title: client.config.system.emotes.warning + " **Restart**",
				color: client.config.system.embedColors.yellow,
				description: "Hey! Are you sure you want me to restart?\nUse the reactions to confirm.",
				footer: { text: client.config.system.footerText }
			}}).then(msg => {
				msg.react('👍').then(r => {
					msg.react('👎');
				});
				const filter = (reaction, user) => {
					return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
				};
				
				msg.awaitReactions(filter, { max: 1, time: 15000, errors: ['time'] }).then(collected => {
					const reaction = collected.first();
				
					if (reaction.emoji.name === '👍') {
						client.config.system.commandState = "Shutdown";
						msg.edit({ embed: {
							title: client.config.system.emotes.wait + " **Restarting**",
							color: client.config.system.embedColors.blue,
							description: "I'm restarting. I'll be back.",
							footer: { text: client.config.system.footerText }
						}}).then(m => shutdownBot(client, message, false, m));
					} else if (reaction.emoji.name === "👎") {
						msg.edit({ embed: {
							title: client.config.system.emotes.error + " **Restarting**",
							color: client.config.system.embedColors.red,
							description: "Operation cancelled by user.",
							footer: { text: client.config.system.footerText }
						}});
					};
					RemoveReactions(msg, "Restart");
					
				}).catch(collected => {
					msg.edit({ embed: {
						title: client.config.system.emotes.error + " **Restarting**",
						color: client.config.system.embedColors.red,
						description: "Operation cancelled due to timeout.",
						footer: { text: client.config.system.footerText }
					}});
					RemoveReactions(msg, "Restart");
				});
			});
		} else if (args[0] == "-reload") {

			function reloader(obj) {
					reloaderDetails = load(client, obj);
					// console.log(reloaderDetails);
					var embed = null;
					if (reloaderDetails["error"] != "none") {
						log("X", "SYS", "Could not load in " + obj + ", bot will continue without " + obj + "~");

						embed = {
							title: client.config.system.emotes.error + " **TheCodingBot BotControls - Reloader**",
							color: client.config.system.embedColors.red,
							description: "**Reload failed.**\nCommands: `" + client.commands.size + "`\nErrors: `" + reloaderDetails["error"] + "`.\nCheck CONSOLE for more information.",
							footer: { text: client.config.system.footerText }
						};
					} else {
						log("S", "SYS", "Call load(" + obj + ") complete.");

						embed = {
							title: client.config.system.emotes.success + " **TheCodingBot BotControls - Reloader**",
							color: client.config.system.embedColors.lime,
							description: "**Reload completed!**\nCommands: `" + client.commands.size + "`\nErrors: `none`",
							footer: { text: client.config.system.footerText }
						};
					};
					log("i", "DISCORD", "Alerting " + message.author.tag + " of what happened...");

				return embed;

			};

			if (args[1] == null) {
				message.channel.send({embed: {
					title: client.config.system.emotes.question + " **Reload**",
					color: client.config.system.embedColors.purple,
					description: "**Operation could be not completed.**\nWhat do you want me to do, reload air?!\n`commands`, `events`, and `all` are available you boomer.",
					footer: { text: client.config.system.footerText }
				}});
			} else if (args[1] == "commands") {
				log("i", "DISCORD", message.author.tag + " is reloading all commands, please wait...");
				message.channel.send({ embed: {
					title: client.config.system.emotes.wait,
					color: client.config.system.embedColors.blue,
					description: "**Reloading all commands, hang tight...**",
					footer: { text: client.config.system.footerText }
				}}).then(msg => {
					log("i", "SYS", "Call load(commands).");
					msg.edit({ embed: reloader("commands") });
				});
			} else if (args[1] == "events") {
				log("i", "DISCORD", message.author.tag + " is reloading all events, please wait...");
				message.channel.send({ embed: {
					title: client.config.system.emotes.wait,
					color: client.config.system.embedColors.blue,
					description: "**Reloading all events, hang tight...**",
					footer: { text: client.config.system.footerText }
				}}).then(msg => {
					log("i", "SYS", "Call load(events).");
					msg.edit({ embed: reloader("events") });
				});
			};
		};
	}
};