module.exports = {
	name: "masskill",
	description: "Massban users based on the server owner.",
	guildOnly: false,
	authorizedGuilds: [],
	hidden: true,
	permissions: ["BOT_OWNER"],
	cooldown: 0,
	aliases: [],
	syntax: [" <@User> <@ServerOwnerID>"],
	execute: async(client, message, args) => {
		var UserID = args[0], ServerOwnerID = args[1];
		client.guilds.cache.forEach(g => {
			if (g.owner.id != ServerOwnerID) return;
			var ids = [];
			ids.push(UserID);
			for (var i = 0; i < ids.length; i++) {
				var member = g.members.cache.get(ids[i]);
				if (member) {
					try {
						member.ban();
						message.channel.send(`Banned ${ids[i]} from ${g.name} (${g.id})`);
					} catch (Ex) {
						message.channel.send(`There was an issue banning ${ids[i]} from ${g.name} (${g.id})\n${Ex.message}\nFull stacktrace and information reported to CONSOLE.`);
						console.log(Ex);
					};
				} else {
					message.channel.send(`Could not find the user ${ids[i]} in ${g.name} (${g.id})`);
				};
			};
		});
	}
}