module.exports = {
	name: "dupecheck",
	description: "Checks for duplicated IDs and stuff.",
	guildOnly: false,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["DEFAULT"],
	cooldown: 2,
	aliases: ["dupes"],
	syntax: [],
	execute: async(client, message, args) => {
		function onlyUnique(value, index, self) { return self.indexOf(value) == index };

		const list = args, filtered = list.filter(onlyUnique);
		return message.channel.send(`Filtered out **${list.length - filtered.length}**/**${list.length}** duplicates: \`\`\`fix\n${filtered.join(" ")}\`\`\``);
	}
};