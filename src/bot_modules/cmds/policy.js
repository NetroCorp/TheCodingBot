module.exports = {
	name: "policy",
	description: "Gets the Privacy Policy for TheCodingBot.",
	guildOnly: false,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["DEFAULT"],
	cooldown: 2,
	aliases: ["privacypolicy", "pp"],
	syntax: [],
	execute: async(client, message, args) => {
		return message.channel.send({ embed: {
			title: client.config.system.emotes.information + " **TheCodingBot Privacy Policy**",
			color: client.config.system.embedColors.dark_blue,
			fields: [
				{ name: "Oh? So you're approaching my Privacy Policy?", value: "Now that you've executed the command, please take some time to read our [Privacy Policy](https://tcb.nekos.tech/privacy). By using TheCodingBot, you are agreeing that you have read our Privacy Policy and that you agree to the terms listed in the Privacy Policy." }
			],
			footer: { text: client.config.system.footerText }
		}});
	}
};