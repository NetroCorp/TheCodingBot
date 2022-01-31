module.exports = {
	name: "verify",
	description: "Verification. What else can I say?",
	guildOnly: true,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["DEFAULT"],
	cooldown: 2,
	aliases: [],
	syntax: [],
	syntax: [" <ChannelID/#Channel> <RoleID/@Role"],
	execute: async(client, message, args) => {

		function upSS() {
			updateConfig(client, client.config.allServerSettings, "allServerSettings");
			client.currentServer = client.config.allServerSettings.customServers[message.guild.id];
		};

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

			message.channel.send({ embed: {
				title: embedEmote + " **Verification**",
				color: embedColor,
				fields: embedFields,
				footer: { text: "Verification Powered by TheCodingBot! | " + client.config.system.footerText }
			}});
		};

		if (args[0] == "-setup") {
			if (client.currentServer.coolThings.verification.enabled == "true" && client.channels.cache.get(client.currentServer.coolThings.verification.channel) != undefined) return ReturnProcessing("error", "Verification failed!", "`Verification is setup already on this server. Use '" + client.currentServer.prefix + "config verification <#channelORchannelID>' to change it.`");
			else {
				if (!args[1] || args[1] == null || args[1] == "" || args[1] === undefined) return ReturnProcessing("error", "Verification Setup failed!", "`Please enter a <#channelORchannelID>`");
				else if (!args[2] || args[2] == null || args[2] == "" || args[2] === undefined) return ReturnProcessing("error", "Verification Setup failed!", "`Please enter a <@&roleORroleID>`");
				else {
					try {
						client.currentServer.coolThings.verification.channel = args[1].replace(/[<#>]/g, '');
						client.currentServer.coolThings.verification.role = args[2].replace(/[<@&>]/g, '');
						client.currentServer.coolThings.verification.codeLength = client.config.allServerSettings.default.coolThings.verification.codeLength;
						client.currentServer.coolThings.verification.enabled = "true";

						upSS(); // Update config now

						return ReturnProcessing("success", "Changing the verification channel was successful!", "`The verification channel has been updated successfully!`");
					} catch (Ex) {
						return ReturnProcessing("error", "Changing the verification channel failed!", "`" + Ex.message + "`");
					};
				};
			};
		} else {

			if (client.currentServer.coolThings.verification.enabled != "true") return ReturnProcessing("error", "Verification failed!", "`Verification is not setup on this server.`");
			else if (client.channels.cache.get(client.currentServer.coolThings.verification.channel) != undefined) {
				var vchannel = client.channels.cache.get(client.currentServer.coolThings.verification.channel);
				if (message.channel.id == vchannel.id) {

					if (message.member.roles.cache.has(client.currentServer.coolThings.verification.role)) {
						return ReturnProcessing("error", "Verification failed!", "`You have already been verified!`");
					};

					// Load Verification
					configReloader(client, "verification.json")

					var code = "";
					var random = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&()-=+[{]}";

					for (var i = 0; i < client.currentServer.coolThings.verification.codeLength; i++) {
						code += random.charAt(Math.floor(Math.random() * random.length));
					};


					var myVerify = {
						"role": client.currentServer.coolThings.verification.role,
						"user": message.author.id,
						"guild": message.guild.id
					};
					client.config.verification[code] = myVerify;
					updateConfig(client, client.config.verification, "verification");

					message.delete().catch(err => { }); // Handle it, but don't :)
					message.author.send("Welcome to **" + message.guild.name + "**!", { embed: {
						title: client.config.system.emotes.information + " **Verification**",
						color: client.config.system.embedColors.pink,
						description: "Please send the following code exactly how it is in this bot's DM, and you'll be done.\n__Your code is__: **" + code + "**",
						footer: { text: "Verification Powered by TheCodingBot! | " + client.config.system.footerText }
					}}).catch(err => {
						// return ReturnProcessing("error", "Verification failed!", "`Please make sure your DMs are on and run this command again.`");
						message.channel.send("Welcome to **" + message.guild.name + "**!", { embed: {
							title: client.config.system.emotes.information + " **Verification**",
							color: client.config.system.embedColors.pink,
							description: "Please send the following code exactly how it is in this channel, and you'll be done.\n__Your code is__: **" + code + "**",
							footer: { text: "Verification Powered by TheCodingBot! | " + client.config.system.footerText + " | Error sending a DM, reverting to origin channel." }
						}});
					});
				} else { return ReturnProcessing("error", "Verification failed!", "`Silly, verification cannot be done here!`"); };
			} else { return ReturnProcessing("error", "Verification failed!", "`Verification is enabled, but the channel is missing or I have no access.`"); };
		};
	}
};