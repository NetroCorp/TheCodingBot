/*
	THECODINGBOT v5
	Created 6/24/2021
*/

// ARGUMENTS ACCEPTED:
//  - true/false | SETS THE BOT TO DEBUG ON/OFF

const cmdArgs = process.argv.slice(2); // Get args

async function bot(debug) {
    if (debug) console.log("- PRE-BOOT");

    if (debug) console.log(` -- App is starting as of ${new Date().toString()} -- `);

    // Do our require
    if (debug) console.log("-> Init: Bootloader");
    const BootLoader = require("./app/functions/bootloader.js");
    const bootloader = new BootLoader();

    await bootloader.printLogo(); // Print that healthy logo

    if (debug) console.log("-> Init: Logger");
    const Log = require("./app/functions/logger.js");
    if (debug) console.log("-> Start: Logging");
    logger = new Log();
    logger.log("i", "SYS", `Logging is now enabled!`);


    if (debug) console.log("-> Init: App");
    const app = require("./app/cfg/app.js");
    app.debugMode = debug;
    app.logger = logger;
    app.bootloader = bootloader;
    logger.log("i", "SYS", `App core successfully loaded!`);


    if (debug) console.log("-> Init: Dependencies");
    const dependencies = app["dependencies"];
    if (debug) console.log(` > Dependencies: ${dependencies.length}`);
    if (debug) logger.log("i", "SYS", `Dependencies are now ready to load!`);



    if (debug) console.log("-> Start: Boot");
    logger.log("i", "SYS", `Starting ${app.name} ${app.version.toFullString()}!`);

    logger.log("i", "SYS", `Enabling dependencies...`);
    // var results = await bootloader.loadDependencies(app, dependencies);
    var results = await bootloader.loadHandler(app, "dependency", dependencies);



    if (debug) console.log("-> Init: Configuration");
    const configuration = await app.modules.fs.readdirSync('./app/cfg').filter(file => file.endsWith('.json'));
    if (debug) console.log(` > Configuration: ${configuration.length}`);
    if (debug) logger.log("i", "SYS", `Configuration files are now ready to load!`);

    logger.log("i", "SYS", `Enabling configuration...`);
    var results = await bootloader.loadHandler(app, "configuration", configuration);

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
    if (debug) logger.log("i", "SYS", `Extras are now ready to load!`);

    logger.log("i", "SYS", `Enabling Extras...`);
    var results = await bootloader.extraHandler(app, extras);

    logger.log("i", "SYS", `Enabling database...`);
    var results = await bootloader.loadHandler(app, "database", null);



    if (debug) console.log("-> Init: Events");
    // const events = await app.modules.fs.readdirSync("./app/evts/", { withFileTypes: true });
    const events = await app.modules.fs.readdirSync('./app/evts').filter(file => file.endsWith('.js'));
    if (debug) console.log(` > Events: ${events.length}`);
    if (debug) logger.log("i", "SYS", `Events are now ready to load!`);

    logger.log("i", "SYS", `Enabling events...`);
    // var results = await bootloader.loadEvents(app, events);
    var results = await bootloader.loadHandler(app, "event", events);



    if (debug) console.log("-> Init: Commands");
    // const commands = await app.modules.fs.readdirSync("./app/cmds/", { withFileTypes: true });
    const commands = await app.modules.fs.readdirSync('./app/cmds').filter(file => file.endsWith('.js'));
    if (debug) console.log(` > Commands: ${commands.length}`);
    if (debug) logger.log("i", "SYS", `Commands are now ready to load!`);

    logger.log("i", "SYS", `Enabling commands...`);
    // var results = await bootloader.loadCommands(app, commands);
    var results = await bootloader.loadHandler(app, "command", commands);


    // if (debug) console.log("-> Init: Slash Commands");
    // // const slashcommands = await app.modules.fs.readdirSync("./app/cmds/", { withFileTypes: true });
    // const slashcommands = await app.modules.fs.readdirSync('./app/cmds/slash').filter(file => file.endsWith('.js'));
    // if (debug) console.log(` > Slash Commands: ${slashcommands.length}`);
    // if (debug) logger.log("i", "SYS", `Slash Commands are now ready to load!`);

    // logger.log("i", "SYS", `Enabling slash commands...`);
    // // var results = await bootloader.loadCommands(app, slashcommands);
    // var results = await bootloader.loadHandler(app, "slashCommand", slashcommands);



    logger.log("i", "SYS", `Logging in...`);

    var results = await client.login(app.config.tokendata.discord);

    // Assume we good
    logger.log("S", "SYS", `Welcome to ${app.name}.`);

}






switch (cmdArgs[0]) {
    case "true":
        bot(true);
        break;
    default:
        bot();
        break;
}; // Just tell the bot to either start with debug or nah :D



process.stdin.resume(); // Let's not close immediately, thanks.

process.on('exit', exitHandler.bind(null, { cleanup: true })); // Let's catch the app before it exits.
//process.on('SIGINT', exitHandler.bind(null, {cleanup:true,exit:true})); // Let's catch CTRL+C.

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

process.on('uncaughtException', exitHandler.bind(null, { exit: false })); // Let's catch uncaught exceptions.

function exitHandler(options, exitCode) {
    var log = function(type, from, msg) {
        if (typeof logger === "object") {
            logger.log("i", "SYS", msg);
        } else {
            console.log(`[${type}] [${from}] ${msg}`);
        };
    }

    if (exitCode)
        if (!isNaN(exitCode))
            log("i", "SYS", "Process is about to exit with code {" + exitCode + "}");
        else
            log("i", "SYS", "Process attempted to exit with " + exitCode);

    process.waitingForCleanup = false;
    if (options.cleanup) {
        process.waitingForCleanup = true;
        if (app.client)
            if (app.client.user != null) {
                //     if (client.config.system.commandState != "Shutdown") {
                //         const trueBotOwOner = client.users.cache.get(client.config.system.owners[0]);
                //         trueBotOwOner.send({
                //             embed: {
                //                 title: client.config.system.emotes.error + " **Shutdown**",
                //                 color: client.config.system.embedColors.red,
                //                 description: "A shutdown is happening, please check CONSOLE for more details.",
                //                 fields: [
                //                     { name: "Process Exit Code", value: "{" + exitCode + "}" }
                //                 ],
                //                 footer: { text: client.config.system.footerText }
                //             }
                //         }).then(msg => {
                //             shutdownBot(client, msg, false, "FROMNODEPROCSS");
                //         });
                //    };
            } else
                process.waitingForCleanup = false;
        else process.waitingForCleanup = false;

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

    if (typeof logger === "class") {
        logger.log("i", "SYS", msg);
    } else {
        console.log(`[i] [SYS] ${msg}`);
    };
}); // Catch all them nasty unhandledRejection errors :/