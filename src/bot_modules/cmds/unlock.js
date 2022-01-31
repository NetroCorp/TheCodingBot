module.exports = {
	name: "unlock",
	description: "Unlock that channel!",
	guildOnly: true,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["MANAGE_CHANNELS"],
	cooldown: 2,
	aliases: ["unlockdown"],
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
			await Promise.all(message.guild.channels.cache.map(unlockChannel));
			respond("lime", ":unlock: All public channels are now unlocked!");
			return;
		} else { */
			const success = await unlockChannel(message.channel);
			if (success) respond("lime", `:unlock: This channel is now unlocked! (It took ${Date.now() - start}ms.)`);
			else respond("red", client.config.system.emotes.error + " Eep! Channel not locked!");
			return;
//		};

		async function unlockChannel(channel) {
			let permission = channel.permissionOverwrites.find(po => po.id == channel.guild.roles.everyone);
			if (permission && !permission.deny.has("SEND_MESSAGES")) return false;

			await channel.updateOverwrite(channel.guild.roles.everyone, { "SEND_MESSAGES": true, "ADD_REACTIONS": null });
			return true;
		};
	}
};