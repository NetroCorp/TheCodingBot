module.exports = {
	name: "prune",
	description: "Deletes a specific amount of messages.",
	guildOnly: true,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["MANAGE_MESSAGES"],
	cooldown: 2,
	aliases: [],
	syntax: [" <numberhere>"],
	execute: async(client, message, args) => {
		var amount = null, silent = false;

		if (args) {

			for (var i = 0; i < args.length; i++) {
				if (args[i] == "-s") silent = true;
				else amount = args[i];
			};
		};

		if (amount == null) return message.channel.send({ embed: {
			title: client.config.system.emotes.error + " **Prune Messages - Uh-Oh!**",
			color: client.config.system.embedColors.red,
			fields: [
				{ name: "Prune Error!", value: "No amount specified." }
			],
			footer: { text: client.config.system.footerText }
		}});
		else if (amount < 2) return message.channel.send({ embed: {
			title: client.config.system.emotes.error + " **Prune Messages - Uh-Oh!**",
			color: client.config.system.embedColors.red,
			fields: [
				{ name: "Prune Error!", value: "That's... kinda pointless.." }
			],
			footer: { text: client.config.system.footerText }
		}});

		message.delete(); // Delete command, then fetch :>

		message.channel.messages.fetch({ limit: amount }).then(fetchedMessages => {
			const messagesToPrune = fetchedMessages.filter(msg => !msg.pinned);
			return message.channel.bulkDelete(messagesToPrune, true);
		}).then(prunedMessages => {
			var msgs = [ "Trashed", "Blew up", "Sent off", "Obliterated" ];

			message.channel.send({ embed: {
				title: client.config.system.emotes.success + " **Prune Messages**",
				color: client.config.system.embedColors.lime,
				fields: [
					{ name: "Prune Success!", value: `${msgs[Math.floor(Math.random() * msgs.length)]} ${prunedMessages.size} message${prunedMessages.size !== 1 ? 's' : ''}.` }
				],
				footer: { text: client.config.system.footerText }
			}}).then(msg => setTimeout(function() { msg.delete(); }, 5000));
		}).catch(err => {
			var fieldsToUse = [];
			if (!err || err.message == null)
				fieldsToUse.push({ name: "Error", value: "No error reported. Um is this normal?" });
			else
				fieldsToUse.push({ name: "Error", value: "`" + err.message + "`" });
			message.channel.send({ embed: {
				title: client.config.system.emotes.error + " **Prune Messages - Uh-Oh!**",
				color: client.config.system.embedColors.red,
				description: `Cannot prune ${amount} messages!!`,
				fields: fieldsToUse,
				footer: { text: client.config.system.footerText }
			}});
		});
	},
};