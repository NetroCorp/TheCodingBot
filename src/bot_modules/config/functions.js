const fs = require("fs");
const loggingcolors = { 
	"Reset": "\x1b[0m",

	"FgBlack": "\x1b[30m",
	"FgRed": "\x1b[31m",
	"FgGreen": "\x1b[32m",
	"FgYellow": "\x1b[33m",
	"FgBlue": "\x1b[34m",
	"FgMagenta": "\x1b[35m",
	"FgCyan": "\x1b[36m",
	"FgWhite": "\x1b[37m",

	"BgBlack": "\x1b[40m",
	"BgRed": "\x1b[41m",
	"BgGreen": "\x1b[42m",
	"BgYellow": "\x1b[43m",
	"BgBlue": "\x1b[44m",
	"BgMagenta": "\x1b[45m",
	"BgCyan": "\x1b[46m",
	"BgWhite": "\x1b[47m"
};

module.exports = function() {
	sleep = function(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	};

	log = function(type, location, message) {
		var typecolor = loggingcolors.FgWhite;

		if (type == "X") typecolor = loggingcolors.FgRed;
		else if (type == "i") typecolor = loggingcolors.FgBlue;
		else if (type == "!") typecolor = loggingcolors.FgYellow;
		else if (type == "S") typecolor = loggingcolors.FgGreen;

		var locationcolor = loggingcolors.FgWhite;

		if (location == "SYS") locationcolor = loggingcolors.FgGreen;
		else if (location == "DISCORD") locationcolor = loggingcolors.FgMagenta;

		console.log(`[${typecolor}${type}${loggingcolors.Reset}] [${locationcolor}${location}${loggingcolors.Reset}] ${message}`);

	};

	ErrorHandler = function(client, message, commandName, errorInfo, errorType = "error") {
		var command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) command = null;

		var embedColorToUse = client.config.system.embedColors.red, emoteToUse = client.config.system.emotes.error;
		if (errorType == "warning") {
			embedColorToUse = client.config.system.embedColors.orange;
			emoteToUse = client.config.system.emotes.warning;
		};
		var msgToSendBackToUser = null;
		
		if (errorInfo.message.startsWith("Command not found")) {
			var desc = "You just entered the prefix!!";

			if (command == null && commandName != null && commandName != "")
				desc = "`" + commandName + "` not found!";

			msgToSendBackToUser = {
				embed: {
					title: emoteToUse + " **Uh-Oh!**",
					color: embedColorToUse,
					description: desc,
					fields: [
						{ name: "Looking for help?", value: "Maybe you should try `" + client.currentServer.prefix + "help`" },
						{ name: "...or are you looking for bot support?", value: "Join the Development Support Server via [Discord](https://discord.gg/HdKeWtV)" }
					],
					footer: { text: client.config.system.footerText }
				}
			}
		} else {
			var fieldsToUse = [];
			if (!errorInfo || errorInfo.message == null)
				fieldsToUse.push({ name: "Error Message", value: "No error reported. Um is this normal?" });
			else
				fieldsToUse.push({ name: "Error Message", value: errorInfo.message });

			if (errorInfo && errorInfo.stack != null)
				if (errorInfo.stack.length > 1024)
					fieldsToUse.push({ name: "StackTrace", value: "```js\n" + errorInfo.stack.split("\n")[0] + "\n" + errorInfo.stack.split("\n")[1] + "...```" })
				else
					fieldsToUse.push({ name: "StackTrace", value: "```js\n" + errorInfo.stack + "```" });

			fieldsToUse.push({ name: "You may want to report this.", value: "Join the Development Support Server via [Discord](https://discord.gg/HdKeWtV) or Direct Message <@222073294419918848>." });
			msgToSendBackToUser = {
				embed: {
					title: emoteToUse + " **Uh-Oh!**",
					color: embedColorToUse,
					description: "Something went wrong with the command " + commandName + "!",
					fields: fieldsToUse,
					footer: { text: client.config.system.footerText }
				}
			};
		};
		message.channel.send(msgToSendBackToUser);
		log("S", "SYS", "[COMMAND ERROR HANDLER] Notified user of error!");

	};

	load = function(client, loadin) {
		if (loadin == "commands") {
			var result = JSON.parse('{ "error": "none" }');
			var cmdLoader = {
				success: [],
				fail: []
			};
			
			log("i", "SYS", "Loading in commands, hang tight...");

			var Discord = require("discord.js");

			client.commands = new Discord.Collection();

			const commandFiles = fs.readdirSync('./bot_modules/cmds').filter(file => file.endsWith('.js'));
			if (commandFiles.length == 0) {
				log("!", "SYS", "No commands detected!");
				result = JSON.parse('{ "error": "No Commands Found to Load!" }');
			} else {
				log("i", "SYS", `Detected ${commandFiles.length} command(s)!`);

				for (const file of commandFiles) {
					var cmdName = file.split(".js")[0];
					log("i", "SYS", `Load: ${cmdName} ...`);

					var REcmdLoader = cmdReloader(client, cmdName);
					for (var sItem of REcmdLoader.success)
						cmdLoader.success.push(sItem);
					for (var fItem of REcmdLoader.fail)
						cmdLoader.fail.push(fItem);
					
					if (REcmdLoader.success == 1)
						client.commands.set(command.name, command);
				};
				if (cmdLoader.success.length == 0) {
					log("X", "SYS", `Failed to load any of the ${commandFiles.length} commands we found.`);
					result = JSON.parse('{ "error": "No Commands Successfully Loaded!" }');
				} else {
					log("S", "SYS", `Loaded ${cmdLoader.success.length}/${commandFiles.length} commands! (${cmdLoader.fail.length} failed!)`);
				};

			};

			return result;
		} else if (loadin == "events") {
			var result = JSON.parse('{ "error": "none" }');
			var evtLoader = {
				success: [],
				fail: []
			};
			
			log("i", "SYS", "Loading in events, hang tight...");

			const eventFiles = fs.readdirSync('./bot_modules/evts').filter(file => file.endsWith('.js'));
			if (eventFiles.length == 0) {
				log("!", "SYS", "No events detected!");
				result = JSON.parse('{ "error": "No Events Found to Load!" }');
			} else {
				log("i", "SYS", `Detected ${eventFiles.length} events(s)!`);

				for (const file of eventFiles) {
					var evtName = file.split(".js")[0];
					log("i", "SYS", `Load: ${evtName} ...`);

					var REevtLoader = evtReloader(client, evtName);
					for (var sItem of REevtLoader.success)
						evtLoader.success.push(sItem);
					for (var fItem of REevtLoader.fail)
						evtLoader.fail.push(fItem);
				};
				if (evtLoader.success.length == 0) {
					log("X", "SYS", `Failed to load any of the ${eventFiles.length} events we found.`);
					result = JSON.parse('{ "error": "No Events Successfully Loaded!" }');
				} else {
					log("S", "SYS", `Loaded ${evtLoader.success.length}/${eventFiles.length} events! (${evtLoader.fail.length} failed!)`);
				};

			};

			return result;
		} else if (loadin == "config") {
			var result = JSON.parse('{ "error": "none" }');
			var configLoader = {
				success: [],
				fail: []
			};

			client.config = {};

			log("i", "SYS", "Loading in configuration, hang tight...");
			const configFiles = fs.readdirSync('./bot_modules/config').filter(file => file.endsWith('.json'));
			if (configFiles.length == 0) {
				log("!", "SYS", "No configuration detected!");
				result = JSON.parse('{ "error": "No Configuration Found to Load!" }');
			} else {
				log("i", "SYS", `Detected ${configFiles.length} config file(s)!`);

				for (const file of configFiles) {
					var configName = file.split(".json")[0];
					log("i", "SYS", `Load: ${configName} ...`);

					var REconfigLoader = configReloader(client, configName);
					for (var sItem of REconfigLoader.success)
						configLoader.success.push(sItem);
					for (var fItem of REconfigLoader.fail)
						configLoader.fail.push(fItem);

				};
				if (configLoader.success.length == 0) {
					log("X", "SYS", `Failed to load any of the ${configFiles.length} configs we found.`);
					result = JSON.parse('{ "error": "No Configuration Successfully Loaded!" }');
				} else {
					log("S", "SYS", `Loaded ${configLoader.success.length}/${configFiles.length} configs! (${configLoader.fail.length} failed!)`);
				};

			};

			return result;
		} else {
			return JSON.parse('{ "error": "load function could not determine what you wanted." }');
		}
	};

	cmdReloader = function(client, command, directory = "../cmds/", fromMessageEVT = false) {
		var cmdLoader = {
			success: [],
			fail: []
		};

		var cmdName = command;

		if (command.indexOf("js") == 1)
			cmdName = command.split(".js")[0];

		delete require.cache[require.resolve(`${directory}/${cmdName}.js`)];
		try {
			command = require(`${directory}/${command}`);
			delete require.cache[require.resolve(`${directory}/${cmdName}.js`)];

			client.commands.set(command.name, command);
			cmdLoader.success.push(cmdName);
		} catch (Ex) {
			if (fromMessageEVT)
				throw Ex; // throw it again so the message.js try-catch can get it!
			else {
				log("X", "SYS", `Failed to load ${cmdName}.\nERROR: ${Ex.message}\n${Ex.stack}`);
				cmdLoader.fail.push(cmdName);
			};
		};
		delete require.cache[require.resolve(`${directory}/${cmdName}.js`)];

		return cmdLoader;
	};

	evtReloader = function(client, event) {
		var evtLoader = {
			success: [],
			fail: []
		};
		var evtName = event.split(".js")[0];

		delete require.cache[require.resolve(`../evts/${evtName}.js`)];
		try {
			var event = require(`../evts/${evtName}.js`);
			client.on(evtName, event.bind(null, client));
			evtLoader.success.push(evtName);
		} catch (Ex) {
			log("X", "SYS", `Failed to load ${evtName}.\nERROR: ${Ex.message}\n${Ex.stack}`);
			evtLoader.fail.push(evtName);
		};
		delete require.cache[require.resolve(`../evts/${evtName}.js`)];

		return evtLoader;
	};

	configReloader = function(client, config) {
		var configLoader = {
			success: [],
			fail: []
		};
		var configName = config.split(".json")[0];

		delete require.cache[require.resolve(`../config/${configName}.json`)];
		try {
			//var config = require(`../config/${configName}.json`);
			// Load in the config, mk?
			var config = JSON.parse(fs.readFileSync(`./bot_modules/config/${configName}.json`, "utf8")); // Update profile data.
			client.config = Object.assign(client.config, config);
			configLoader.success.push(configName);
		} catch (Ex) {
			log("X", "SYS", `Failed to load ${configName}.\nERROR: ${Ex.message}\n${Ex.stack}`);
			configLoader.fail.push(configName);
		};
		delete require.cache[require.resolve(`../config/${configName}.json`)];

		return configLoader;
	};

	updateConfig = function(client, config, name) {
		var newJson = { [name]: config };

		fs.writeFile(`./bot_modules/config/${name}.json`, JSON.stringify(newJson, null, "\t"), (err) => { if (err) { console.error(err); throw err; } });
		setTimeout(function() {
			config = JSON.parse(fs.readFileSync(`./bot_modules/config/${name}.json`, "utf8")); // Update data.
		}, 50);
	};

	shutdownBot = function(client, message, restart = false, msg) {
		client.config.system.commandState = "Shutdown";
		if (restart)
			log("i", "DISCORD", message.author.tag + " is restarting me!");
		else
			log("i", "DISCORD", message.author.tag + " is shuttin' me down!");

		setTimeout(function() {
			log("i", "SYS", "Tell Discord we are disconnecting...");
			client.destroy();
			log("S", "SYS", "Waiting for process to exit...");
			if (msg && msg == "FROMNODEPROCESS")
				process.waitingForCleanup = false;
			else
				setTimeout(function() {
					if (restart)
						process.exit(-1);
					else
						process.exit(0);
				}, 1000);
		}, 3500);

	};


	RPSUpdate = function(client, action) {
		if (action == "start") {
			if (client.config.system.rotatingStatus.enabled) {
				if (client.RPS != undefined && client.RPS != null) {
					if (!client.RPS.running) {
						client.RPS.running = true;
						client.RPS.intervalSystem = setInterval(function() {
							RPSUpdate(client, "update");
						}, (client.config.system.rotatingStatus.timeInSec * 1000));
						client.user.setActivity("RPS: RPS v" + client.RPS.version + " for TheCodingBot, READY.");

						setTimeout(function() {
							client.user.setActivity("RPS: Loaded " + client.config.system.rotatingStatus.statuses.length + " statuses!");
							setTimeout(function() {
								RPSUpdate(client, "update");
							}, 2500);
						}, 2500);
					} else {
						return "RPS already started: call RPSUpdate(client, \"stop\")";
					};
				} else {
					return "RPS not ready: call RPSUpdate(client, \"init\")";
				};
			};
		} else if (action == "update") {
				if (client.RPS != undefined && client.RPS != null) {
					if (client.RPS.running && client.config.system.rotatingStatus.enabled) {
						var playingstatusarr = client.config.system.rotatingStatus.statuses;
						var playingstatus = playingstatusarr[Math.floor(Math.random() * playingstatusarr.length)];

						if (playingstatus.includes("svrcount")) playingstatus = "Playing on " + client.guilds.cache.size + " servers!";
						else if (playingstatus.includes("ver")) playingstatus = `Playing on ${client.config.system.version.build}${client.config.system.version.branchS} (v${client.config.system.version.build} ${client.config.system.version.branch}).`;

						var playingtype = playingstatus.split(" ")[0];
		
						if (playingstatus.startsWith("Listening to")) playingstatus = playingstatus.replace("Listening to ", "");
						else playingstatus = playingstatus.replace(playingtype + " ", "");

						client.user.setActivity(playingstatus, { type: playingtype.toUpperCase() });
						return playingtype + " - " + playingstatus;
					} else {
						return "RPS not started or disabled: call RPSUpdate(client, \"start\")";
					};
				} else {
					return "RPS not ready: call RPSUpdate(client, \"init\")";
				};
		} else if (action == "stop") {
			if (client.RPS != undefined && client.RPS != null) {
				if (client.RPS.running) {
					client.RPS.running = false;
					clearInterval(client.RPS.intervalSystem);
				} else {
					return "RPS not started: call RPSUpdate(client, \"start\")";
				};
			} else {
				return "RPS not ready: not even initialized!";
			};
		} else if (action == "init") {
			if (client.RPS == undefined || client.RPS == null) {
				if (client.config.system.rotatingStatus.enabled) {
					client.RPS = {
						"running": false,
						"lastUpdate": 0,
						"lastStatus": "",
						"intervalSystem": null,
						"version": "1.0.0"
					};
				} else {
					return "RPS fail to init: RPS has been disabled.";
				};
			} else {
				return "RPS already started: call RPSUpdate(client, \"destroy\")";
			};
		} else if (action == "destroy") {
			if (client.RPS != undefined && client.RPS != null) {
				if (client.RPS.running) {
					RPSUpdate(client, "stop");
				};

				client.RPS = null;
			} else {
				return "RPS not ready: not even initialized!";
			};
		} else {
			return "The RPS SYSTEM is confused on what you told it to do.";
		};
	};

	getDateDiff = function(startingDate, endingDate) {
		var startDate = new Date(new Date(startingDate).toISOString().substr(0, 10));
		if (!endingDate) {
			endingDate = new Date().toISOString().substr(0, 10); // need date in YYYY-MM-DD format
			
			var endDate = new Date(endingDate);
			if (startDate > endDate) {
				var swap = startDate;
				startDate = endDate;
				endDate = swap;
			};

			var startYear = startDate.getFullYear();
			var february = (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0 ? 29 : 28;
			var daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		
			var yearDiff = endDate.getFullYear() - startYear;
			var monthDiff = endDate.getMonth() - startDate.getMonth();
			if (monthDiff < 0) {
				yearDiff--;
				monthDiff += 12;
			};

			var dayDiff = endDate.getDate() - startDate.getDate();
			if (dayDiff < 0) {
				if (monthDiff > 0) {
					monthDiff--;
				} else {
					yearDiff--;
					monthDiff = 11;
				};
				dayDiff += daysInMonth[startDate.getMonth()];
			};
			return `Y:${yearDiff} M:${monthDiff} D:${dayDiff}`;
		};
	};

};
