/*
 * TheCodingBot v6
 * codingbot.gg
 * (c) 2023 Netro Corporation
*/

const fs = require("fs");
const path = require("path");

const { Client, GatewayIntentBits, Partials, PermissionsBitField, Collection } = require("discord.js");
const Logger = require(path.join(__dirname, "/utils/", `logger.js`))();

class Bot {
	constructor(config) {
		this.uptime = {
			startAt: new Date().getTime(),
			readyAt: null
		};

		this.baseDir = __dirname;

		this.config = config;
		this.client = null;
		this.version = {
			major: 6,
			minor: 0,
			revision: 0,
			release: "BETA",

			getBuild: () => { return this.version.release },
			getVersion: () => { return `${this.version.major}.${this.version.minor}.${this.version.revision}` },
			getFull: () => { return `${this.version.getVersion()} ${this.version.getBuild()}` }
		};

		// Logger init
		this.logger = new Logger.execute(this);
		this.loggerMeta = Logger.meta();
	}

	init() {
		// Initialization
		this.logger.info("BOOTSTRAP", `Bootstrapper ${this.loggerMeta.name} initialized!`);
		
		// DO NOT REMOVE
		this.logger.info("BOOTSTRAP", `TheCodingBot v${this.version.getFull()} by Netro Corporation.`);
		// DO NOT REMOVE

		// Checks
		const sayErrorAndCrash = (errMsg) => {
			// Say error
			this.logger.error("BOOTSTRAP", `Check failed while starting: ${errMsg}`);
			// And crash.
			process.exit(-1);
		};

		if (this.config.debug == null || typeof this.config.debug != "boolean") return sayErrorAndCrash("Debug not set! Set it in .env under BOT_DEBUG_ENABLED");

		// Check API Stuffs
		if (!this.config.apis || !this.config.apis == null || this.config.apis == "") return sayErrorAndCrash("API data or config loader broken.");

		if (!this.config.apis.base || this.config.apis.base == null || this.config.apis.base == "") return sayErrorAndCrash("Base API not set! Set it in .env under API_BASE");


		// Check section Discord
		if (!this.config.discord || !this.config.discord == null || this.config.discord == "") return sayErrorAndCrash("Discord data or config loader broken.");

		if (!this.config.discord.clientName || this.config.discord.clientName == null || this.config.discord.clientName == "") return sayErrorAndCrash("Bot Name not set! Set it in .env under BOT_CLIENT_NAME");
		if (!this.config.discord.clientID || this.config.discord.clientID == null || this.config.discord.clientID == "") return sayErrorAndCrash("Bot ID not set! Set it in .env under BOT_CLIENT_ID");
		if (!this.config.discord.clientSecret || this.config.discord.clientSecret == null || this.config.discord.clientSecret == "") return sayErrorAndCrash("Bot Secret not set! Set it in .env under BOT_CLIENT_SECRET");
		if (!this.config.discord.token || this.config.discord.token == null || this.config.discord.token == "") return sayErrorAndCrash("Bot Token not set! Set it in .env under BOT_TOKEN");
		// if (this.config.shardingEnabled == null || this.config.shardingEnabled == "") return sayErrorAndCrash("Sharding not set! Set it in .env under BOT_SHARDING_ENABLED");
		if (this.config.discord.enableSlashCommands == null || typeof this.config.discord.enableSlashCommands != "boolean") return sayErrorAndCrash("Enable Slash Commands not set! Set it in .env under COMMAND_SLASH_ENABLED");
		if (this.config.discord.enableSlashCommands && (this.config.discord.registerCommandsOnStart == null || typeof this.config.discord.registerCommandsOnStart != "boolean")) return sayErrorAndCrash("Register Slash Commands On Start not set! Set it in .env under COMMAND_SLASH_REG_ON_START");
		// if (this.config.discord.enablePrefixCommands == null || typeof this.config.discord.enablePrefixCommands != "boolean") return sayErrorAndCrash("Prefix Slash Commands not set! Set it in .env under COMMAND_PREFIX_ENABLED");

		// Init actual client
		this.client = new Client({
			intents: [
				// INTENT: MESSAGE CONTENT
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.MessageContent,
				// INTENT: GUILDS
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildMessageReactions
			],
			partials: [
				Partials.Channel,
				Partials.Message,
				Partials.User,
				Partials.GuildMember,
				Partials.Reaction
			]
		});

		return true;
	}

	initUtils() {
		// Load utils

		const importantUtils = [ "db", "database", "func", "functions" ];
		this.utils = {};
		const utilsDir = path.join(this.baseDir, "utils");
		const utilsFiles = fs.readdirSync(utilsDir)
			.filter(utilsFiles => utilsFiles.endsWith("js"));
		
		for (const utilsFile of utilsFiles) {
			const startImport = new Date().getTime(),
				fileLocation = path.join(utilsDir, utilsFile),
				fileName = utilsFile.replace(path.extname(utilsFile), "");

			try {
				let options = {};

				const util = require(fileLocation)(this, options);
				const utilMeta = util.meta();

				this.utils[fileName] = util.execute;
				this.logger.debug("BOOTSTRAP", `Load util ${utilMeta.name}: OK in ${new Date().getTime() - startImport}ms.`);
			} catch (Ex) {
				this.logger.error("BOOTSTRAP", `Load util ${fileName}: NOT OK - ${Ex.message}.`);
				console.log(Ex.stack);

				if (importantUtils.includes(fileName)) {
					this.logger.error("BOOTSTRAP", `Important util failed to load. Exiting...!`);
					process.exit(-1);
				};
			};
		};

		return true;
	}

