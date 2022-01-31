module.exports = {
	name: "about",
	description: "Gets information on the bot, including Bot Information and Host Information.",
	guildOnly: false,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["DEFAULT"],
	cooldown: 2,
	aliases: ["aboutme"],
	syntax: [],
	execute: async(client, message, args) => {

		function Uptime(uptimetype) {
			let totalSeconds = (uptimetype / 1000);
			// let days = parseInt(Math.floor(totalSeconds / 86400)) + " day";
			//let hours = checkTime(Math.floor(parseInt(Math.floor(totalSeconds / 3600)) % 24)) + " hour";
			//totalSeconds %= 3600;
			//let minutes = checkTime(parseInt(Math.floor(totalSeconds / 60))) + " minute";
			//let seconds = checkTime(parseInt(totalSeconds % 60)) + " second";
			let days = parseInt(Math.floor(totalSeconds / 86400)) + " day";
			let hours = Math.floor(parseInt(Math.floor(totalSeconds / 3600)) % 24) + " hour";
			totalSeconds %= 3600;
			let minutes = parseInt(Math.floor(totalSeconds / 60)) + " minute";
			let seconds = parseInt(totalSeconds % 60) + " second";

			if (parseInt(days.substring(0,2)) != 1) days += "s";
			if (parseInt(hours.substring(0,3)) != 1) hours += "s";
			if (parseInt(minutes.substring(0,3)) != 1) minutes += "s";
			if (parseInt(seconds.substring(0,3)) != 1) seconds += "s";

			let uptime = `${days}**, **${hours}**, **${minutes}**, **${seconds}`;
			return uptime;
		};

		function checkTime(i) {
			if (i<10 && i > 0) {i = "0" + i};  // add zero in front of numbers < 10
			return i;
		};

		var osuemotecount = 0;
		if (Object.keys(client.config.system.emotes.osu))
			osuemotecount = Object.keys(client.config.system.emotes.osu).length - 1;
		var botinfo = [
			`- **User Tag (ID):** ${client.user.tag} (${client.user.id})`,
			`- **Version:** ${client.config.system.version.build}${client.config.system.version.branchS} (${client.config.system.version.branch})`,
			`- **Uptime:** ${Uptime(client.uptime)}`,
			`- **Command State:** ${client.config.system.commandState}`,
			`- **Emote Count:** ${Object.keys(client.config.system.emotes).length + osuemotecount} total.`,
			`- **Embed Colors:** ${Object.keys(client.config.system.embedColors).length}`,
			`- **Rotating Status:** ${client.config.system.rotatingStatus.enabled} | ${Object.keys(client.config.system.rotatingStatus.statuses).length} total.`
		];

		var hostmemused = process.memoryUsage(), hostmeminfo = [], os = require("os");
		for (let key in hostmemused) {
			hostmeminfo.push(`${key}: ${Math.round(hostmemused[key] / 1024 / 1024 * 100) / 100} MB`);
		};

		var hostinfo = [
			`- **Node Version:** ${process.version}`,
			`- **Node Uptime:** ${Uptime(process.uptime() * 1000)}`,
			`- **Node Execution Path:** ${process.execPath}`,
			`- **Memory Usage:** ${hostmeminfo.join(" - ")}`,
			`- **Process PID:** ${process.pid}`,
			`- **System Platform:** ${process.platform}`,
			`- **System Architecture:** ${process.arch}`,
			`- **System Uptime:** ${Uptime(os.uptime() * 1000)}`,
			`- **System Version:** ${os.version()}`

		];

		return message.channel.send({ embed: {
			title: client.config.system.emotes.information + " **All about me, *TheCodingBot*!**",
			color: client.config.system.embedColors.blue,
			fields: [
				{ name: "Bot Information", value: botinfo.join("\n") },
				{ name: "Host Information", value: hostinfo.join("\n") }
			],
			footer: { text: client.config.system.footerText }
		}});
	}

};