/*
	THECODINGBOT v5
	6/24/2021

	Now open-source!
	Can you believe it Matt 4 years (as of 2022)
	to open-source his bot projects?
	Yeah, I know crazy. wait.. why am i talking third-person again?

	https://tcb.nekos.tech/source
	https://themattchannel.com
*/

const app = require("./app/cfg/app.js");

async function bot(debug) {
    // ========== PRE-BOOT
    if (debug) console.log("- PRE-BOOT");
    if (debug) console.log(` -- App is starting as of ${new Date().toString()} -- `);

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


    if (debug) console.log("-> Init: App");
    const app = require("./app/cfg/app.js");
    app.debugMode = debug;
    app.logger = logger;
    app.bootloader = bootloader;
    logger.info("SYS", `App core successfully loaded!`);


    if (debug) console.log("-> Init: Dependencies");
    const dependencies = app["dependencies"];
    if (debug) console.log(` > Dependencies: ${dependencies.length}`);
    if (debug) logger.debug("SYS", `Dependencies are now ready to load!`);


    // ========== BOOT
    if (debug) console.log("-> Start: Boot");
    logger.info("SYS", `Starting ${app.name} ${app.version.toFullString()}!`);


    logger.info("SYS", `Enabling dependencies...`);
    await bootloader.loadHandler(app, "dependency", dependencies);


    if (debug) console.log("-> Init: Configuration");
    const configuration = await app.modules.fs.readdirSync('./app/cfg').filter(file => file.endsWith('.json'));
    if (debug) console.log(` > Configuration: ${configuration.length}`);
    if (debug) logger.debug("SYS", `Configuration files are now ready to load!`);


    logger.info("SYS", `Enabling configuration...`);
    await bootloader.loadHandler(app, "configuration", configuration);


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
    await bootloader.extraHandler(app, extras);


    logger.info("SYS", `Enabling database...`);
    await bootloader.loadHandler(app, "database", null);


    if (debug) console.log("-> Init: Events");
    const events = await app.modules.fs.readdirSync('./app/evts').filter(file => file.endsWith('.js'));
    if (debug) console.log(` > Events: ${events.length}`);
    if (debug) logger.debug("SYS", `Events are now ready to load!`);


    logger.info("SYS", `Enabling events...`);
    await bootloader.loadHandler(app, "event", events);


    if (debug) console.log("-> Init: Commands");
    const commands = await app.modules.fs.readdirSync('./app/cmds').filter(file => file.endsWith('.js'));
    if (debug) console.log(` > Commands: ${commands.length}`);
    if (debug) logger.debug("SYS", `Commands are now ready to load!`);


    logger.info("SYS", `Enabling commands...`);
    await bootloader.loadHandler(app, "command", commands);


    // if (debug) console.log("-> Init: Slash Commands");
    // const slashcommands = await app.modules.fs.readdirSync('./app/cmds/slash').filter(file => file.endsWith('.js'));
    // if (debug) console.log(` > Slash Commands: ${slashcommands.length}`);
    // if (debug) logger.debug("SYS", `Slash Commands are now ready to load!`);

    // logger.info("SYS", `Enabling slash commands...`);
    // await bootloader.loadHandler(app, "slashCommand", slashcommands);

    // I don't know how I want to do slash commands, although this code *kinda* works.
    // You just gotta tweak around in bootloader to get it to actually load. Otherwise,
    // this is a waste of bytes. Hmph.

    logger.info("SYS", `Logging in...`);

    await client.login(app.config.tokendata.discord);

    // Assume we good
    logger.success("SYS", `Welcome to ${app.name}.`);
};

process.stdin.resume(); // Let's not close immediately, thanks.

process.on('exit', exitHandler.bind(null, { cleanup: true })); // Let's catch the app before it exits.
// process.on('SIGINT', exitHandler.bind(null, { cleanup: true, exit: true })); // Let's catch CTRL+C.
// For some reason, that's buggy. Don't enable it unless you know its not gonna lurk in your background...
// or whatever reason get stuck???

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

function exitHandler(options, exitCode) {
    var log = function(type, from, msg) {
        if (logger !== undefined) logger.info("SYS", msg);
        else console.log(`[${type}] [${from}] ${msg}`);
    }

    if (exitCode)
        if (!isNaN(exitCode))
            log("i", "SYS", "Process is about to exit with code {" + exitCode + "}");
        else
            log("i", "SYS", "Process attempted to exit with " + exitCode);

    process.waitingForCleanup = false;

    if (options.cleanup) {
        if (app !== undefined)
            if (app.client !== undefined) app.client.destroy();

        process.waitingForCleanup = false;
    };

    process.waitingForCleanupTM = setInterval(function() {
        if (!process.waitingForCleanup) {
            clearInterval(process.waitingForCleanupTM);

            if (options.exit) {
                log("i", "SYS", `${app.name} exiting as of ${new Date()}.`);
                process.exit();
            };
        };
    }, 500);


}


process.on('uncaughtException', error => {
    const errreason = new Error(error.message);
    const errstack = ` Caused By:\n  ${error.stack}`;

    const msg = ` == UNCAUGHT EXCEPTION THROWN ==\n${errreason}\n${errstack}\n ================================`;

    if (logger !== undefined) logger.error("SYS", msg);
    else console.log(`[X] [SYS] ${msg}`);
}); // Catch all them nasty uncaughtException errors :/

process.on('unhandledRejection', error => {
    const errreason = new Error(error.message);
    const errstack = ` Caused By:\n  ${error.stack}`;

    const msg = ` == UNHANDLED REJECTION THROWN ==\n${errreason}\n${errstack}\n ================================`;

    if (logger !== undefined) logger.info("SYS", msg);
    else console.log(`[i] [SYS] ${msg}`);
}); // Catch all them nasty unhandledRejection errors :/




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