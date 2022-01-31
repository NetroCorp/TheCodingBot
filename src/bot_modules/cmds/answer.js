module.exports = {
	name: "answer",
	description: "The answer of life, the universe, and everything.",
	guildOnly: false,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["DEFAULT"],
	cooldown: 2,
	aliases: [],
	syntax: [],
	execute: async(client, message, args) => {
		return message.channel.send("**42**");
	}

};