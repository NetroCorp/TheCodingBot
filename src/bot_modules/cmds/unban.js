module.exports = {
	name: "unban",
	description: "Is that member finally being good? Accidentally banned someone? Oops.",
	guildOnly: true,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["BAN_MEMBERS"],
	cooldown: 2,
	aliases: ["unhammer"],
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
				title: embedEmote + " **Undo the Ban Hammer**",
				color: embedColor,
				fields: embedFields,
				footer: { text: client.config.system.footerText }
			}});
		};


		var member = args[0];
		if (member != null) {
			try {
				member = member.replace(/[<@!>]/g, '');
				async function getBan(user) {
					var theUser = client.users.cache.get(user);

					const bans = await message.guild.fetchBans();
					if (bans.get(user.id))
						return true;
					else
						return ((bans.some(u=>u.id === user.id)) || false);
				};
				member = member.replace(/[<@!>]/g, '');
				if (message.guild.members.cache.get(member) != null) {
					return ReturnProcessing("error", "Unban failed!", "`Cannot unban someone that does exist in the server! What?!`");
				} else if (member === message.author.id) {
					return ReturnProcessing("error", "Unban failed!", "`You're not banned. Gimme a User ID who IS banned.`");
				};

				var banned = await getBan(member);
				if (!banned) {
					return ReturnProcessing("error", "Unban failed!", "`User not banned. Did you already unban them?`");
				};

				var betterreason = args.slice(1).join(" ");
				if (betterreason == null || betterreason == undefined || betterreason == "" || betterreason == " ")
					betterreason = "No reason provided.";
				message.guild.members.unban(member, message.author.tag + " - " + betterreason).then(() => {
					return ReturnProcessing("success", "Unban was successful!", "`Unbanned " + client.users.cache.get(member).tag + " from " + message.guild.name + " for " + betterreason + "`");
				}).catch(err => {
					if (err.message.includes("Unknown Ban")) {
						return ReturnProcessing("error", "Unban failed!", "`User not banned. Did you already unban them?`");
					};
				});
			} catch (Ex) {
				return ReturnProcessing("error", "Unban failed!", "`" + Ex.message + "`");
			};
		} else
			return ReturnProcessing("error", "Unban failed!", "`You're not banned. Gimme a User ID who IS banned.`");
	}
};