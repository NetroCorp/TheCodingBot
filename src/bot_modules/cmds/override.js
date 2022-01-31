module.exports = {
	name: "override",
	description: "Override TCBv4's Permission System.",
	guildOnly: false,
	authorizedGuilds: [],
	hidden: true,
	permissions: ["BOT_OWNER"],
	cooldown: 0,
	aliases: ["bypass"],
	syntax: [
		" <enable/disable>"
	],
	execute: async(client, message, args) => {
		if (args[0] == "enable") {
			client.bypassEnabled = true;
		} else if (args[0] == "disable") {
			client.bypassEnabled = false;
		} else {
			message.channel.send(client.config.system.emotes.information + " **OVERRIDE SET TO: `" + client.bypassEnabled + "`.**");
		};		
	}
};