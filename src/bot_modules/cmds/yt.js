module.exports = {
	name: "yt",
	description: "Play songs from YouTube.",
	guildOnly: true,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["DEFAULT"],
	cooldown: 2,
	aliases: [],
	syntax: [" play", " stop", " skip"],
	execute: async(client, message, args) => {
		const ytdl = require('ytdl-core');

		if (!client.music) client.music = { };
		if (!client.music.yt) client.music.yt = { disconnectTime: 120000 };

		if (!client.music.yt.queue) client.music.yt.queue = new Map();

		const serverQueue = client.music.yt.queue.get(message.guild.id);

		if (args[0] == "play") {
			execute(message, serverQueue);
			return;
		} else if (args[0] == "skip") {
			skip(message, serverQueue);
			return;
		} else if (args[0] == "stop") {
			stop(message, serverQueue);
			return;
		} else {
			var syntaxinfo = "`PLACEHOLDER`";
			if (module.exports.syntax)
				syntaxinfo = "`" + module.exports.syntax.join("`, `") +  "`";
			message.channel.send({ embed: {
				title: client.config.system.emotes.error + " **Music from YouTube**",
				color: client.config.system.embedColors.red,
				description: "I have no idea what you are trying to do. I only understand:\n" + syntaxinfo,
				footer: { text: client.config.system.footerText }
			}});
		};

		// FUNCTIONS
		async function execute(message, serverQueue) {

			const voiceChannel = message.member.voice.channel;
			if (!voiceChannel)
				return message.channel.send({ embed: {
					title: client.config.system.emotes.error + " **Music from YouTube**",
					color: client.config.system.embedColors.red,
					description: "You need to be in a Voice Channel for this to work!!",
					footer: { text: client.config.system.footerText }
				}});

			const permissions = voiceChannel.permissionsFor(message.client.user);
			if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
				return message.channel.send({ embed: {
					title: client.config.system.emotes.error + " **Music from YouTube**",
					color: client.config.system.embedColors.red,
					description: "I do not have the permissions in order to play music.\nI need both `CONNECT` and `SPEAK`.",
					footer: { text: client.config.system.footerText }
				}});
			};

			if (!args[1]) {
				return message.channel.send({ embed: {
					title: client.config.system.emotes.warning + " **Music from YouTube**",
					color: client.config.system.embedColors.yellow,
					description: "In order to play a song from YouTube, you may want to add a URL after the command~...",
					footer: { text: client.config.system.footerText }
				}});
			};

			const songInfo = await ytdl.getInfo(args[1]);

			const song = {
				title: songInfo.videoDetails.title,
				url: songInfo.videoDetails.video_url
			};

			if (!serverQueue) {
				const queueContruct = {
					textChannel: message.channel,
					voiceChannel: voiceChannel,
					connection: null,
					songs: [],
					volume: 5,
					playing: true
				};

				client.music.yt.queue.set(message.guild.id, queueContruct);

				queueContruct.songs.push(song);

				try {
					var connection = await voiceChannel.join();
					queueContruct.connection = connection;
					play(message.guild, queueContruct.songs[0]);
				} catch (err) {
					console.log(err);
					client.music.yt.queue.delete(message.guild.id);
					return message.channel.send({ embed: { 
						title: client.config.system.emotes.success + " **Music from YouTube - Added to Queue!**",
						color: client.config.system.embedColors.lime,
						description: `**${song.title}** failed to be added!`,
						fields: [
							{ name: "Whoops!", value: "A problem just occurred, and here's what we know:\n\n```" + err.stack + "```\nIt has been reported to CONSOLE." }
						],
						footer: { text: client.config.system.footerText }
					}});
				};
			} else {
				serverQueue.songs.push(song);
				return message.channel.send({ embed: { 
					title: client.config.system.emotes.success + " **Music from YouTube - Added to Queue!**",
					color: client.config.system.embedColors.lime,
					description: `**${song.title}** has been added to queue successfully!`,
					footer: { text: client.config.system.footerText }
				}});
			};
		};

		function skip(message, serverQueue) {
			if (!message.member.voice.channel)
				return message.channel.send({ embed: {
					title: client.config.system.emotes.error + " **Music from YouTube**",
					color: client.config.system.embedColors.red,
					description: "You need to be in a Voice Channel for this to work!!",
					footer: { text: client.config.system.footerText }
				}});

			if (!serverQueue)
				return message.channel.send({ embed: {
					title: client.config.system.emotes.error + " **Music from YouTube**",
					color: client.config.system.embedColors.red,
					description: "There are no songs to skip.",
					footer: { text: client.config.system.footerText }
				}});
			serverQueue.connection.dispatcher.end();
		};

		function stop(message, serverQueue) {
			if (!message.member.voice.channel)
				return message.channel.send({ embed: {
					title: client.config.system.emotes.error + " **Music from YouTube**",
					color: client.config.system.embedColors.red,
					description: "You need to be in a Voice Channel for this to work!!",
					footer: { text: client.config.system.footerText }
				}});
			serverQueue.songs = [];
			serverQueue.connection.dispatcher.end();
		};

		function play(guild, song) {
			var serverQueue = client.music.yt.queue.get(guild.id);
			if (!song) {
				setTimeout(function() {
					if (serverQueue && serverQueue.voiceChannel && !serverQueue.playing) {
						serverQueue.voiceChannel.leave();
						serverQueue.textChannel.send({ embed: { 
							title: client.config.system.emotes.information + " **Music from YouTube**",
							color: client.config.system.embedColors.blue,
							description: `The queue is now empty! You can add some more at anytime!`,
							footer: { text: client.config.system.footerText }
						}});
					};
				}, client.music.yt.disconnectTime);
				client.music.yt.queue.delete(guild.id);
				return serverQueue.textChannel.send({ embed: { 
					title: client.config.system.emotes.information + " **Music from YouTube**",
					color: client.config.system.embedColors.blue,
					description: `The queue is now empty! You can add some more at anytime!`,
					footer: { text: client.config.system.footerText }
				}});
			}

			const dispatcher = serverQueue.connection.play(ytdl(song.url)).on("finish", () => {
				serverQueue.songs.shift();
				play(guild, serverQueue.songs[0]);
			}).on("error", error => console.error(error));
			dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
			serverQueue.textChannel.send({ embed: { 
				title: client.config.system.emotes.success + " **Music from YouTube - Now Playing**",
				color: client.config.system.embedColors.lime,
				description: `Now playing: **${song.title}**`,
				footer: { text: client.config.system.footerText }
			}});
		};
	}
};