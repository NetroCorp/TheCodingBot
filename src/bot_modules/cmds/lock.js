module.exports = {
	name: "lock",
	description: "Lockdown that channel!",
	guildOnly: true,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["MANAGE_CHANNELS"],
	cooldown: 2,
	aliases: ["lockdown"],
	syntax: [
//		" all"
	],
	execute: async(client, message, args) => {

		const start = Date.now();

		function respond(color, msg) {
			message.channel.send({ embed: {
				color: client.config.system.embedColors[color],
				description: `**${msg}**`,
				footer: { text: client.config.system.footerText }
			}});
		};

// 5/12/2021 - For now, let's disable the "all" system.
/*
		if (args[0] && args[0] == "all") {
			const channels = message.guild.channels.cache.filter(ch => public.includes(ch.id));
			await Promise.all(message.guild.channels.cache.map(lockChannel));
			respond("lime", ":lock: All public channels are now locked!");
			return;
		} else { */
			const success = await lockChannel(message.channel);
			if (success) respond("lime", `:lock: This channel is now locked! (It took ${Date.now() - start}ms.)`);
			else respond("red", client.config.system.emotes.error + " Ack! Channel already locked!");
			return;
//		};

		async function lockChannel(channel) {
			let permission = channel.permissionOverwrites.find(po => po.id == channel.guild.roles.everyone);
			if (permission && permission.deny.has("SEND_MESSAGES")) return false;

			await channel.updateOverwrite(channel.guild.me, { "SEND_MESSAGES": true, "MANAGE_PERMISSIONS": true });
//			channel.guild.roles.cache.forEach(async ro => {
//				var permissions = message.channel.permissionsFor(ro);
//				if (permissions.has("MANAGE_CHANNELS")) await channel.updateOverwrite(ro, { "SEND_MESSAGES": true });
//			});
			await channel.updateOverwrite(channel.guild.roles.everyone, { "SEND_MESSAGES": false, "ADD_REACTIONS": false });
			return true;
		};
	}
};