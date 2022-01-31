module.exports = async (client, message) => {

	// Verification

	// Load Verification
	configReloader(client, "verification.json");

	var triedCodes = [];
	var roleID, serverID;
	async function goodCode(userCode) {

		var data = client.config.verification[userCode];

		if (data == undefined || data == null || data == "" || data == " ")
			return "ignore";
		else if (data["user"] != message.author.id)
			return "ignore";

		serverID = data["guild"], roleID = data["role"];

		var rllyGood = false;
		Object.keys(client.config.verification).forEach(function(key){ if (userCode == key) rllyGood = true; });

		if (rllyGood)
			return true;
		else
			return false;
	};

	var good = await goodCode(message.content);

	if (good == true) {
		try {
			var memRole = client.guilds.cache.get(serverID).roles.cache.get(roleID);
			client.guilds.cache.get(serverID).members.cache.get(message.author.id).roles.add(memRole);

			await sleep(200); // ACK! We jst updated, give a few moments...

			delete client.config.verification[message.content];
			updateConfig(client, client.config.verification, "verification");

			await sleep(500); // ACK! We jst updated, give a few moments... (again)

			message.delete().catch(err => { }); // Handle it, but don't :)

			message.channel.send({ embed: {
				title: client.config.system.emotes.success + " **Verification for " + client.guilds.cache.get(serverID).name + " Completed!**",
				color: client.config.system.embedColors.lime,
				description: "Enjoy your stay!",
				footer: { text: "Verification Powered by TheCodingBot! | " + client.config.system.footerText }
			}});

		} catch (Ex) {
			message.channel.send({ embed: {
				title: client.config.system.emotes.error + " **Verification for " + client.guilds.cache.get(serverID).name + " Failed!**",
				color: client.config.system.embedColors.red,
				description: "Please report to Developers and/or Server Staff you are verifying for:\n`" + Ex.message + "`",
				footer: { text: "Verification Powered by TheCodingBot! | " + client.config.system.footerText }
			}});
		};
		return;
	} else if (good == false) {
		message.channel.send({ embed: {
			title: client.config.system.emotes.error + " **Verification " + ((serverID != undefined && serverID != null) ? "for " + client.guilds.cache.get(serverID).name: "") + " Failed!**",
			color: client.config.system.embedColors.red,
			description: "Make sure what you have typed is correct before trying again.",
			footer: { text: "Verification Powered by TheCodingBot! | " + client.config.system.footerText }
		}});
		return;
	};
};