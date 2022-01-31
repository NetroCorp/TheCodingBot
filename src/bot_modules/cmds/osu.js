module.exports = {
	name: "osu",
	description: "welcome to osu! -- wait, I mean, checks information on beatmaps, users, and more!",
	guildOnly: false,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["DEFAULT"],
	cooldown: 5,
	aliases: [],
	syntax: [
		"<user/u> <username/id> [ctb/taiko/standard/mania]",
		"<beatmapset/bs> <beatmapsetid>",
		"<beatmap> <beatmapid>"
	],
	execute: async(client, message, args) => {

		//if (!args || args[0] == null || args[0] == undefined) { throw new Error("Missing argument (type [beatmapset, beatmap or user])."); }
		//else if (args[0] != "beatmap" && args[0] != "b" && args[0] != "beatmapset" && args[0] != "beatmapsets" && args[0] != "bs" && args[0] != "user" && args[0] != "u") { throw new Error("Missing argument (type [beatmapset, beatmap or user])."); }
		//else if (!args || args[1] == null || args[1] == undefined) { throw new Error("Missing argument (type [beatmapset id, beatmap id or user id])."); };
		message.channel.send({ embed: {
			title: client.config.system.emotes.osu.osuLogo + " **osu!Checker** *(BETA)*",
			color: client.config.system.embedColors.blue,
			description: "Please wait, fetching data...",
			footer: { text: client.config.system.footerText }
		}}).then(msg => {
			try {
				const osu = require('nodesu');
		
				var tokendatafile = "../config/tokendata.json";
				delete require.cache[require.resolve(tokendatafile)];
				var otoken = require(tokendatafile).tokendata.osu;

				const osuApi = new osu.Client(otoken);
		
				otoken = null;
				delete require.cache[require.resolve(tokendatafile)];


				function getBSData(beatmap) {
					var total_length_rounded = (Math.round((beatmap.total_length / 60)) == (beatmap.total_length / 60)) ? "exactly " + Math.round((beatmap.total_length / 60)) : "about " + Math.round((beatmap.total_length / 60));
					total_length_rounded = beatmap.total_length + "s (" + total_length_rounded + "m)";
					var friendlyplayingmode = (beatmap.mode == 0) ? "osu!" : (beatmap.mode == 1) ? "osu!taiko" : (beatmap.mode == 2) ? "Catch the Beat (osu!ctb)" : (beatmap.mode == 3) ? "osu!mania" : "unknown";
					var playingmode = (beatmap.mode == 0) ? "osu" : (beatmap.mode == 1) ? "taiko" : (beatmap.mode == 2) ? "fruits" : (beatmap.mode == 3) ? "mania" : "unknown";

					return [
						{ "name": "Beatmap Title", "value": beatmap.title, inline: true },
						{ "name": "Song Artist", "value": beatmap.artist, inline: true },
						{ "name": "Beatmapper", "value": beatmap.creator + " (" + beatmap.creator_id + ")" },
						// { "name": "Genre", "value": "" + beatmap.genre },
						{ "name": "Mode & (Version)", "value": friendlyplayingmode + " (" + beatmap.version + ")" },
						{ "name": "Beats Per Minute (BPM)", "value": "" + beatmap.bpm, inline: true },
						{ "name": "Beatmap Length", "value": "" + total_length_rounded, inline: true },
						{ "name": "Star Rating (*)", "value": "" + beatmap.difficultyrating + "*", inline: true },
						{ "name": "Play Count", "value": "" + beatmap.playcount, inline: true },
						{ "name": "Beatmap Information", "value": "**Difficulty Overall (OD)**: " + beatmap.diff_overall +
							"\n" + "**Max Combo**: " + beatmap.max_combo +
							"\n" + "**Circle Size**: " + beatmap.diff_size +
							"\n" + "**Circle Approach**: " + beatmap.diff_approach +
							"\n" + "**Drain (HP)**: " + beatmap.diff_drain +
							"\n" + "**Difficutly Aim**: " + beatmap.diff_aim +
							"\n" + "**Difficulty Speed**: " + beatmap.diff_speed
						},
						{ "name": "Download Page (Login required to download)", "value": "" + "[Visit official osu! page](https://osu.ppy.sh/beatmapsets/" + beatmap.beatmapset_id + "#" + playingmode + "/" + beatmap.beatmap_id + "?ref=tcbosudiscord)" },
						{ "name": "Submitted to osu!", "value": "" + beatmap.submit_date, inline: true },
						{ "name": "Last update", "value": "" + beatmap.last_update, inline: true }
					];
				};

				var beatmapsetsyntax = [ "beatmapset", "beatmapsets", "bs" ];
				var beatmapsyntax = [ "beatmap", "b" ];

				if (beatmapsetsyntax.includes(args[0]) || beatmapsyntax.includes(args[0])) {

					msg.edit({ embed: {
						title: client.config.system.emotes.osu.osuLogo + " **osu!Checker** *(BETA)*",
						color: client.config.system.embedColors.blue,
						fields: [ { "name": "Requesting content", "value": client.config.system.emotes.wait + " **Please wait...**" } ],
						footer: { text: client.config.system.footerText }
					}});
					if (beatmapsetsyntax.includes(args[0])) {
						osuApi.beatmaps.getBySetId(args[1]).then(response => {
							if (!response || response == null || response == undefined || !response[0] || response[0] == null || response[0] == undefined) {
								// throw new Error("APIError: Empty response.");
								msg.edit({ embed: {
									title: client.config.system.emotes.osu.osuLogo + " **osu!Checker** *(BETA)*",
									color: client.config.system.embedColors.red,
									description: "**That's an error!**\nNo beatmapset exists for that ID.",
									footer: { text: client.config.system.footerText }
								}});
							} else {

								let bmppages = [], currpage = 1;
				
								for (var i=0; i < response.length; i++) { bmppages.push(getBSData(response[i])); };

								msg.edit({ embed: {
									thumbnail: { url: "https://b.ppy.sh/thumb/" + response[currpage-1].beatmapset_id + "l.jpg" },
									title: client.config.system.emotes.osu.osuLogo + " **osu!Checker** *(BETA)*",
									color: client.config.system.embedColors.lime,
									description: "*Page **" + currpage + "** of **" + bmppages.length + "**!*\nBeatmap information for " + response[currpage-1].title,
									fields: [ { "name": "Requesting content", "value": client.config.system.emotes.wait + " **Please wait...**" } ],
									footer: { text: client.config.system.footerText }
								}});

								setTimeout(function() {
									msg.edit({ embed: {
										thumbnail: { url: "https://b.ppy.sh/thumb/" + response[currpage-1].beatmapset_id + "l.jpg" },
										title: client.config.system.emotes.osu.osuLogo + " **osu!Checker** *(BETA)*",
										color: client.config.system.embedColors.lime,
										description: "*Page **" + currpage + "** of **" + bmppages.length + "**!*\nBeatmapset information for " + response[currpage-1].title,
										fields: bmppages[currpage-1],
										footer: { text: client.config.system.footerText }
									}}).then(m => {
										if (bmppages.length != 1) m.react("◀️").then(r=>{
											function updateMessage(fromCollect = false) {
												if (fromCollect) {
													m.edit({ embed: {
														thumbnail: { url: "https://b.ppy.sh/thumb/" + response[currpage-1].beatmapset_id + "l.jpg" },
														title: client.config.system.emotes.osu.osuLogo + " **osu!Checker** *(BETA)*",
														color: client.config.system.embedColors.lime,
														description: "*Page **" + currpage + "** of **" + bmppages.length + "**!*\nBeatmap information for " + response[currpage-1].title,
														fields: [ { "name": "Requesting content", "value": client.config.system.emotes.wait + " **Please wait...**" } ],
														footer: { text: client.config.system.footerText }
													}});
													setTimeout(updateMessage, 500);
												} else {
													m.edit({ embed: {
														thumbnail: { url: "https://b.ppy.sh/thumb/" + response[currpage-1].beatmapset_id + "l.jpg" },
														title: client.config.system.emotes.osu.osuLogo + " **osu!Checker** *(BETA)*",
														color: client.config.system.embedColors.lime,
														description: "*Page **" + currpage + "** of **" + bmppages.length + "**!*\nBeatmap information for " + response[currpage-1].title,
														fields: bmppages[currpage-1],
														footer: { text: client.config.system.footerText }
													}});
												};
											};

											m.react("▶️");

											// Filter reactions
											//const filter = (reaction, user) => return ['◀️', '▶️'].includes(reaction.emoji.name) && user.id === message.author.id;
											const backwardsFilter = (reaction, user) => reaction.emoji.name === "◀️" && user.id === message.author.id;
											const forwardsFilter = (reaction, user) => reaction.emoji.name === "▶️" && user.id === message.author.id;

											const backwards = m.createReactionCollector(backwardsFilter, { time: 60000 });
											const forwards = m.createReactionCollector(forwardsFilter, { time: 60000 });
								
											backwards.on('collect', r => {
												if (currpage === 1) return;
												else currpage--;

												setTimeout(updateMessage(true), 300);
											});

											forwards.on('collect', r => {
												if (currpage === bmppages.length) return;
												else currpage++;

												setTimeout(updateMessage(true), 300);
											});

											function removeMyReactions(collected, collectedType) {
												const reaction = collected.first();

												reaction.fetchUsers().then(function (reactionUsers) {
													// Filter the user with the name 'TheCodingBot' (this bot) from the list of users
													var me = reactionUsers.filter(function (_) { return _.username === 'TheCodingBot'; })[0];
													reaction.remove(me);
												});
											};

											backwards.on('end', collected => {
												removeMyReactions(collected, "backwards");
											});

											forwards.on('end', collected => {
												removeMyReactions(collected, "forwards");
											});
										});
									});
								}, 1000);
							};
						}).catch(function(err) { throw err; });
					} else if (beatmapset.includes(args[0])) {
						osuApi.beatmaps.getByBeatmapId(args[1]).then(response => {
							if (!response || response == null || response == undefined || !response[0] || response[0] == null || response[0] == undefined) {
								// throw new Error("APIError: Empty response.");
								msg.edit({ embed: {
									title: client.config.system.emotes.osu.osuLogo + " **osu!Checker** *(BETA)*",
									color: client.config.system.embedColors.red,
									description: "**That's an error!**\nNo beatmap exists for that ID.",
									footer: { text: client.config.system.footerText }
								}});
							} else {

								msg.edit({ embed: {
									thumbnail: { url: "https://b.ppy.sh/thumb/" + response[0].beatmapset_id + "l.jpg" },
									title: client.config.system.emotes.osu.osuLogo + " **osu!Checker** *(BETA)*",
									color: client.config.system.embedColors.lime,
									description: "Beatmap information for " + response[0].title,
									fields: getBSData(response[0]),
									footer: { text: client.config.system.footerText }
								}});
							};
						}).catch(function(err) { throw err; });
					};
				} else if (args[0] == "user" || args[0] == "u") {
					osuApi.user.get(args[1]).then(response => {
						console.log(response);
						if (!response || response == null || response == undefined) {
							// throw new Error("APIError: Empty response.");
							msg.edit({ embed: {
								title: client.config.system.emotes.osu.osuLogo + " **osu!Checker** *(BETA)*",
								color: client.config.system.embedColors.red,
								description: "**That's an error!**\nNo user exists for that ID.",
								footer: { text: client.config.system.footerText }
							}});
						} else {

							function getPlaytime(time) {
								let totalSeconds = (time);
								let days = parseInt(Math.floor(totalSeconds / 86400)) + " day";
								let hours = Math.floor(parseInt(Math.floor(totalSeconds / 3600)) % 24) + " hour";
								totalSeconds %= 3600;
								let minutes = parseInt(Math.floor(totalSeconds / 60)) + " minute";
								let seconds = parseInt(totalSeconds % 60) + " second";

								if (parseInt(days.substring(0,2)) != 1) days += "s";
								if (parseInt(hours.substring(0,3)) != 1) hours += "s";
								if (parseInt(minutes.substring(0,3)) != 1) minutes += "s";
								if (parseInt(seconds.substring(0,3)) != 1) seconds += "s";

								let totalplay = `**${days}**, **${hours}**, **${minutes}**, **${seconds}**`;
								return totalplay;
							};

							var osuuserfields = null;

							var joinedosutime = getDateDiff(response.join_date);
							var joinedosutimearr = [ joinedosutime.split(":")[1].split(" ")[0], joinedosutime.split(":")[2].split(" ")[0], joinedosutime.split(":")[3].split(" ")[0] ]
							if (joinedosutimearr[0] > "0") joinedosutime = `${joinedosutimearr[0]}y`; else joinedosutime = "";
							if (joinedosutimearr[1] > "0") { if(joinedosutime != "") joinedosutime += `, ${joinedosutimearr[1]}mo`;  else joinedosutime = `${joinedosutimearr[1]}mo` };
							if (joinedosutimearr[2] > "0") { if(joinedosutime != "") joinedosutime += `, ${joinedosutimearr[2]}d`; else joinedosutime = `${joinedosutimearr[2]}d` };
							if (joinedosutime == "") joinedosutime = "Unknown Error.";
							else joinedosutime += " ago";

							osuuserfields = [
								{ "name": "User", "value": `${response.username} (${response.user_id})`, inline: true },
								{ "name": "Level", "value": "Never played", inline: true },
								{ "name": "Play count", "value": `0 times [Never Played]`, inline: true },
								{ "name": "Joined osu!", "value": `${joinedosutime} (${new Date(response.join_date)}` }
							];

							if (response.level != null) {
								for (var i = 0; i < osuuserfields.length; i++) {
									if (osuuserfields[i].name === "Play count") { osuuserfields[i].value = `${response.playcount} times`; }
									if (osuuserfields[i].name === "Level") { osuuserfields[i].value = `Lvl. ${response.level}` }
								};
								osuuserfields.push(
									{ "name": "Accuracy", "value": response.accuracy + "%", inline: true },
									{ "name": "Performance Points (pp)", "value": response.pp_raw + "pp", inline: true },
									{ "name": "Total Playtime", "value": getPlaytime(response.total_seconds_played), inline: false },
									{ "name": "Rank", "value": `#${response.pp_rank}`, inline: true },
									{ "name": "Country", "value": ":flag_" + response.country.toLowerCase() + ": " + response.country, inline: true },
									{ "name": "Country Rank", "value": `#${response.pp_country_rank}`, inline: true },
									{ "name": "Circle Points Hit", "value": `${client.config.system.emotes.osu.hit300}: ${response.count300}\n${client.config.system.emotes.osu.hit100}: ${response.count100}\n${client.config.system.emotes.osu.hit50}: ${response.count50}`, inline: true },
									{ "name": "Best Performances", "value": `${client.config.system.emotes.osu.rankSH}: ${response.count_rank_ss}\n${client.config.system.emotes.osu.rankS}: ${response.count_rank_s}\n${client.config.system.emotes.osu.rankA}: ${response.count_rank_a}`, inline: true }
								);
							};

							msg.edit({ embed: {
								thumbnail: { url: `https://a.ppy.sh/${response.user_id}?1.jpeg` },
								title: client.config.system.emotes.osu.osuLogo + " **osu!Checker** *(BETA)*",
								color: client.config.system.embedColors.lime,
								description: "User information for " + response.username,
								fields: osuuserfields,
								footer: { text: client.config.system.footerText }
							}});
						};
					}).catch(function(err) { throw err; });
				} else {
					throw new Error("unknown error");
				};
			} catch (Ex) {
				msg.edit({ embed: {
					title: client.config.system.emotes.osu.osuLogo + " **osu!Checker** *(BETA)*",
					color: client.config.system.embedColors.red,
					description: "Fetching data failed: " + Ex.message + ".",
					footer: { text: client.config.system.footerText }
				}});
				console.error(Ex);
			};
		});
	}
};