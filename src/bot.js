/*
 TheCodingBot Version 4.
 Main bot script.
 
 Created: Apr. 4th, 2020 10:54 AM.
 Last Update: May 2nd, 2021
 -----------------------------------
*/

//const message = require("./bot_modules/evts/message.js");

// We depend on: fs [FileSystem] & Discord, and now Sequelize [as of TCB v4.2]
var fs = null, Discord = null, Sequelize = null;

// Discord depends on: client [Discord Bot Client], config [Configuration], botname [Bot Name]
var client = null, config = null, botname = "TheCodingBot";

// Colors
var colors = { 
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

// ================================
//			FUNCTIONS
// ================================

function boot() {
	showAmazingBootLoader();

	console.log(`[${colors.FgBlue}i${colors.Reset}] [${colors.FgGreen}SYS${colors.Reset}] Loading in the functions...`);

	require("./bot_modules/config/functions.js")();


	// FS Handler
	log("i", "SYS", "Loading FS...");
	fs = require("fs");
	log("i", "SYS", "Enabling FS...");

	// Discord.JS Handler
	log("i", "SYS", "Loading Discord.JS...");
	Discord = require("discord.js");
	log("i", "SYS", "Enabling Discord.JS...");
	client = new Discord.Client();
	client.commands = new Discord.Collection();
	client.config = {};
	client.bytes = {};

	log("i", "SYS", "Loading Sequelize...");
	Sequelize = require('sequelize');
	// Sequelize Handler
	log("i", "SYS", "Enabling Sequelize...");
	client.sequelize = new Sequelize({
		dialect: 'sqlite',
		storage: 'bot_modules/config/db.sqlite',
		logging: false
	});


	// Other stuff
	secToWait = .6; // This is in seconds, not miliseconds.


	if (typeof load === "function") {
		log("i", "SYS", "Call load(config).");
		if (load(client, "config")["error"] != "none") {
			msg = "~";
			log("X", "SYS", "Could not load in configuration, bot cannot continue.");
			process.exit(-1);
		} else {
			log("S", "SYS", "Call load(config) complete.");

		};
		setTimeout(function () {
			log("i", "SYS", "Call load(commands).");
			if (load(client, "commands")["error"] != "none") {
				msg = "~";
				log("X", "SYS", "Could not load in commands, bot will continue no with commands~");
			} else {
				log("S", "SYS", "Call load(commands) complete.");

			};

			setTimeout(function () {
				log("i", "SYS", "Call load(events).");
				if (load(client, "events")["error"] != "none") {
					msg = "~";
					log("X", "SYS", "Could not load in events, bot cannot continue.");
					process.exit(-1);
				} else {
					log("S", "SYS", "Call load(events) complete.");
		
				};
				setTimeout(async() => {
					log("i", "SYS", "Connect to Discord.");
					client.connections = {
						startupTime: 0,
						attempts: {
							total: 4,
							remaining: 0
						},
						updateTime: null,
						success: false
					};
					client.connections.attempts.remaining = client.connections.attempts.total;
					client.connections.updateTime = setInterval(function() { client.connections.startupTime += 1; }, 1);
					while (!client.connections.success && client.connections.attempts.remaining > 0) {
						client.connections.attempts.remaining = (client.connections.attempts.remaining - 1);
						log("i", "DISCORD", "Connecting to Discord... (Attempt " + (client.connections.attempts.total - client.connections.attempts.remaining) + "/" + client.connections.attempts.total + ")");
						await client.login(client.config.tokendata.discord).then(test => {
							log("S", "SYS", "Connected to Discord.");

						}).catch(err => {
							log("X", "DISCORD", "Failed to connect to Discord: " + err.message);
						});
						await sleep(15000);
					};
					if (!client.connections.success) {
						log("X", "SYS", "Failed to connect to Discord. Bot will now restart.");
						process.exit(-1);
					} else {
						// This logs AFTER await sleep() is done, and it wouldn't look right in console, so
						// it's left commented out
						// ~TCG 10:00 AM 5/11/2020
						//log("S", "SYS", "Call to Connect to Discord completed.");
						client.connections = {
							startupTime: 0,
							attempts: {
								total: 4,
								remaining: 0
							},
							updateTime: null,
							success: false
						};
					};
				}, secToWait + 1.0 * 1000);
			}, secToWait * 1000);
		}, secToWait * 1000);
	} else {
		msg = "Could not load the load function, bot will now terminate~";
		if (typeof log === "function") {
			log("X", "SYS", msg);
		} else {
			console.log(`[${colors.FgRed}i${colors.Reset}] [${colors.FgGreen}SYS${colors.Reset}] ${msg}`);
		};
		process.exit(-1);
	};
};

function showAmazingBootLoader() {
	console.log(`${colors.FgMagenta}==[ ${colors.FgYellow}${botname} ${colors.FgRed}BootLoader ${colors.FgMagenta}]==${colors.Reset}`);
	console.log(`${colors.FgMagenta}== Based on the ${colors.FgRed}TCBBL ${colors.FgMagenta}by ${colors.FgGreen}TMC Software${colors.FgMagenta}. ==${colors.Reset}`);
	console.log(`${colors.FgRed}TheCodingBot BootLoader ${colors.FgMagenta}(c) ${colors.FgGreen}TMC Software ${colors.FgMagenta}2020.${colors.Reset}`);
	console.log(`${colors.FgRed}BootLoader ${colors.FgMagenta}Version: ${colors.FgGreen}4.0${colors.Reset}\n\n`);
}


// ================================
//			MAIN BOT~
// ================================

boot(); // Tell the boot funciton we ready to boot!

process.stdin.resume(); // Let's not close immediately, thanks.

process.on('exit', exitHandler.bind(null,{cleanup:true})); // Let's catch the app before it exits.
//process.on('SIGINT', exitHandler.bind(null, {cleanup:true,exit:true})); // Let's catch CTRL+C.

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

process.on('uncaughtException', exitHandler.bind(null, {exit:false})); // Let's catch uncaught exceptions.

function exitHandler(options, exitCode) {

	if (exitCode)
		if (!isNaN(exitCode))
			log("i", "SYS", "Process is about to exit with code {" + exitCode + "}");
		else
			log("i", "SYS", "Process was about to exit with a non-number exit code. We cancelled that action.\nHere's what was happening: " + exitCode);

	process.waitingForCleanup = false;
	if (options.cleanup) {
		process.waitingForCleanup = true;
		if (client && client.user != null) {
			if (client.config.system.commandState != "Shutdown") {
				const trueBotOwOner = client.users.cache.get(client.config.system.owners[0]);
				trueBotOwOner.send({ embed: {
					title: client.config.system.emotes.error + " **Shutdown**",
					color: client.config.system.embedColors.red,
					description: "A shutdown is happening, please check CONSOLE for more details.",
					fields: [
						{ name: "Process Exit Code", value: "{" + exitCode + "}"}
					],
					footer: { text: client.config.system.footerText }
				}}).then(msg => {
					shutdownBot(client, msg, false, "FROMNODEPROCSS");
				});
			};
		} else
			process.waitingForCleanup = false;
	};

	process.waitingForCleanupTM = setInterval(function() {
		if (!process.waitingForCleanup) {
			clearInterval(process.waitingForCleanupTM);
			if (options.exit) process.exit();
		};
	}, 100);

}

process.on('unhandledRejection', error => {
	const errreason = new Error(error.message);
	const errstack = ` Caused By:\n${error.stack}`;

	const msg = ` == UNHANDLED REJECTION THROWN ==\n${errreason}\n${errstack}\n ================================`;
	if (typeof log === "function") {
		log("i", "SYS", msg);
	} else {
		console.log(`[${colors.FgBlue}i${colors.Reset}] [${colors.FgGreen}SYS${colors.Reset}] ${msg}`);
	};
}); // Catch all them nasty unhandledRejection errors :/
