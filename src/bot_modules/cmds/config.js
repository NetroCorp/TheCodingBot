module.exports = {
	name: "config",
	description: "It's time to have more control -- Configure TheCodingBot how you want.",
	guildOnly: true,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["ADMINISTRATOR"],
	cooldown: 10,
	aliases: ["setup", "configure"],
	syntax: [
		" prefix <newprefix>",
		" logging <all/joins/leaves/deletes/edits> <ChannelIDOr#Channel>",
		" logging <enable/disable>",
		" misc <joinMsg/leaveMsg> <message>",
		" misc <joinChannel/leaveChannel> <ChannelIDOr#Channel>"
	],
	execute: async(client, message, args) => {
		message.channel.send({ embed: {
			title: client.config.system.emotes.d_wait + " **Configure TheCodingBot!**",
			color: client.config.system.embedColors.blue,
			fields: [
				{ name: "Please wait", value: "The server settings and some other data is currently being loaded, so sit tight!" },
				{ name: "How long will it take?", value: `Depending on the API and latency, from a second to a minute.\nIf you are having problems, try getting latency data with \`${client.currentServer.prefix}ping\`.` }
			],
			footer: { text: client.config.system.footerText }
		}}).then(msg => {

			function ReturnProcessing(typeOfError, errorHeader, errorMsg) {
				var embedEmote = client.config.system.emotes.error;
				var embedColor = client.config.system.embedColors.red;

				if (typeOfError == "warning") {
					embedEmote = client.config.system.emotes.warning;
					embedColor = client.config.system.embedColors.orange;
				} else if (typeOfError == "success") {
					embedEmote = client.config.system.emotes.success;
					embedColor = client.config.system.embedColors.lime;
				};

				if (typeOfError == "warning" || typeOfError == "error") {
					if (errorHeader == null) {
						errorHeader = "Big Oopsie!";
					};
					if (errorMsg == null) {
						errorMsg = "Wait, there is no error message... what?!";
					};
				} else {
					if (errorHeader == null) {
						errorHeader = "Wait, what?";
					};
					if (errorMsg == null) {
						errorMsg = "No extra information provided.";
					};
				};

				var embedFields = [{ name: errorHeader, value: errorMsg }];
				if (typeOfError == "warning" || typeOfError == "error")
					embedFields.unshift({ name: "Uh-oh!", value: "There was an issue while processing your request!" });
				else if (typeOfError == "information")
					embedFields.unshift({ name: "Success!", value: "Your request completed!!!! ^^" });

				msg.edit({ embed: {
					title: embedEmote + " **Configure TheCodingBot!**",
					color: embedColor,
					fields: embedFields,
					footer: { text: client.config.system.footerText }
				}});
			};

			if (args[0] != null) {
				function Configure(object) {
				};

				function updateDaConfig() {
					client.config.allServerSettings.customServers[message.guild.id] = client.currentServer;
					updateConfig(client, client.config.allServerSettings, "allServerSettings");
				};


				var letsconfigure = args[0];

				if (letsconfigure == "logging") {
					var type = args[1];
					if (type != null) {

						function logChannelUpdate(oldLogChannelID, newLogChannelID, logType, returnProcessingFC) {
							var returnTheFollowing = {
								"type": "",
								"name": "",
								"message": ""
							};

							returnTheFollowing["name"] = logType;

							if (newLogChannelID == oldLogChannelID) {
								var errMsg = "`The current " + logType + " log channel is the same as the new one you want.`";
								if (returnProcessingFC) return ReturnProcessing("warning", "Changing the log channel failed!", errMsg);
								else {returnTheFollowing["message"] = errMsg; returnTheFollowing["type"] = "warn"; };
							} else {
								try {
									if (!client.channels.cache.get(newLogChannelID)) {
										var errMsg = "`The channel specified does not exist, is invalid, or I do not have the permissions for that channel.`";
										if (returnProcessingFC) return ReturnProcessing("error", "Changing the log channel failed!", errMsg);
										else { returnTheFollowing["message"] = errMsg; returnTheFollowing["type"] = "error"; };	
									} else {
										client.currentServer.logChannels[logType] = newLogChannelID;
										client.currentServer.logChannels.enabled = true;
										updateDaConfig();

										var gudMsg = "`The " + logType + " log channel has been updated successfully!`";
										if (returnProcessingFC) return ReturnProcessing("success", "Changing the log channel was successful!", gudMsg);
										else { returnTheFollowing["message"] = gudMsg; returnTheFollowing["type"] = "success"; };
									};
								} catch (Ex) {
									var errMsg = "`" + Ex.message + "`";
									if (returnProcessingFC) return ReturnProcessing("error", "Changing the log channel failed!", errMsg);
									else { returnTheFollowing["message"] = errMsg; returnTheFollowing["type"] = "error"; };
								};
							};

							return returnTheFollowing;

						};

						var newlogchannel = args[2], validChanges = ["joins", "leaves", "deletes", "edits"];
						if (newlogchannel == null && validChanges.includes(type)) return ReturnProcessing("warning", "Changing the log channel failed!", "`You need to specify the channel you want to log to.`");

						if (type == "disable" || type == "enable") {
							try {
								if (type == "disable") client.currentServer.logChannels.enabled = false;
								else if (type == "enable") client.currentServer.logChannels.enabled = true;

								updateDaConfig();
								return ReturnProcessing("success", "Logging is now " + type + "d!", "`All logging will now " + (client.currentServer.logChannels.enabled ? "be sent in their respectful channels" : "cease operations") + ".`");
							} catch (Ex) {
								return ReturnProcessing("error", "Logging could not be " + type + "d!", "`" + Ex.message + "`");
							};
						} else if (type != "all") {

							if (!validChanges.includes(type)) return ReturnProcessing("error", "Changing the log channel failed!", "`The log channel type does not exist!`");

							logChannelUpdate(client.currentServer.logChannels[type], newlogchannel.replace(/[<#>]/g, ''), type, true);
						} else if (type != null || type != "") {
							var returnTheFollowing = {
								"success": [],
								"failed": [],
								"warn": []
							};
							Object.keys(client.currentServer.logChannels).forEach((item, index) => {
								if (validChanges.includes(item)) {
 
									var pushTo = "EMPTY_CONTENT";
									var msgContent = logChannelUpdate(client.currentServer.logChannels[item], newlogchannel.replace(/[<#>]/g, ''), item, false);

									if (msgContent["type"] == "success") pushTo = returnTheFollowing["success"];
									else if (msgContent["type"] == "error") pushTo = returnTheFollowing["failed"];
									else if (msgContent["type"] == "warn") pushTo = returnTheFollowing["warn"];
									else pushTo = "BROKEN_MSG";

									pushTo.push({ "name": msgContent["name"], "message": msgContent["message"] });
								};
							});

							var embedColor = client.config.system.embedColors.lime,
							embedEmote = client.config.system.emotes.success,
							embedFields = [];

							if (returnTheFollowing["warn"].length != 0 && returnTheFollowing["failed"].length == 0) {
								embedColor = client.config.system.embedColors.orange;
								embedEmote = client.config.system.emotes.warning;
							} else if (returnTheFollowing["warn"].length == 0 && returnTheFollowing["failed"].length != 0) {
								embedColor = client.config.system.embedColors.red;
								embedEmote = client.config.system.emotes.error;
							};

							if (returnTheFollowing["success"].length != 0)
								for (var i=0;i<returnTheFollowing["success"].length;i++)
									embedFields.push({ name: "Changing the " + returnTheFollowing["success"][i]["name"] + " log channel was successful!", value: returnTheFollowing["success"][i]["message"] });
							if (returnTheFollowing["failed"].length != 0)
									for (var i=0;i<returnTheFollowing["failed"].length;i++)
									embedFields.push({ name: "Changing the " + returnTheFollowing["failed"][i]["name"] + " log channel failed!", value: returnTheFollowing["failed"][i]["message"] });
							if (returnTheFollowing["warn"].length != 0)
								for (var i=0;i<returnTheFollowing["warn"].length;i++)
									embedFields.push({ name: "Changing the " + returnTheFollowing["warn"][i]["name"] + " log channel failed!", value: returnTheFollowing["warn"][i]["message"] });


							setTimeout(function() {
								msg.edit({ embed: {
									title: embedEmote + " **Configure TheCodingBot!**",
									color: embedColor,
									fields: embedFields,
									footer: { text: client.config.system.footerText }
								}});
							}, 1000);
							
							
						} else {
							return ReturnProcessing("error", "Changing the log channel failed!", "`I can't change the air, you know...`");
						};
					};
				} else if (letsconfigure == "prefix") {
					var newprefix = args[1];
					if (newprefix != null) {
						var oldprefix = client.currentServer.prefix;
						if (newprefix == oldprefix) {
							return ReturnProcessing("warning", "Changing the prefix failed!", "`The current prefix is the same as the new prefix.`");
						} else {
							try {
								client.currentServer.prefix = newprefix;
								updateDaConfig();

								return ReturnProcessing("success", "Changing the prefix was successful!", "`The prefix has been updated successfully!`");
							} catch (Ex) {
								return ReturnProcessing("error", "Changing the prefix failed!", "`" + Ex.message + "`");
							};
						};
					} else {
						return ReturnProcessing("success", "The current prefix is", "`" + client.currentServer.prefix + "`");
					};
				} else if (letsconfigure == "misc") {
					var changing = args[1];
					if (changing == "joinChannel") {
						var newchan = args[2];
						if (newchan != null) {
							var oldchan = client.currentServer.coolThings.members.joinChannel;
							newchan = newchan.replace(/[<#>]/g, '');

							if (newchan == oldchan) {
								return ReturnProcessing("warning", "Changing the join channel failed!", "`The current join channel is the same as the new join channel.`");
							} else {
								try {
									client.currentServer.coolThings.members.joinChannel = newchan;
									updateDaConfig();

									return ReturnProcessing("success", "Changing the join channel was successful!", "`The join channel has been updated successfully!`");
								} catch (Ex) {
									return ReturnProcessing("error", "Changing the join channel failed!", "`" + Ex.message + "`");
								};
							};
						} else {
							return ReturnProcessing("success", "The current join channel is", "`" + client.currentServer.coolThings.members.joinChannel + "`");
						};
					} else if (changing == "joinMsg") {
						var newmsg = args.slice(2).join(" ");
						if (newmsg != null && newmsg != "") {
							var oldmsg = client.currentServer.coolThings.members.joinMsg;
							if (newmsg == oldmsg) {
								return ReturnProcessing("warning", "Changing the join message failed!", "`The current join message is the same as the new join message.`");
							} else {
								try {
									client.currentServer.coolThings.members.joinMsg = newmsg;
									updateDaConfig();

									return ReturnProcessing("success", "Changing the join message was successful!", "`The join message has been updated successfully!`");
								} catch (Ex) {
									return ReturnProcessing("error", "Changing the join message failed!", "`" + Ex.message + "`");
								};
							};
						} else {
							return ReturnProcessing("success", "The current join message is", client.currentServer.coolThings.members.joinMsg);
						};
					} else if (changing == "leaveChannel") {
						var newchan = args[2];
						if (newchan != null) {
							var oldchan = client.currentServer.coolThings.members.leaveChannel;
							newchan = newchan.replace(/[<#>]/g, '');

							if (newchan == oldchan) {
								return ReturnProcessing("warning", "Changing the leave channel failed!", "`The current leave channel is the same as the new leave channel.`");
							} else {
								try {
									client.currentServer.coolThings.members.leaveChannel = newchan;
									updateDaConfig();

									return ReturnProcessing("success", "Changing the leave channel was successful!", "`The leave channel has been updated successfully!`");
								} catch (Ex) {
									return ReturnProcessing("error", "Changing the leave channel failed!", "`" + Ex.message + "`");
								};
							};
						} else {
							return ReturnProcessing("success", "The current leave channel is", "`" + client.currentServer.coolThings.members.leaveChannel + "`");
						};
					} else if (changing == "leaveMsg") {
						var newmsg = args.slice(2).join(" ");
						if (newmsg != null && newmsg != "") {
							var oldmsg = client.currentServer.coolThings.members.leaveMsg;
							if (newmsg == oldmsg) {
								return ReturnProcessing("warning", "Changing the leave message failed!", "`The current leave message is the same as the new leave message.`");
							} else {
								try {
									client.currentServer.coolThings.members.leaveMsg = newmsg;
									updateDaConfig();

									return ReturnProcessing("success", "Changing the leave message was successful!", "`The leave message has been updated successfully!`");
								} catch (Ex) {
									return ReturnProcessing("error", "Changing the leave message failed!", "`" + Ex.message + "`");
								};
							};
						} else {
							return ReturnProcessing("success", "The current leave message is", client.currentServer.coolThings.members.leaveMsg);
						};
					};
				} else {
					return ReturnProcessing("error", "I am confusion.", "`Could not figure out what you want to change. Check spelling and syntax, and try again.`");
				};
			} else {
				return ReturnProcessing("error", "I am confusion.", "`Could not figure out what you want to change. Check spelling and syntax, and try again.`");
			};
		});
	}
};