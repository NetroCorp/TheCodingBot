//
// TheCodingBot
// Netro Corporation
//
// https://codingbot.gg


const start = async(debugMode) => {
	// Init
	const startTime = new Date().getTime();
	const botDirectory = `${process.cwd()}/src/app`;
	const app = require(`${botDirectory}/cfg/system.js`);
	app.debugMode = debugMode;
	app.startUp = {
		startTime,
		finishTime: 0
	};
	app.botDirectory = botDirectory;
	app.functions = require(`${botDirectory}/func/main.js`)(app);

	app.log = require(`${botDirectory}/func/logger.js`)(app);
	app.log.debug("SYSTEM", "Hello World! Now starting up!");

	// Import dependencies
	if (app.system.dependencies) {
		app.log.info("SYSTEM", "Importing dependencies...");
		if (!app.dependencies) app.dependencies = {};
		for (var i = 0; i < app.system.dependencies.length; i++) {
			const startImport = new Date().getTime();
			let dependency = app.system.dependencies[i];
			try {
				app.functions.clearCache(dependency.name);
				app.dependencies[dependency.name] = require(dependency.name);
				app.log.debug("SYSTEM", `Imported dependency - ${dependency.name} in ${new Date().getTime() - startImport}ms.`);

				// Additional configuration for some modules if needed
				if (dependency.name == "dotenv") app.dependencies[dependency.name].config();
			} catch (Ex) {
				let missingMod = Ex.message.includes("Cannot find module");
				if (missingMod) { app.log.error("SYSTEM", `Could not import module - ${dependency.name}!`); }
				else console.log(Ex);
				if (dependency.required || !missingMod) { process.exit(-1); };
			};
		};
	};
	const { Client, GatewayIntentBits, Partials, Collection, PermissionsBitField } = app.dependencies["discord.js"];

	// Import functions
	app.functions.updateChecker = require(`${botDirectory}/func/update.js`)(app);
	await app.functions.updateChecker.init();

	app.functions.database = require(`${botDirectory}/func/database.js`)(app);
	await app.functions.database.init();

	// Load client
	app.log.info("SYSTEM", "Configuring Discord Client...");
	app.client = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildMessageReactions,
			GatewayIntentBits.DirectMessages,
			GatewayIntentBits.MessageContent,
		],
		partials: [
			Partials.Channel,
			Partials.Message,
			Partials.User,
			Partials.GuildMember,
			Partials.Reaction
		]
	});

	// Import events
	app.log.info("SYSTEM", "Importing events...");
	app.events = new Collection();
	app.dependencies.fs.readdirSync(`${botDirectory}/evts/`).forEach(dir => {
		const events = app.dependencies.fs.readdirSync(`${botDirectory}/evts/${dir}`).filter(file => file.endsWith('.js'));
		for (let file of events) {
			const startImport = new Date().getTime(),
				fileLocation = `${botDirectory}/evts/${dir}/${file}`;
			app.functions.clearCache(fileLocation);
			try {
				let event = require(fileLocation)();
				const eventMeta = event.meta();
				if (eventMeta.type == "rest") app.client.rest.on(eventMeta.name, (...args) => event.run(app, args));
				else app.client.on(eventMeta.name, (...args) => event.run(app, args));

				app.log.debug("SYSTEM", `Imported ${eventMeta.type} event - ${eventMeta.name} in ${new Date().getTime() - startImport}ms.`);
			} catch (Ex) {
				app.log.error("SYSTEM", `Could not load event - ${file}!`);
				console.log(Ex);
			};
		};
	});

	// Import mods
	try {
		const mods = require(`${botDirectory}/mods/modules.json`);
		if (!app.modules) app.modules = {};
		for (let mod of mods) {
			const startImport = new Date().getTime(),
				fileLocation = `${botDirectory}/mods/${mod.file}`;
			let missingMod = false;
			if (mod.dependencies) { // Looks like this module requires some more dependencies!
				for (var i = 0; i < mod.dependencies.length; i++) {
					const startImport = new Date().getTime();
					let dependency = mod.dependencies[i];
					try {
						app.functions.clearCache(dependency.name);
						app.dependencies[dependency.name] = require(dependency.name);
						app.log.debug("SYSTEM", `Imported dependency - ${dependency.name} for ${mod.name} in ${new Date().getTime() - startImport}ms.`);
					} catch (Ex) {
						missingMod = Ex.message.includes("Cannot find module");
						if (missingMod) { app.log.error("SYSTEM", `Could not import dependency - ${dependency.name} for ${mod.name}!`); }
						else console.log(Ex);
						if (dependency.required || !missingMod) {
							app.log.warn("SYSTEM", `Dependency import failed for ${mod.name}. This module will be diasbled.`);
							break;
						};
					};
				};
			};
			if (missingMod) continue;

			try {
				app.functions.clearCache(fileLocation);
				let modData = require(fileLocation)(app);
				await modData.init();

				app.log.debug("SYSTEM", `Imported module - ${mod.name} in ${new Date().getTime() - startImport}ms`);
			} catch (Ex) {
				app.log.error("SYSTEM", `Could not load module - ${mod.name}!`);
				console.log(Ex);
			};
		};
	} catch (Ex) {
		app.log.error("SYSTEM", `Could not load modules (is the file there and JSON is parsing correctly?).`);
		if (!Ex.message.includes("Cannot find module") && !Ex.message.includes("modules.json")) console.log(Ex);
	};

	// Import commands
	app.log.info("SYSTEM", "Importing commands...");
	app.commands = {
		slash: new Collection(),
		prefix: new Collection(),
		slash_data: []
	};
	
	app.dependencies.fs.readdirSync(`${botDirectory}/cmds/`).forEach(dir => {
		const commands = app.dependencies.fs.readdirSync(`${botDirectory}/cmds/${dir}`).filter(file => file.endsWith('.js'));
		for (let file of commands) {
			const startImport = new Date().getTime(),
				fileLocation = `${botDirectory}/cmds/${dir}/${file}`;
			app.functions.clearCache(fileLocation);
			try {
				let command = require(fileLocation)();
				const commandMeta = command.meta();
				if (process.env.COMMANDS_SLASH_ENABLED == "true" && commandMeta.supportsSlash) {
					app.commands.slash.set(commandMeta.name, command);
					app.commands.slash_data.push({
						name: commandMeta.name,
						type: commandMeta.type || 1,
						description: commandMeta.description,
						options: commandMeta.options,
						default_permission: commandMeta.permissions.DEFAULT_PERMISSIONS || null,
						default_member_permissions: commandMeta.permissions.DEFAULT_MEMBER_PERMISSIONS ? PermissionsBitField.resolve(commandMeta.permissions.DEFAULT_MEMBER_PERMISSIONS).toString() : null,
					});
					app.log.debug("SYSTEM", `Imported slash command - ${commandMeta.name} in ${new Date().getTime() - startImport}ms.`);
				};
				if (process.env.COMMANDS_PREFIX_ENABLED == "true" && commandMeta.supportsPrefix) {
					app.commands.prefix.set(commandMeta.name, command);
					app.log.debug("SYSTEM", `Imported prefix command - ${commandMeta.name} in ${new Date().getTime() - startImport}ms.`);
				};

			} catch (Ex) {
				app.log.error("SYSTEM", `Could not load command - ${file}!`);
				console.log(Ex);
			};
		};
	});

	// Login now!!
	app.log.info("DISCORD", "Now logging in...");
	app.client.login(process.env.BOT_TOKEN).catch((err) => {
		app.log.error("DISCORD", "Failed to login!");
		console.log(err);
		process.exit(-1);
	});

};
module.exports = function(debugMode) { return start(debugMode) }
if (require.main === module) { console.log("\x1b[31mPlease call index.js.\x1b[0m"); };