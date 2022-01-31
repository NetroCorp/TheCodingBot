module.exports = {
	name: "ping",
	description: "Checks the latency between the bot and Discord.",
	guildOnly: false,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["DEFAULT"],
	cooldown: 2,
	aliases: ["pingus", "pingas"],
	syntax: [],
	execute: async(client, message, args) => {
		var apiping = Math.round(client.ws.ping);
		message.channel.send({ embed: {
			title: client.config.system.emotes.d_wait + " **Ping?**",
			color: client.config.system.embedColors.blue,
			fields: [
				{ name: "Discord API Ping", value: `**${apiping}ms**` },
				{ name: "Discord Message Latency", value: "Waiting for result, please wait..." },
				{ name: "There maybe problems...", value: `If you continue to see this message without any edits, something's done goofed.\nVisit \`${client.currentServer.prefix}status\` for Status Information for Discord.` }
			],
			footer: { text: client.config.system.footerText }
		}}).then(msg => {
			apiping = Math.round(client.ws.ping);
			var latencyTest = (msg.createdTimestamp - message.createdTimestamp);
			var fieldsToUse = [{ name: "Discord API Ping", value: `**${apiping}ms**` }, { name: "Discord Message Latency", value: `**${latencyTest}ms**` }];

			if (latencyTest > 20000)
				fieldsToUse.push({ name: "Discord Message Latency Warning!", value: `Seems the Message Latency is higher than normal. The system this bot is hosted on may be experiencing lag or Discord's becoming unresponsive.\nVisit \`${client.currentServer.prefix}status\` for Status Information for Discord.`})
			if (apiping > 1500)
				fieldsToUse.push({ name: "Discord API Ping Warning!", value: `Seems the API Ping is higher than normal. The system this bot is hosted on may be experiencing lag or Discord's API is becoming unresponsive.\nVisit \`${client.currentServer.prefix}status\` for Status Information for Discord.`})
			msg.edit({ embed: {
				title: ":ping_pong: **Ping? Pong!**",
				color: client.config.system.embedColors.blue,
				fields: fieldsToUse,
				footer: { text: client.config.system.footerText }
			}});
		});
	},
};