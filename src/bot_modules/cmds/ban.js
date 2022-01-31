module.exports = {
	name: "ban",
	description: "Ban those pesky members, whoever they might be.",
	guildOnly: true,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["BAN_MEMBERS"],
	cooldown: 2,
	aliases: ["banhammer"],
	syntax: [" <UserID/@User> [reason]"],
	execute: async(client, message, args) => {

		function ReturnProcessing(typeOfError, errorHeader, errorMsg) {
			var embedEmote = client.config.system.emotes.error;
			var embedColor = client.config.system.embedColors.red;

			if (typeOfError == "warning") {
				embedEmote = client.config.system.emotes.warning;
				embedColor = client.config.system.embedColors.orange;
			} else if (typeOfError == "success") {
				embedEmote = client.config.system.emotes.success;
					embedColor = client.config.system.embedColors.lime;
				};

			if (typeOfError == "warning" || typeOfError == "error") {
				if (errorHeader == null) {
					errorHeader = "Big Oopsie!";
				};
				if (errorMsg == null) {
					errorMsg = "Wait, there is no error message... what?!";
				};
			} else {
				if (errorHeader == null) {
					errorHeader = "Wait, what?";
				};
				if (errorMsg == null) {
					errorMsg = "No extra information provided.";
				};
			};

			var embedFields = [{ name: errorHeader, value: errorMsg }];
			if (typeOfError == "warning" || typeOfError == "error")
				embedFields.unshift({ name: "Uh-oh!", value: "There was an issue while processing your request!" });
			else if (typeOfError == "information")
				embedFields.unshift({ name: "Success!", value: "Your request completed!!!! ^^" });

			message.channel.send({ embed: {
				title: embedEmote + " **Swing the Ban Hammer**",
				color: embedColor,
				fields: embedFields,
				footer: { text: client.config.system.footerText }
			}});
		};


		var member = args[0];
		if (member != null) {
			try {
				member = member.replace(/[<@!>]/g, '');
				if (message.guild.members.cache.get(member) == null) {
					return ReturnProcessing("error", "Ban failed!", "`Cannot ban someone that doesn't exist in the server! What?!`");
				} else if (member === message.author.id) {
					return ReturnProcessing("error", "Ban failed!", "`...Banning yourself? Seriously...`");
				} else if (member === client.user.id) {
					return ReturnProcessing("error", "Ban failed!", "`Self-defense protocols activated.\nTerminated ban protocol... [ OK ]`");
				} else if (!message.guild.members.cache.get(member).bannable) {
					return ReturnProcessing("error", "Ban failed!", "`Cannot ban " + client.users.cache.get(member).tag + " due to higher or same roles.`");
				};
				var sickreason = args.slice(1).join(" ");
				if (sickreason == null || sickreason == undefined || sickreason == "" || sickreason == " ")
					sickreason = "No reason provided.";

				client.users.fetch(member).then(user => {
					user.send({ embed: {
						title: client.config.system.emotes.error + " **Ban Hammer has Spoken!**",
						color: client.config.system.embedColors.red,
						description: "Looks like someone got the ban hammer. You've been removed from **" + message.guild.name + " (" + message.guild.id + ")**!",
						fields: [
							{ name: "Reason", value: sickreason },
							{ name: "Executed at", value: new Date(message.createdAt).toString() }
						],
						footer: { text: client.config.system.footerText }
					}});
				});

				message.guild.members.ban(member, { reason: message.author.tag + " - " + sickreason });
				return ReturnProcessing("success", "Ban was successful!", "`Banned " + client.users.cache.get(member).tag + " from " + message.guild.name + " for " + sickreason + "`");
			} catch (Ex) {
				return ReturnProcessing("error", "Ban failed!", "`" + Ex.message + "`");
			};
		} else
			return ReturnProcessing("error", "Ban failed!", "`Do you want the hammer yourself? Like, what are you doing?!`");
	}
};