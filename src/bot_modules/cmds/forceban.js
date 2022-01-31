module.exports = {
	name: "forceban",
	description: "Force Ban those xxtra pesky members, whoever they might be.",
	guildOnly: true,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["BAN_MEMBERS"],
	cooldown: 2,
	aliases: ["forcebanhammer"],
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
				title: embedEmote + " **Swing the BIG Ban Hammer**",
				color: embedColor,
				fields: embedFields,
				footer: { text: client.config.system.footerText }
			}});
		};


		var member = args[0];
		if (member != null) {
			try {
				member = member.replace(/[<@!>]/g, '');
				client.users.fetch(member).then(user => { }); // Force user to enter SANDMAN -- I mean cache.

				async function getBan(user) {
					var theUser = client.users.cache.get(user);

					const bans = await message.guild.fetchBans();
					if (bans.get(user.id))
						return true;
					else
						return ((bans.some(u=>u.id === user.id)) || false);
				};

				if (member === message.author.id) {
					return ReturnProcessing("error", "Forceban failed!", "`...Forcebanning yourself? Seriously... a FORCEBAN of all things...`");
				} else if (member === client.user.id) {
					return ReturnProcessing("error", "Forceban failed!", "`Self-defense protocols activated.\nTerminated forceban protocol... [ OK ]`");
				} else if (message.guild.members.cache.get(member) && !message.guild.members.cache.get(member).bannable) {
					return ReturnProcessing("error", "Forceban failed!", "`Cannot forceban " + client.users.cache.get(member).tag + " due to higher or same roles.`");
				};

				var banned = await getBan(member);
				if (banned) {
					return ReturnProcessing("error", "Forceban failed!", "`User already banned. Did you already ban them?`");
				};
				var sickreason = args.slice(1).join(" ");
				if (sickreason == null || sickreason == undefined || sickreason == "" || sickreason == " ")
					sickreason = "No reason provided.";

				message.guild.members.ban(member, { reason: message.author.tag + " - " + sickreason });
				return ReturnProcessing("success", "Forceban was successful!", "`Forcebanned " + client.users.cache.get(member).tag + " from " + message.guild.name + " for " + sickreason + "`");
			} catch (Ex) {
				return ReturnProcessing("error", "Forceban failed!", "`" + Ex.message + "`");
			};
		} else
			return ReturnProcessing("error", "Forceban failed!", "`Do you want the big hammer yourself? Like, what are you doing?!`");
	}
};