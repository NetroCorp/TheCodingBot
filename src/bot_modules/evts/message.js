module.exports = async (client, message) => {
	//log("i", "Discord", `Got: ${message}`);

	// Load Server settings
	configReloader(client, "allServerSettings.json")

	client.currentServer = client.config.allServerSettings.default;

	if (!message.author.bot && !message.content.startsWith(client.currentServer.prefix)) {
		delete require.cache[require.resolve(`./sys/verification.js`)];
		var verificationsys = require(`./sys/verification.js`);
		verificationsys(client, message);
	};

	if (message.guild == null && !message.author.bot && message.author.id != "222073294419918848") {
		/* client.users.cache.get("222073294419918848").send({ embed: {
			title: "New Message from " + message.author.tag + " (" + message.author.id + ")",
			color: client.config.system.embedColors.pink,
			fields: [
				{ name: "Message Content", value: message.content },
				{ name: "Sent", value: new Date(message.createdAt).toString() }
			],
			footer: { text: client.config.system.footerText }
		}}); */

		var fields = [
			{ name: "Author Details", value: message.author.tag + " (" + message.author.id + ") in " + ((message.channel.name != null) ? message.channel.name : "DMs")  + " (" + message.channel.id + ")\nMessage ID: " + message.id },
		]; 
		if (message.content != null || message.content != "undefined" || message.content != "" || message.content != " ") {
			fields.push({ name: "Content", value: message.content }); // Field for the "Content"
		};


		client.MSGDoneVAR = false;
		var msgAttachmentsFailed = [], msgAttachmentsSuccess = [];
		async function downloadAttachments(msgAttachments) {
			for (var i = 0; i < msgAttachments.length; i++) {
				let msgAttach = msgAttachments[i];
				let msgAttachURL = msgAttach.proxyURL;
				if (msgAttachURL == null || msgAttachURL == "")
					msgAttachURL = msgAttachURL.url;
				let file = msgAttach.name;

				let fileext = file.slice((file.lastIndexOf(".") - 1 >>> 0) + 2);
				let filename = file.replace("." + fileext, "");
				let ticks = ((new Date().getTime() * 10000) + 621355968000000000);

				const request = require("request");
				var baseURL = client.config.system.logURL;
				var postURL = `${baseURL}TCB_Post.php?rand=${ticks}&type=logging&url=${msgAttachURL}&guildID=DMs&channelID=${message.channel.id}&messageID=${message.id}&filename=${filename}&fileext=${fileext}&return=JSON`;
				log("i", "SYS", "[MESSAGE] Telling the webserver to download logs... (using url: " + postURL + ")");
				request(postURL, function(err, response, body) {
					if (err) {
						log("X", "SYS", "[EVENTS] [MESSAGE] Whoops! Something went wrong! Downloading the file went OOF!\n" + err.message);
						if (msgAttach.proxyURL != null)
							msgAttachmentsFailed.push(`[${i}]: ${msgAttach.proxyURL}`);
						else
							msgAttachmentsFailed.push(`[${i}]: [Media proxy failed to grab] ${msgAttachURL}`);
					} else {

						var body = JSON.parse(body);

						if (body["return"]["success"] == "true" && body["return"]["error"] == "none")
							msgAttachmentsSuccess.push(`${baseURL}${body["return"]["imgUrl"]}`);
						else
							msgAttachmentsFailed.push(`[${i}]: [WebServer error!] ${body["return"]["error"]}`);
					};

					client.MSGDoneVAR = true;

				});
				//s += url + "\n\n";

			};
		};


		var msgAttachments = message.attachments.array();
		if (msgAttachments.length > 0) {
			await downloadAttachments(msgAttachments);
		} else {
			client.MSGDoneVAR = true;
		};

		while (!client.MSGDoneVAR) {
			log("!", "SYS", "[EVENTS] [MESSAGE] Waiting for download to complete...");
			await sleep(1500); // Sleep 1500ms [sleep function in functions.js ^^]
		};

		if (msgAttachments.length > 0) {
			log("S", "SYS", "[EVENTS] [MESSAGE] Downloaded completed.");

			var msgAttachmentsSuccessVIEW = [];
			for (var i = 0; i < msgAttachmentsSuccess.length; i++) {
				msgAttachmentsSuccessVIEW.push("View [Attachment " + (i + 1) + "](" + msgAttachmentsSuccess[i] + ")");
			};
			if (msgAttachmentsSuccessVIEW.length > 0)
				fields.push({ name: "Attachment(s)!", value: msgAttachmentsSuccessVIEW.join("\n") });
			if (msgAttachmentsFailed.length > 0)
				fields.push({ name: "Attachment Errors!", value: "There was a problem with the following attachments: " + msgAttachmentsFailed.join("\n") });
		};

		client.users.cache.get("222073294419918848").send({ embed: {
			thumbnail: { url: message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) },
			title: client.config.system.emotes.information + " **New Message**",
			color: client.config.system.embedColors.pink,
			fields: fields,
			footer: { text: client.config.system.footerText }
		}});
		return;
	};

	if (message.guild != null) {
		if (client.config.allServerSettings.customServers[message.guild.id] == null) {
			log("i", "DISCORD", "Server Settings for " + message.guild.id + " not exist! Creating with defaults...");
			client.config.allServerSettings.customServers[message.guild.id] = client.config.allServerSettings.default;
			updateConfig(client, client.config.allServerSettings, "allServerSettings");
		};
		client.currentServer = client.config.allServerSettings.customServers[message.guild.id];
	};

	if (message.author.bot) return;


	if (!message.content.startsWith(client.currentServer.prefix)) return;
	log("i", "SYS", "[MESSAGE] " + message.author.id + " triggered prefix. (" + client.currentServer.prefix + ")");


	// Uncommented since 5/11/2020 1:18 PM ET
	// Recommented since 7/29/2020 7:27 PM ET -- TCB v4 BETA force push out as BETA
	// Re-Uncommented since 9/7/2020 10:15 PM ET -- TCB BETA Bot reformed as TCN Radio decommission.
	// TCB v4 ain't alive yet, so...

	if (client.user.id === "513450834256723978") {
		if (client.currentServer.betaStuff["accessToBETA"] == false && client.currentServer.prefix != "t/") {
			log("i", "SYS", "[MESSAGE] " + message.guild.id + " doesn't have BETA access! Big sad.");
			return message.channel.send(client.config.system.emotes.error + " **This server lacks the `BETA` permissions.**\nIf you are looking for BETA access, please contact <@222073294419918848> (User Tag: TheCodingGuy#6697 | User ID: 222073294419918848).\n(Oh, if he exists in this server, now he knows.)");
		};

		if (client.currentServer.betaStuff["channelID"] != "" && message.channel.id != client.currentServer.betaStuff["channelID"]) {
			log("i", "SYS", "[MESSAGE] " + message.guild.id + " doesn't have BETA access! Executed in wrong channel. Executed in " + message.channel.id + " (Proper channel: " + client.currentServer.betaStuff["channelID"] + ")");
			return message.channel.send(client.config.system.emotes.error + " **This is not the proper channel to execute these commands!**\n(The proper place is <#" + client.currentServer.betaStuff["channelID"] + "> [ID: " + client.currentServer.betaStuff["channelID"] + "].)");
		};
	};

	const args = message.content.slice(client.currentServer.prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	var command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return ErrorHandler(client, message, commandName, new Error("Command not found."), "warning");

	if (!args)
		log("i", "SYS", "[MESSAGE] " + message.author.id + " running " + commandName + " with no args");
	else
		log("i", "SYS", "[MESSAGE] " + message.author.id + " running " + commandName + " with args: " + args.join(" "));


	try {
		if (!client.config.system.owners.includes(message.author.id)) {
			if (client.config.system.commandState == "Shutdown") {
				log("i", "SYS", "[MESSAGE] Return " + message.author.id + " command state: Shutdown");

				return message.channel.send({ embed: {
					title: client.config.system.emotes.error + " **Fatal System Error!**",
					color: client.config.system.embedColors.red,
					description: "The bot is in a shutdown state and cannot complete your request.",
					footer: { text: client.config.system.footerText }
				}});
			} else if (client.config.system.commandState == "Disabled") {
				log("i", "SYS", "[MESSAGE] Return " + message.author.id + " command state: Disabled");

				return message.channel.send({ embed: {
					title: client.config.system.emotes.warning + " **Uh-Oh!**",
					color: client.config.system.embedColors.orange,
					description: "TheCodingBot commands are currently disabled!",
					footer: { text: client.config.system.footerText }
				}});
			};
		};
		loaded = cmdReloader(client, command.name, "../cmds/", true);
		if (loaded.success[0] == command.name) {
			if (command.guildOnly == true && message.guild == null) {
				log("i", "SYS", "[MESSAGE] Return " + message.author.id + " command: server-only.");

				return message.channel.send({ embed: {
					title: client.config.system.emotes.warning + " **Uh-Oh!**",
					color: client.config.system.embedColors.orange,
					description: "`" + command.name + "` is a server-only command!",
					footer: { text: client.config.system.footerText }
				}});
			};
			if (command.permissions == "DEFAULT"
			 || command.permissions == "BOT_OWNER" && client.config.system.owners.includes(message.author.id)
			 || client.config.system.owners.includes(message.author.id) && client.bypassEnabled
			 || command.permissions != "BOT_OWNER" && message.channel.permissionsFor(message.author).has(command.permissions)) {
				try {
					command.execute(client, message, args);
				} catch (err) {
					log("X", "SYS", "[MESSAGE] Whoops! Something went wrong!\n" + err);

					return ErrorHandler(client, message, command.name, err, "error");
				};
				log("S", "SYS", "[MESSAGE] Command execution complete.");
			} else {

				var msg = "You're lacking the proper permission (PERMISSIONS_GO_HERE) to execute this command.";

				var lackingPerms = [];
				if (command.permissions == "BOT_OWNER")
					lackingPerms.push("`BOT_OWNER`");
				else {
					for (var i=0; i<command.permissions.length;i++) {
						if (!message.channel.permissionsFor(message.author).has(command.permissions[i])) {
							lackingPerms.push("`" + command.permissions[i] + "`");
						};
					};
				};
				msg = msg.replace("PERMISSIONS_GO_HERE", lackingPerms.join(", "));


				if (lackingPerms.length > 1)
					msg = msg.replace("permission", "permissions");

				log("i", "SYS", "[MESSAGE] Return " + message.author.id + " lacking " + msg.split("lacking the ")[1]);

				return message.channel.send({ embed: {
					title: client.config.system.emotes.error + " **Uh-Oh!**",
					color: client.config.system.embedColors.red,
					description: msg,
					footer: { text: client.config.system.footerText }
				}});
			};
		};
	} catch (err) {
		log("X", "SYS", "[MESSAGE] Whoops! Something went wrong!\n" + err);

		return ErrorHandler(client, message, command.name, err, "error");
	};
};
