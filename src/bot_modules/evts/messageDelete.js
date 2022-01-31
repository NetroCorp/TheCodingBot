module.exports = async (client, delmessage) => {
	if (delmessage.author.bot) return; // Verify the "user" isn't a bot. 
	var delcontent = delmessage.content;
	if (delmessage.content == null || delmessage.content == "undefined" || delmessage.content == "" || delmessage.content == " ") {
		delcontent = "** **";
	};

	var fields = [
		{ name: "Author Details", value: delmessage.author.tag + " (" + delmessage.author.id + ") in " + ((delmessage.channel.name != null) ? delmessage.channel.name : "DMs") + " (" + delmessage.channel.id + ")\nMessage ID: " + delmessage.id },
		{ name: "Content", value: delcontent },
	]; // Fields for the "Content"

	if (delmessage.guild == null) { // Check if the guild is null
		if (delmessage.author.id != "222073294419918848") { // Make sure its not Matt
			client.users.cache.get("222073294419918848").send({ embed: {
				thumbnail: { url: delmessage.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) },
				title: client.config.system.emotes.warning + " **Message Deleted**",
				color: client.config.system.embedColors.yellow,
				fields: fields,
				footer: { text: client.config.system.footerText }
			}});
		};
		return;
	};

	client.MSGDELDoneVAR = false;
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
			var postURL = `${baseURL}TCB_Post.php?rand=${ticks}&type=logging&url=${msgAttachURL}&guildID=${delmessage.guild.id}&channelID=${delmessage.channel.id}&messageID=${delmessage.id}&filename=${filename}&fileext=${fileext}&return=JSON`;
			log("i", "SYS", "[MESSAGE DELETE] Telling the webserver to download logs... (using url: " + postURL + ")");
			request(postURL, function(err, response, body) {
				if (err) {
					log("X", "SYS", "[EVENTS] [MESSAGE DELETE] Whoops! Something went wrong! Downloading the file went OOF!\n" + err.message);
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

				client.MSGDELDoneVAR = true;

			});
			//s += url + "\n\n";

		};
	};


	var msgAttachments = delmessage.attachments.array();
	if (msgAttachments.length > 0) {
		await downloadAttachments(msgAttachments);
	} else {
		client.MSGDELDoneVAR = true;
	};

	while (!client.MSGDELDoneVAR) {
		log("!", "SYS", "[EVENTS] [MESSAGE DELETE] Waiting for download to complete...");
		await sleep(1500); // Sleep 1500ms [sleep function in functions.js ^^]
	};

	if (msgAttachments.length > 0) {
		log("S", "SYS", "[EVENTS] [MESSAGE DELETE] Downloaded completed.");

		var msgAttachmentsSuccessVIEW = [];
		for (var i = 0; i < msgAttachmentsSuccess.length; i++) {
			msgAttachmentsSuccessVIEW.push("View [Attachment " + (i + 1) + "](" + msgAttachmentsSuccess[i] + ")");
		};
		if (msgAttachmentsSuccessVIEW.length > 0)
			fields.push({ name: "Attachment(s)!", value: msgAttachmentsSuccessVIEW.join("\n") });
		if (msgAttachmentsFailed.length > 0)
			fields.push({ name: "Attachment Errors!", value: "There was a problem with the following attachments: " + msgAttachmentsFailed.join("\n") });
	};

	// Load Server settings
	configReloader(client, "allServerSettings.json");

	if (client.config.allServerSettings.customServers[delmessage.guild.id] == null) return; // If the server has no settings, what can we do?
	client.currentServer = client.config.allServerSettings.customServers[delmessage.guild.id]; // Load in the server settings.

	var serverMsgLog = client.currentServer.logChannels.deletes;

	if (serverMsgLog == null || serverMsgLog == "") fields.push({name: "Uh-oh...", value: "No log channel for messages that are deleted is setup!"})
	else if (!client.currentServer.logChannels.enabled) fields.push({name: "Uh-oh...", value: "Logging is currently disabled!!"})
	else {
		var channel = client.channels.cache.get(serverMsgLog);
		if (channel != undefined) channel.send({ embed: {
			thumbnail: { url: delmessage.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) },
			title: client.config.system.emotes.warning + " **Message Deleted**",
			color: client.config.system.embedColors.yellow,
			fields: fields,
			footer: { text: client.config.system.footerText }
		}});
		else fields.push({name: "Uh-oh...", value: "Logging channel gone!!"});
	};

};
