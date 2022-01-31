const fs = require("fs");

module.exports = {
	name: "bytes",
	description: "Currency for TheCodingBot that Bytes!",
	guildOnly: false,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["DEFAULT"],
	cooldown: 2,
	aliases: [],
	syntax: [" <bal/balance/$>"],
	execute: async(client, message, args) => {
		message.channel.send({ embed: {
			title: client.config.system.emotes.d_wait + " **Bytes™️**",
			color: client.config.system.embedColors.blue,
			fields: [
				{ name: "Please wait", value: "Connecting you to the Bytes™️ System™️, so sit tight!" },
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
					title: embedEmote + " **Bytes™️**",
					color: embedColor,
					fields: embedFields,
					footer: { text: client.config.system.footerText }
				}});
			};

			// Load Bytes data
			configReloader(client, "bytes.json");

			client.bytesData = client.config.bytes.users;


			function getBytesData(user) {
				try {
					client.bytesData[user.id] = JSON.parse(fs.readFileSync(`./bot_modules/config/bytes/${user.id}.json`, "utf8")); // Update data.
					return "OK";
				} catch (Ex) {
					return Ex.message;
				}

			};

			function updateBytes(user) {
				fs.writeFileSync(`./bot_modules/config/bytes/${user.id}.json`, JSON.stringify(client.bytesData[user.id], null, "\t"), (err) => { if (err) { console.error(err); throw err; } });
				setTimeout(function() {
					getBytesData(user); // Get the Bytes data again
				}, 150);
			};


			if (args[0] != null) {
				var user = message.author;
				if (args[0] == "create") {
					let result = getBytesData(user);
					if (result == "OK") { // Get executor's data
						return ReturnProcessing("error", "Registration for a Bytes™️ Account™️ failed!", "`You already have an account, silly!`");
					};

					msg.edit({ embed: {
						title: client.config.system.emotes.d_wait + " **Bytes™️**",
						color: client.config.system.embedColors.blue,
						fields: [
							{ name: "Please wait", value: "Creating your account...\nYou'll be able to take Bytes of the new system soon!" },
							{ name: "How long will it take?", value: `Depending on the API and latency, from a second to a minute.\nIf you are having problems, try getting latency data with \`${client.currentServer.prefix}ping\`.` }
						],
						footer: { text: client.config.system.footerText }
					}});
					setTimeout(function() {
						try {
							client.bytesData[user.id] = client.bytesData["default"];
							client.bytesData[user.id].bytes = client.config.bytes.start;
							updateBytes(user);
							return ReturnProcessing("success", "Registration for a Bytes™️ Account™️ was successful!", `As a welcome gift, you will get **${client.config.bytes.start}** Bytes!\n\nFor help: \`${client.currentServer.prefix}bytes help\`\nCheck your balance: \`${client.currentServer.prefix}bytes balance\`\n\nHappy Byte Hoarding!~`);
						} catch (Ex) {
							return ReturnProcessing("error", "Registration for a Bytes™️ Account™️ failed!", "`"+Ex+"`");
						};
					}, 500);
				} else {
					let result = getBytesData(user);
					if (result != "OK") { // Get executor's data
						if (result.includes("no such file or directory"))
							return ReturnProcessing("error", "Cannot load Bytes™️ Account™️ Data!", "`You don't have an account, silly! Create one now by running '" + client.currentServer.prefix +"bytes create'`");
						else
							return ReturnProcessing("error", "Cannot load Bytes™️ Account™️ Data!", "`The data could not be read successfully.`");

					};

					if (args[0] == "balance" || args[0] == "bal" || args[0] == "$") {
						return msg.edit({ embed: {
							title: client.config.system.emotes.success + " **Bytes™️**",
							color: client.config.system.embedColors.lime,
							fields: [
								{ name: `${user.username}'s Account`, value: `${user.username} has **${client.bytesData[user.id].bytes}B**!` }
							],
							footer: { text: client.config.system.footerText }
						}});

					} else if (args[0] == "daily") {
						function CheckTimely() {
							if (client.bytesData[user.id].timely["dailyTimestamp"] == 0) return true; // Yay!
							else {
								if (client.bytesData[user.id].timely["dailyTimestamp"] < Date.now()) {
									client.bytesData[user.id].timely["dailyTimestamp"] = 0;
									return true; // Ya, you can claim it now
								} else {
									return false; // REEE YOU GREEDY (Still on timeout)
								};
							};
				
							// Something gone wrong?
							return true; // Oh well.
						};

						var abletoclaim = CheckTimely();
						if (abletoclaim) {
							client.bytesData[user.id].bytes += parseInt(client.config.bytes.timely["daily"]);
							client.bytesData[user.id].timely["dailyTimestamp"] = (Date.now() + 60 * 60 * 24 * 1000);

							updateBytes(user); // Update them Bytes.

							return msg.edit({ embed: {
								title: client.config.system.emotes.success + " **Bytes™️ Daily Timely**",
								color: client.config.system.embedColors.lime,
								fields: [
									{ name: "Bytes Obtained!", value: `**${client.config.bytes.timely["daily"]}B** as been added (**1x** streak) `},
									{ name: `${user.username}'s Account`, value: `${user.username} now has **${client.bytesData[user.id].bytes}B**!` }
								],
								footer: { text: client.config.system.footerText }
							}});
						} else {
							let timeleft = TStoHR(client.bytesData[user.id].timely["dailyTimestamp"] - Date.now());
				
							let coolMsgs = [ "It's not time to do that yet!", "Slow please!!", "No need to step on the Gas, Gas, Gas.", "Calm down a bit!", "Please wait...", "Grab a coffee.", "Ack!", "Eep!" ];
							let coolMsg = coolMsgs[Math.floor(Math.random() * coolMsgs.length)];

							return msg.edit({ embed: {
								title: client.config.system.emotes.warning + " **Bytes™️ Daily Timely**",
								color: client.config.system.embedColors.yellow,
								fields: [
									{ name: coolMsg, value: `You still have ${timeleft} remaining~!` }
								],
								footer: { text: client.config.system.footerText }
							}});
						};

					} else if (args[0] == "hourly") {

						function CheckTimely() {
							if (client.bytesData[user.id].timely["hourlyTimestamp"] == 0) return true; // Yay!
							else {
								if (client.bytesData[user.id].timely["hourlyTimestamp"] < Date.now()) {
									client.bytesData[user.id].timely["hourlyTimestamp"] = 0;
									return true; // Ya, you can claim it now
								} else {
									return false; // REEE YOU GREEDY (Still on timeout)
								};
							};
				
							// Something gone wrong?
							return true; // Oh well.
						};

						var abletoclaim = CheckTimely();
						if (abletoclaim) {
							client.bytesData[user.id].bytes += parseInt(client.config.bytes.timely["hourly"]);
							client.bytesData[user.id].timely["hourlyTimestamp"] = (Date.now() + 60 * 60 * 1000);

							updateBytes(user); // Update them Bytes.

							return msg.edit({ embed: {
								title: client.config.system.emotes.success + " **Bytes™️ Hourly Timely**",
								color: client.config.system.embedColors.lime,
								fields: [
									{ name: "Bytes Obtained!", value: `**${client.config.bytes.timely["hourly"]}B** as been added (**1x** streak) `},
									{ name: `${user.username}'s Account`, value: `${user.username} now has **${client.bytesData[user.id].bytes}B**!` }
								],
								footer: { text: client.config.system.footerText }
							}});
						} else {
							let timeleft = TStoHR(client.bytesData[user.id].timely["hourlyTimestamp"] - Date.now());
				
							let coolMsgs = [ "It's not time to do that yet!", "Slow please!!", "No need to step on the Gas, Gas, Gas.", "Calm down a bit!", "Please wait...", "Grab a coffee.", "Ack!", "Eep!" ];
							let coolMsg = coolMsgs[Math.floor(Math.random() * coolMsgs.length)];

							return msg.edit({ embed: {
								title: client.config.system.emotes.warning + " **Bytes™️ Hourly Timely**",
								color: client.config.system.embedColors.yellow,
								fields: [
									{ name: coolMsg, value: `You still have ${timeleft} remaining~!` }
								],
								footer: { text: client.config.system.footerText }
							}});
						};

					} else if (client.config.system.owners.includes(message.author.id)) {
						if (args[0] == "give") {
							if (!args[1] || args[1] == null || args[1] == "")
								return ReturnProcessing("error", "Cannot give Bytes™️!", "Please enter an amount to give..?");
							else if (isNaN(args[1]))
								return ReturnProcessing("error", "Cannot give Bytes™️!", "Your award ain't a number?! NaNi?!");

							if (!args[2] || args[2] == null || args[2] == "")
								return ReturnProcessing("error", "Cannot give Bytes™️!", "Please enter a person to give Bytes to..?");

							var person = args[2].replace(/[<@!>]/g, '');
							var userThing = client.users.cache.get(person);
							getBytesData(userThing);

							client.bytesData[userThing.id].bytes += parseInt(args[1]);

							updateBytes(userThing); // Done done.

							return msg.edit({ embed: {
								title: client.config.system.emotes.success + " **Bytes™️**",
								color: client.config.system.embedColors.lime,
								fields: [
									{ name: `${userThing.username}'s New Account Balance`, value: `${userThing.username} now has **${client.bytesData[userThing.id].bytes}B**!` }
								],
								footer: { text: client.config.system.footerText }
							}});
						} else if (args[0] == "remove") {
							if (!args[1] || args[1] == null || args[1] == "")
								return ReturnProcessing("error", "Cannot remove Bytes™️!", "Please enter an amount to remove..?");
							else if (isNaN(args[1]))
								return ReturnProcessing("error", "Cannot remove Bytes™️!", "Your award ain't a number?! NaNi?!");

							if (!args[2] || args[2] == null || args[2] == "")
								return ReturnProcessing("error", "Cannot remove Bytes™️!", "Please enter a person to take Bytes from..?");

							var person = args[2].replace(/[<@!>]/g, '');
							var userThing = client.users.cache.get(person);
							getBytesData(userThing);

							client.bytesData[userThing.id].bytes -= parseInt(args[1]);

							updateBytes(userThing); // Done done.

							return msg.edit({ embed: {
								title: client.config.system.emotes.success + " **Bytes™️**",
								color: client.config.system.embedColors.lime,
								fields: [
									{ name: `${userThing.username}'s New Account Balance`, value: `${userThing.username} now has **${client.bytesData[userThing.id].bytes}B**!` }
								],
								footer: { text: client.config.system.footerText }
							}});
						};
					};
				};
			};

		});


		function TStoHR(TS) {
			let totalSeconds = (TS / 1000);
			let hours = Math.floor(totalSeconds / 3600);
			totalSeconds %= 3600;
			let minutes = Math.floor(totalSeconds / 60);
			let seconds = totalSeconds % 60;
			let HR = `**${hours} hours, ${minutes} minutes and ${Math.round(seconds)} seconds**`;

			if (hours == 0) HR.replace(hours + " hours,", "");
			else if (hours == 1) HR.replace("hours", "hour");

			if (minutes == 0) HR.replace(minutes + " minutes and ", "");
			else if (minutes == 1) HR.replace("minutes", "minute");

			else if (seconds == 1) HR.replace("seconds", "second");
			return HR;
		};
	}
}