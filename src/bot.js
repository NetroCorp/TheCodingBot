/*
	THECODINGBOT v5
	6/24/2021

	Now open-source!

	Can you believe it took Matt 4 years (as of 2022)
	to open-source his bot projects?
	Yeah, I know crazy. wait.. why am I talking third-person again?

	https://tcb.nekos.tech/source
	https://themattchannel.com
*/

var logger;
process.waitingForCleanup = false;
async function bot(debug, lastMessageID = null) {


    // ========== PRE-BOOT
    var startTime = new Date().getTime();
    if (debug) console.log("- PRE-BOOT");
    if (debug) console.log(` -- App is starting as of ${new Date(startTime).toString()} -- `);

    // Change directory
    try {
        if (process.cwd().split("\\").slice(-1) != "src") // attempt to change into 'src'
            process.chdir(process.cwd() + "/src");
    } catch (Ex) {}; // Assume it's okay to continue.

    // Do our require
    if (debug) console.log("-> Init: Bootloader");
    const BootLoader = require("./app/functions/bootloader.js");
    const bootloader = new BootLoader();
    await bootloader.printLogo(); // Print that healthy logo. Logo got back


    if (debug) console.log("-> Init: Logger");
    const Log = require("./app/functions/logger.js");
    if (debug) console.log("-> Start: Logging");
    logger = new Log();
    logger.info("SYS", `Logging is now enabled!`);

    await logger.warnAboutDebug(debug); // warn about debugging (if it applies)

    if (debug) console.log("-> Init: App");
    const app = require("./app/cfg/app.js");
    app.debugMode = debug;
    app.logger = logger;
    app.bootloader = bootloader;
    app.startTime = startTime;
    app.botStart = (lastMessage) => bot(debug, lastMessage);
    if (lastMessageID != null) app.lastMessageID = lastMessageID;
    logger.info("SYS", `App core successfully loaded!`);


    async function exitHandler(options, exitCode) {
        // if (process.waitingForCleanup) return; // stops from trying to keep process a million times
        process.waitingForCleanup = false;

        var app = ((options) ? options.app : app) || app;

        var log = function(type, from, msg) {
            if (logger) logger.info("SYS", msg);
            else console.log(`[${type}] [${from}] ${msg}`);
        }

        if (exitCode)
            if (!isNaN(exitCode))
                log("i", "SYS", "Process is about to exit with code {" + exitCode + "}");
            else
                log("i", "SYS", "Process attempted to exit with " + exitCode);

        var appName = ((app !== undefined) ? app.name : "Now");

        if (options.cleanup && !process.waitingForCleanup) {
            process.waitingForCleanup = true;
            if (app !== undefined) {
                if (app.client !== undefined) { // Close Discord
                    log("i", "SYS", "Logging out...");
                    try {
                        await app.client.destroy();
                    } catch (err) {
                        log('X', 'SYS', err);
                    };

                    if (app.client._events) {
                        var events = Object.keys(app.client._events)
                        for (var i = 0; i < events.length; i++) {
                            log("i", "SYS", "Unloading event " + events[i]);
                            await app.client.removeListener(events[i], () => {});
                        };
                    };

                    app.client = null;
                };
                if (app.db !== undefined) { // Close DBs
                    log("i", "SYS", "Closing databases...");
                    try {
                        await app.db.close();
                    } catch (err) {
                        log('X', 'SYS', err);
                    };

                    app.db = null;
                };
                if (app.extras !== undefined) { // Close extras
                    log("i", "SYS", "Unloading extras...");
                    try {
                        for (var extra in app.extras) {
                            extra = app.extras[extra];
                            await extra.extraApp.uninit(app);
                        };
                    } catch (err) {
                        log('X', 'SYS', err);
                    };

                    app.extras = null;
                };

                app = null;
            };

            process.waitingForCleanup = false;
        };

        process.waitingForCleanupTM = setInterval(function() {
            if (!process.waitingForCleanup) {
                clearInterval(process.waitingForCleanupTM);

                if (options.exit) {
                    log("i", "SYS", `${appName} exiting as of ${new Date()}.`);

                    process.exit(0);
                };
            };
        }, 500);


    };

    process.exitHandler = (options, exitCode) => exitHandler(options, exitCode);

    // Kinda dumb how I had to shove it into the bot function but it's whatever.
    process.stdin.resume(); // Let's not close immediately, thanks.

    process.once('exit', exitHandler.bind(null, { cleanup: true, exit: true })); // Let's catch the app before it exits.
    process.once('SIGINT', exitHandler.bind(null, { app: app, exit: true, cleanup: true })); // Let's catch CTRL+C.
    // catches "kill pid" (for example: nodemon restart)
    process.once('SIGUSR1', exitHandler.bind(null, { exit: true }));
    process.once('SIGUSR2', exitHandler.bind(null, { exit: true }));

    process.on('uncaughtException', error => {
        const errreason = new Error(error.message);
        const errstack = ` Caused By:\n  ${error.stack}`;

        const msg = ` == UNCAUGHT EXCEPTION THROWN ==\n${errreason}\n${errstack}\n ================================`;

        if (logger) logger.error("SYS", msg);
        else console.log(`[X] [SYS] ${msg}`);
    }); // Catch all them nasty uncaughtException errors :/

    process.on('unhandledRejection', error => {
        const errreason = new Error(error.message);
        const errstack = ` Caused By:\n  ${error.stack}`;

        const msg = ` == UNHANDLED REJECTION THROWN ==\n${errreason}\n${errstack}\n ================================`;

        if (logger) logger.info("SYS", msg);
        else console.log(`[i] [SYS] ${msg}`);
    }); // Catch all them nasty unhandledRejection errors :/

    if (debug) console.log("-> Init: Dependencies");
    const dependencies = app["dependencies"];
    if (debug) console.log(` > Dependencies: ${dependencies.length}`);
    if (debug) logger.debug("SYS", `Dependencies are now ready to load!`);


    // ========== BOOT
    if (debug) console.log("-> Start: Boot");
    logger.info("SYS", `Starting ${app.name} ${app.version.toFullString()}!`);


    logger.info("SYS", `Enabling dependencies...`);
    if (!process.waitingForCleanup) await bootloader.loadHandler(app, "dependency", dependencies);


    if (debug) console.log("-> Init: Configuration");
    const configuration = await app.modules.fs.readdirSync('./app/cfg').filter(file => file.endsWith('.json'));
    if (debug) console.log(` > Configuration: ${configuration.length}`);
    if (debug) logger.debug("SYS", `Configuration files are now ready to load!`);


    logger.info("SYS", `Enabling configuration...`);
    if (!process.waitingForCleanup) await bootloader.loadHandler(app, "configuration", configuration);


    if (debug) console.log("-> Init: Discord Client...");
    const { Client, Intents } = app.modules["discord.js"];
    const client = new Client({
        partials: ["MESSAGE", "CHANNEL", "REACTION", "GUILD_MEMBER", "USER"],
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_PRESENCES]
    });
    app.client = client;
    if (debug) console.log(` > New Discord Client created.`);


    if (debug) console.log("-> Init: Extras");
    const extras = await require('./app/extras/extras.json'); // this is probably inefficent, but it works ig
    app.extras = {};
    if (debug) console.log(` > Extras: ${extras.length}`);
    if (debug) logger.debug("SYS", `Extras are now ready to load!`);


    logger.info("SYS", `Enabling Extras...`);
    if (!process.waitingForCleanup) await bootloader.extraHandler(app, extras);


    logger.info("SYS", `Enabling database...`);
    if (!process.waitingForCleanup) await bootloader.loadHandler(app, "database", null);


    if (debug) console.log("-> Init: Events");
    const events = await app.modules.fs.readdirSync('./app/evts').filter(file => file.endsWith('.js'));
    if (debug) console.log(` > Events: ${events.length}`);
    if (debug) logger.debug("SYS", `Events are now ready to load!`);


    logger.info("SYS", `Enabling events...`);
    if (!process.waitingForCleanup) await bootloader.loadHandler(app, "event", events);


    if (debug) console.log("-> Init: Commands");
    // const commands = await app.modules.fs.readdirSync('./app/cmds').filter(file => file.endsWith('.js'));
    const commands = await app.functions.getFiles('./app/cmds', ["", ".js"]);
    if (debug) console.log(` > Commands: ${commands.length}`);
    if (debug) logger.debug("SYS", `Commands are now ready to load!`);


    logger.info("SYS", `Enabling commands...`);
    if (!process.waitingForCleanup) await bootloader.loadHandler(app, "command", commands);

    // if (debug) console.log("-> Init: Slash Commands");
    // const slashcommands = await app.modules.fs.readdirSync('./app/cmds/slash').filter(file => file.endsWith('.js'));
    // if (debug) console.log(` > Slash Commands: ${slashcommands.length}`);
    // if (debug) logger.debug("SYS", `Slash Commands are now ready to load!`);

    // logger.info("SYS", `Enabling slash commands...`);
    // await bootloader.loadHandler(app, "slashCommand", slashcommands);

    // I don't know how I want to do slash commands, although this code *kinda* works.
    // You just gotta tweak around in bootloader to get it to actually load. Otherwise,
    // this is a waste of bytes. Hmph.

    try {
        logger.info("SYS", `Logging in...`);
        if (!process.waitingForCleanup) await client.login(app.config.tokendata.discord);

        // Assume we good
        logger.success("SYS", `Welcome to ${app.name}.`);
    } catch (Ex) {
        if (Ex.message.includes("Cannot read properties of undefined (reading 'discord')"))
            app.logger.error("SYS", "Hey, you probably forgot to follow the README!\nYou need to ensure 'tokendata.json.example' to 'tokendata.json'.\nIf you've done this, please ensure your JSON is not broken.\nIf it's not, please open an issue on the GitHub.");
        else if (Ex.stack.includes("DISALLOWED_INTENTS"))
            app.logger.error("SYS", "Hey, you need to allow intents for your bot!\nIntents required: 'PRESENCE', 'SERVER MEMBERS', 'MESSAGE CONTENT'.\nPlease view the README for more information and how to enable intents for " + app.name + ".\nIf you've done this, please open an issue on the GitHub.");
        else
            app.logger.error("SYS", "I could not connect to Discord. Sorry about that.\nI can't provide much help, but if this issue is caused by programming not by you, please open a GitHub issue with the following information:\n" + Ex);
        process.exit(-1); // I mean ig this is a good thing to do?
    };

};

// ARGUMENTS ACCEPTED:
//  - true/false | SETS THE BOT TO DEBUG ON/OFF

// WARNING: Debug is really spammy. It's the equivalent
// of asking "GOOD LORD, WHAT IS HAPPENING IN THERE?"
const cmdArgs = process.argv.slice(2); // Get args
switch (cmdArgs[0]) {
    case "true":
        bot(true);
        break;
    default:
        bot();
        break;
}; // Just tell the bot to either start with debug or nah :D



// The heck is that all the way down here for? Beats me.