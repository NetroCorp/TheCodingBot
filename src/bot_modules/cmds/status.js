module.exports = {
	name: "status",
	description: "Check the status of Discord.",
	guildOnly: false,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["DEFAULT"],
	cooldown: 2,
	aliases: [],
	syntax: [],
	execute: async(client, message, args) => {

		var apiping = Math.round(client.ws.ping);
		message.channel.send({ embed: {
			title: client.config.system.emotes.d_wait + " **Status Report**",
			color: client.config.system.embedColors.blue,
			fields: [
				{ name: "Discord API Ping", value: `**${apiping}ms**` },
				{ name: "Status Report!", value: "Waiting for result, please wait..." },
				{ name: "There maybe problems...", value: `If you continue to see this message without any edits, something's done goofed.` }
			],
			footer: { text: client.config.system.footerText }
		}}).then(msg => {

			const getJSON = require('get-json');

			getjsonat = "https://srhpyqt94yxb.statuspage.io/api/v2/incidents/unresolved.json";

			if (args[0] == "-Test") {
				getjsonat = "http://172.74.124.246/downloads/Discord-Status-TEST-UNRESOLVED.json";
			};

			function returnToUser(embedStuff) {
				return msg.edit(embedStuff);
			};

			async function getMaintenances() {
				var result = null;
				var url = "https://srhpyqt94yxb.statuspage.io/api/v2/scheduled-maintenances/upcoming.json"; // "http://172.74.124.246/downloads/Discord-Status-TEST-MAINTENANCES.json"
				await getJSON(url, function(error, response) {
					if (error) {
						log("X", "SYS", "Error while getting maintenance infomartion from Discord.");
						console.error(error);
						result = null;
					} else {
						var data = response.scheduled_maintenances;
						if (data[0] != undefined || data[0] != null) {
							affected = [];
							if (data[0].incident_updates[0].affected_components == "null" ||
							 data[0].incident_updates[0].affected_components == "undefined" ||
							 !data[0].incident_updates[0].affected_components) {
								affected.push("none");
							} else {
								for (var c in data[0].incident_updates[0].affected_components) {
									affected.push(data[0].incident_updates[0].affected_components[c].name);
								};
							};
							var embed = { embed: {
								title: client.config.system.emotes.warning + " **Upcoming Maintenance!**",
								color: client.config.system.embedColors.yellow,
								description: data[0].incident_updates[0].body,
								fields: [
									{ "name": "Incident Impacts", "value": affected.join(", "), inline: true },
									{ "name": "Scheduled From", "value": new Date(data[0].scheduled_for).toString() },
									{ "name": "Scheduled To", "value": new Date(data[0].scheduled_until).toString() },
								],
								footer: { text: client.config.system.footerText }
							}};
							result = embed;
						};
					};
				});
				return result;
			};


			getJSON(getjsonat, async function(error, response){
				if (error) {
					log("X", "SYS", "Error while getting unresolved infomartion from Discord.");
					console.error(error);
					return returnToUser({ embed: {
						title: client.config.system.emotes.error + " **Discord Status Error**",
						color: client.config.system.embedColors.red,
						description: "Could not load Status Information.\nReport to **TheCodingGuy#6697**.",
						footer: { text: client.config.system.footerText }
					}});
				}

				if (response.incidents[0] == undefined || response.incidents[0] == null) {
					var maintenances = await getMaintenances();
					returnToUser({ embed: {
						title: client.config.system.emotes.success + " **Discord Status**",
						color: client.config.system.embedColors.lime,
						description: "**Looks like there's no problems at Discord.**",
						fields: [
							{ "name": "Status", "value": "All Systems Operational.", inline: true },
							{ "name": "API Ping", "value": Math.round(client.ws.ping) + "ms.", inline: true }
						],
						footer: { text: client.config.system.footerText }
					}});
					if (maintenances != null) return message.channel.send(maintenances);
					else return;
				} else {


					var embedcolor = client.config.system.embedColors.blue;
					var DEDLastUpdateStuff = "Oops! You shouldn't see this... :'(";
					var lastupdatetitle = DEDLastUpdateStuff, lastupdatemsg = DEDLastUpdateStuff, lastupdatetime = DEDLastUpdateStuff, impactType = DEDLastUpdateStuff;
					var affected = [];

					function getIncidentData(i) {
						lastupdatetitle = response.incidents[0].incident_updates[i].status;
						lastupdatemsg = response.incidents[0].incident_updates[i].body;
						lastupdatetime = Date.parse(response.incidents[0].incident_updates[i].updated_at);

						lastupdatetime = new Date(lastupdatetime).toString();

						affected = [];
						if (response.incidents[0].incident_updates[i].affected_components == "null" ||
						 response.incidents[0].incident_updates[i].affected_components == "undefined" ||
						 !response.incidents[0].incident_updates[i].affected_components) {
							affected.push("none");
						} else {
							for (var c in response.incidents[0].incident_updates[i].affected_components) {
								affected.push(response.incidents[0].incident_updates[i].affected_components[c].name + " (" + response.incidents[0].incident_updates[i].affected_components[c].new_status.replace("_", " ") + ")");
							};
						};
						impactType = response.incidents[0].impact;
					};

					getIncidentData(0); // Tell the code we want the Incident Data for the latest (for the time being)


					if (impactType == "critical") embedcolor = client.config.system.embedColors.red;
					else if (impactType == "major") embedcolor = client.config.system.embedColors.orange;
					else if (impactType == "minor") embedcolor = client.config.system.embedColors.yellow;

					var extraFTText = "";
					if (args[0] == "-Test") {
						extraFTText = "/!\\ WARNING /!\\\n!! THIS IS ONLY A TEST - THE DATA IS NOT CURRENT !!\n";
					};

					if (args[0] == "-All" || args[1] == "-All") {
						let statpages = [];
						let currpage = 1;
						
						for (var i=0; i < response.incidents[0].incident_updates.length; i++) {
							getIncidentData(i); // Tell the code we want the Incident Data for position i
							var extraLUTxt = "Latest Update";

							
							if (i != 0) extraLUTxt = "Update #" + ((response.incidents[0].incident_updates.length - 1) - statpages.length);
							if ((i + 1) == response.incidents[0].incident_updates.length) extraLUTxt = "It begins...";

							statpages.push([
								{ "name": "Incident Impact Type", "value": impactType, inline: true },
								{ "name": "Incident Impacts", "value": affected.join(", "), inline: true },
								{ "name": extraLUTxt, "value": "**" + lastupdatetitle + "**\n" + lastupdatemsg },
								{ "name": "Last Update at", "value": lastupdatetime },
								{ "name": "API Ping", "value": Math.round(client.ws.ping) + "ms.", inline: true }
							]);
						};

						if (statpages.length != 1) msg.react("◀️").then(r=>{
							currpage = 1;
							updateMessage();

							msg.react("▶️");

							function updateMessage() {
								returnToUser({ embed: {
									author: { name: response.incidents[0].name, icon_url: "https://cdn.discordapp.com/emojis/" + client.config.system.emotes.warning.replace("a", "").split(":")[2].replace(/[<@!:>]/g, '') + ".png" },
									color: embedcolor,
									description: "**Looks Some or all Systems are non-Operational at Discord!**\n*Page **" + currpage + "** of **" + statpages.length + "**!*\nViewing history of all updates.",
									fields: statpages[currpage-1],
									footer: {text: extraFTText + client.config.system.footerText }
								}});
							};

							// Filter reactions
							//const filter = (reaction, user) => return ['◀️', '▶️'].includes(reaction.emoji.name) && user.id === message.author.id;
							const backwardsFilter = (reaction, user) => reaction.emoji.name === "◀️" && user.id === message.author.id;
							const forwardsFilter = (reaction, user) => reaction.emoji.name === "▶️" && user.id === message.author.id;


							const backwards = msg.createReactionCollector(backwardsFilter, { time: 60000 });
							const forwards = msg.createReactionCollector(forwardsFilter, { time: 60000 });

							backwards.on('collect', r => {
								if (currpage === 1) return;
								else currpage--;

								setTimeout(updateMessage, 500);
							});

							forwards.on('collect', r => {
								if (currpage === statpages.length) return;
								else currpage++;

								setTimeout(updateMessage, 500);
							});

							backwards.on('end', collected => {
								r.fetchUsers().then(function (reactionUsers) {
									// Filter the user with the name 'TheCodingBot' (this bot) from the list of users
									var me = reactionUsers.filter(function (_) { return _.username === 'TheCodingBot'; })[0];
									reaction.remove(me);
								});
							});

							forwards.on('end', collected => {
								r.fetchUsers().then(function (reactionUsers) {
									// Filter the user with the name 'TheCodingBot' (this bot) from the list of users
									var me = reactionUsers.filter(function (_) { return _.username === 'TheCodingBot'; })[0];
									reaction.remove(me);
								});
							});
						});
					} else {

						returnToUser({ embed: {
							author: { name: response.incidents[0].name, icon_url: "https://cdn.discordapp.com/emojis/" + client.config.system.emotes.warning.replace("a", "").split(":")[2].replace(/[<@!:>]/g, '') + ".png" },
							color: embedcolor,
							description: "**Looks Some or all Systems are non-Operational at Discord!**",
							fields: [
								{ "name": "Incident Impact Type", "value": impactType, inline: true },
								{ "name": "Incident Impacts", "value": affected.join(", "), inline: true },
								{ "name": "Latest Update", "value": "**" + lastupdatetitle + "**\n" + lastupdatemsg },
								{ "name": "Last Update at", "value": lastupdatetime },
								{ "name": "API Ping", "value": Math.round(client.ws.ping) + "ms.", inline: true }
							],
							footer: {text: extraFTText + client.config.system.footerText }
						}});
					};
				};
			});
		});
	},
};