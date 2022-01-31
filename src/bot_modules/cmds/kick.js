module.exports = {
	name: "kick",
	description: "Kick those pesky members, whoever they might be.",
	guildOnly: true,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["KICK_MEMBERS"],
	cooldown: 2,
	aliases: ["boot"],
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
				title: embedEmote + " **Swing the Boot**",
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
					return ReturnProcessing("error", "Kick failed!", "`Cannot kick someone that doesn't exist in the server! What?!`");
				} else if (member === message.author.id) {
					return ReturnProcessing("error", "Kick failed!", "`...Kicking yourself? Seriously...`");
				} else if (!message.guild.members.cache.get(member).kickable) {
					return ReturnProcessing("error", "Kick failed!", "`Cannot kick " + client.users.cache.get(member).tag + " due to higher or same roles.`");
				};
				var sickreason = args.slice(1).join(" ");
				if (sickreason == null || sickreason == undefined || sickreason == "" || sickreason == " ")
					sickreason = "No reason provided.";

				client.users.fetch(member).then(user => {
					user.send({ embed: {
						title: client.config.system.emotes.warning + " **Uh-oh!**",
						color: client.config.system.embedColors.yellow,
						description: "Oopsie! You've been kicked outta from **" + message.guild.name + " (" + message.guild.id + ")**!",
						fields: [
							{ name: "Reason", value: sickreason },
							{ name: "Executed at", value: new Date(message.createdAt).toString() }
						],
						footer: { text: client.config.system.footerText }
					}});
				});
				message.guild.members.cache.get(member).kick(message.author.tag + " - " + sickreason);

				return ReturnProcessing("success", "Kick was successful!", "`Kicked " + client.users.cache.get(member).tag + " from " + message.guild.name + " for " + sickreason + "`");
			} catch (Ex) {
				return ReturnProcessing("error", "Kick failed!", "`" + Ex.message + "`");
			};
		} else
			return ReturnProcessing("error", "Kick failed!", "`There, you kicked some air, happy?`");
	}
};