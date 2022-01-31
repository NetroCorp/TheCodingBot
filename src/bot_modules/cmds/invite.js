module.exports = {
	name: "invite",
	description: "Gets the invite link for TheCodingBot.",
	guildOnly: false,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["DEFAULT"],
	cooldown: 5,
	aliases: ["add"],
	syntax: [],
	execute: async(client, message, args) => {
		function nth(n) { return ["st", "nd", "rd"][((n + 90) % 100 - 10) % 10 - 1] || "th" }
		var guildCountThing = client.guilds.cache.size + 1 + nth(client.guilds.cache.size + 1);

		message.channel.send({
			embed: {
				title: client.config.system.emotes.information + " **Invite**",
				color: client.config.system.embedColors.green,
				fields: [
					{ name: "OwO what's this~?", value: `A new server?!??! Heck ya!\nAdd me and become the **${guildCountThing}** server!\nTest my features with your own restrictions!\nThe possibilities are endless!` },
					{ name: "Add me!", value: "Add me via [Discord](https://discord.com/oauth2/authorize?scope=bot&client_id=438532019924893707&permissions=8)." },
					{ name: "...or is something wrong...?", value: "Join the Development Support Server via [Discord](https://discord.gg/HdKeWtV) or Direct Message <@222073294419918848>." }
				],
				footer: { text: client.config.system.footerText }
			}
		});
	},
};