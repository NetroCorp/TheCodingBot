module.exports = {
	name: "mcs",
	description: "Checks the if a Minecraft Server is offline or online, and gets some basic information on it.",
	guildOnly: false,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["DEFAULT"],
	cooldown: 2,
	aliases: ["mcservchecker", "mcschecker"],
	syntax: [" <ip/domain> [port]"],
	execute: async(client, message, args) => {

		let ip = args[0];
		if (!ip || ip == null || ip == undefined) { throw new Error("Missing argument (ip)."); };

		let port = args[1];
		if (!port || port == null || port == undefined) { port = "25565"; };
	
		message.channel.send({ embed: {
			title: client.config.system.emotes.wait + " **Minecraft Status Checker**",
			color: client.config.system.embedColors.blue,
			description: "**One moment, checking . . .**",
			fields: [
				{ "name": "Status", "value": client.config.system.emotes.wait },
				{ "name": "Players online", "value": client.config.system.emotes.wait },
				{ "name": "Message of the Day (MOTD)", "value": client.config.system.emotes.wait },
				{ "name": "Server", "value": client.config.system.emotes.wait }
				// { "name": "Duration online", "value": client.config.system.emotes.wait },
				// { "name": "Last updated", "value": client.config.system.emotes.wait }
			],
			footer: { text: client.config.system.footerText }
		}}).then(msg => {
			function editMsg(msgContent) {
				msg.edit(msgContent);
			};

			const request = require("request");
			var url = `https://mcapi.us/server/status?ip=${ip}&port=${port}`;
			request(url, function(err, response, body) {
				if (err) {
					log("X", "SYS", "Error while getting unresolved infomartion for Minecraft Server at: " + url + ".");
					console.log(err);
					editMsg({ embed: {
						title: client.config.system.emotes.error + " **Minecraft Status Checker - API Error**",
						color: client.config.system.embedColors.red,
						description: "Something went wrong while checking the status.\nThe incident has been reported to the CONSOLE.",
						footer: { text: client.config.system.footerText }
					}});
					return;
				};

				body = JSON.parse(body);
				if (port != "25565") ip = ip + ":" + port;

				if (body.status == "error") {
					log("X", "SYS", "Error occurred while checking status.\n");
					// console.log(body);
					editMsg({ embed: {
						title: client.config.system.emotes.error + " **Minecraft Status Checker**",
						color: client.config.system.embedColors.red,
						description: "**" + ip + "** failed to be checked.",
						fields: [
							{ "name": "Error", "value": body.error }
							// { "name": "Last updated", "value": "Now" }
						],
						footer: { text: client.config.system.footerText }
					}});
					return;
				};

				if (body.online == true) {
					var fields = [{ name: "Status", value: "Online" }];

					var playerdata = "No one is online :(. Get in the game to be the first player!";
					if (body.players.now) playerdata = `${body.players.now} out of ${body.players.max}`;
					fields.push({ name: "Players online", value: playerdata });

					if (body.motd && body.motd != null && body.motd != undefined && body.motd != "")
						fields.push({ name: "Message of the Day (MOTD)", value: body.motd });

					if (body.server && body.server.name != "")
						fields.push({ "name": "Server", "value": body.server.name });

					// fields.push(
					// { "name": "Duration online", "value": body.duration },
					// { "name": "Last updated", "value": body.last_updated }
					// );

					var embedToUse = {
						title: client.config.system.emotes.success + " **Minecraft Status Checker**",
						color: client.config.system.embedColors.lime,
						fields: fields,
						footer: { text: client.config.system.footerText }
					};

					var attachment = null;
					if (body.favicon && body.favicon != null && body.favicon != "") {
						var imgDir = "bot_modules/imgs/mcs";
						var fileName = `${ip}_${port}`, fileExt = "png";
						var fileLocation = "./"+imgDir + "/" + fileName + "." + fileExt;
						var attachmentLocation = process.env.PWD + "/" + imgDir + "/" + fileName + "." + fileExt;

						var success = Base64ToImg(body.favicon, fileLocation.replace("."+fileExt, ""));
						if (success) {
							var Discord = require("discord.js");
							attachment = new Discord.MessageAttachment(attachmentLocation, fileName+"."+fileExt);
							embedToUse.thumbnail = { url: "attachment://"+fileName+"."+fileExt };
							//message.channel.send({ files: [attachment], embed: { title: "Example~", image: { url: "attachment://"+fileName+"."+fileExt } }});
						};
					};

					if (embedToUse.thumbnail != null) {
						msg.delete();
						message.channel.send({ files: [attachment], embed: embedToUse });
					} else
						msgEdit({ embed: embedToUse });


					async function Base64ToImg(b64data, fileOut) {
						var success = false;
						var ba64 = require("ba64");
						await ba64.writeImage(fileOut, b64data, function(err) {
							if (err) {
								log("X", "SYS", "There was an error saving the MCS Favicon. The out image file is likely now corrupt!");
								console.error(err);

								success = false;
								return success;
							};
							success = true;
							return success;
						});

						return success;
					};
				} else {
					editMsg({ embed: {
						title: client.config.system.emotes.warning + " **Minecraft Status Checker**",
						color: client.config.system.embedColors.orange,
						fields: [
							{ "name": "Status", "value": "Offline" }
							// { "name": "Last updated", "value": body.last_updated }
						],
						footer: { text: client.config.system.footerText }
					}});
				};
			});
		});
		return;
	}
};