	initEvents() {
		// Load events
		if (!this.client) return new Error("Please init the client first.");

		this.events = new Collection();
		const evtsDir = path.join(this.baseDir, "evts");

		fs.readdirSync(evtsDir).forEach(dir => {
			const eventFiles = fs.readdirSync(path.join(evtsDir, dir))
				.filter(eventFiles => eventFiles.endsWith("js"));
			
			for (const eventFile of eventFiles) {
				const startImport = new Date().getTime(),
					fileLocation = path.join(evtsDir, dir, eventFile),
					fileName = eventFile.replace(path.extname(eventFile), "");

				this.functions.clearCache(fileLocation);
				try {
					const event = require(fileLocation)();
					const eventMeta = event.meta();
					if (eventMeta.type == "rest") this.client.rest.on(eventMeta.name, (...args) => event.run(app, args));
					else this.client.on(eventMeta.name, (...args) => event.run(this, args));

					this.logger.debug("BOOTSTRAP", `Load event ${eventMeta.name}: OK in ${new Date().getTime() - startImport}ms.`);
				} catch (Ex) {
					this.logger.error("BOOTSTRAP", `Load event ${fileName}: NOT OK - ${Ex.message}.`);
					console.log(Ex.stack);
				};
			};
		});

		return true;
	}

	initCommands() {
		// Load commands
		if (!this.client) return new Error("Please init the client first.");

		this.commands = {
			slash: new Collection(),
			slash_data: []
		};

		const cmdsDir = path.join(this.baseDir, "cmds");

		fs.readdirSync(cmdsDir).forEach(dir => {
			const commandFiles = fs.readdirSync(path.join(cmdsDir, dir))
				.filter(commandFiles => commandFiles.endsWith("js"));
			
			for (const commandFile of commandFiles) {
				const startImport = new Date().getTime(),
					fileLocation = path.join(cmdsDir, dir, commandFile),
					fileName = commandFile.replace(path.extname(commandFile), "");

				this.functions.clearCache(fileLocation);
				try {
					const command = require(fileLocation)();
					if (!("meta" in command) || !("execute" in command)) throw new Error(`missing a required "meta" or "execute" property.`);

					const commandMeta = command.meta().toJSON();

					this.commands.slash.set(commandMeta.name, { ...command, meta: { ...commandMeta, category: dir, ownerOnly: commandMeta.ownerOnly || (dir === "Owner")  } }); // Restruct meta
					this.commands.slash_data.push(commandMeta);

					this.logger.debug("BOOTSTRAP", `Load command ${commandMeta.name}: OK in ${new Date().getTime() - startImport}ms.`);
				} catch (Ex) {
					this.logger.error("BOOTSTRAP", `Load command ${fileName}: NOT OK - ${Ex.message}.`);
					console.log(Ex.stack);
				};
			};
		});

		return true;
	}

	login() {
		// Login
		this.client.login(this.config.discord.token)
			.then(() => {
				this.logger.info("BOOTSTRAP", `Logged in!`);
			})
			.catch(err => {
				this.logger.error("BOOTSTRAP", `Login failed: ${err.message}`);
				process.exit(-1);
			});
		return true;
	}
};

const botInit = async(config) => {
	if (!config) {
		console.log("\x1b[31mPlease make sure to be coming from src/index.js ... :c\x1b[0m");
		process.exit(-1);
	}
	// console.log(spawningManager)
	console.log("Starting the bot, please wait.");
	const bot = new Bot(config);
	// if (spawningManager) bot.manager = spawningManager;

	await bot.init();
	await bot.initUtils();

	const findEr = (s) => { bot.logger.error("BOOTSTRAP", `Failed to find ${s}. Exiting...!`); };
	if (bot.utils) {
		if (!bot.utils.functions) { findEr("functions"); process.exit(-1); }
		else if (!bot.utils.database) { findEr("database"); process.exit(-1); };
	} else { findEr("utils"); process.exit(-1); };
	
	bot.functions = new bot.utils.functions(bot);

	const db = new bot.utils.database(bot);
	await db.init({
		username: process.env.DB_NAME ? process.env.DB_USER : null,
		password: process.env.DB_NAME ? process.env.DB_PASS : null,
		database: process.env.DB_NAME ? process.env.DB_NAME : "TheCodingBot",
		dbCfg: {
			dialect: "mysql",
			host: process.env.MYSQL_DATABASE ? process.env.DB_HOST : "0.0.0.0",
			logging: data => { bot.logger.debug("DATABASE", data); }
		},
	});

	bot.lang = new bot.utils.language(bot);
	await bot.lang.init();

	await bot.initEvents();
	await bot.initCommands();
	await bot.login();
};

module.exports = botInit;
if (require.main === module) { console.log("\x1b[31mPlease make sure to be coming from src/index.js ... :c\x1b[0m"); };