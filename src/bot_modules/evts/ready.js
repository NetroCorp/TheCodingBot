module.exports = (client) => {
	client.config.tokendata = undefined;

	client.connections.success = true;
	clearInterval(client.connections.updateTime);

	client.config.system.footerText = client.config.system.footerText.replace("currYear", new Date().getFullYear()); // Update year

	log("S", "DISCORD", `Discord Authenication success! (${client.user.tag} | ${client.user.id})`);
	log("S", "DISCORD", `It took ${client.connections.startupTime}ms (${(client.connections.startupTime / 1000)} seconds)!`);


 	// Finish up anything else

	RPSUpdate(client, "init"); // Init RPSUpdater

	// Init inviteData
	const Sequelize = require("sequelize");
	const invites = client.sequelize.define('invite', {
		discordUser: Sequelize.STRING,
		inviter: Sequelize.STRING,
		invites: Sequelize.NUMBER,
		guildID: Sequelize.STRING
	});
	invites.sync();
	client.invites = invites;
	client.guildInvites = new Map();


	client.bypassEnabled = false; // Disable bypass

	setTimeout(function() {
		RPSUpdate(client, "start"); // Start RPSUpdater

		setTimeout(async function() {

			log("i", "DISCORD", `Caching all invites of ${client.guilds.cache.size} servers...`);

			var Discord = require("discord.js");
			// Cache invites
			await client.guilds.cache.forEach(async guild => {
				let invites = await guild.fetchInvites().catch(err =>{
					if (err.code !== Discord.Constants.APIErrors.MISSING_PERMISSIONS) {
						log("X", "DISCORD", `Failed to cache invites for ${g.name} (${g.id}).`);
					};
				});
				if(guild.vanityURLCode) invites.set(guild.vanityURLCode, await guild.fetchVanityData());
				client.guildInvites.set(guild.id, invites);
		        });

			log("S", "DISCORD", `Cache invite function completed.`);

		}, 3500); // Wait an addition 3.5 seconds
	}, 2000);
};
