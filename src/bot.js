/*
	TheCodingBot v6
	https://tcb.nekos.tech
*/

// Version 6 of TheCodingBot
// Can you believe we've come this far?

const startTime = new Date().getTime();
(async() => {
    try {
        console.log(` -- Starting as of ${new Date(startTime).toString()} -- `);

        // Change directory
        try {
            if (process.cwd().split("\\").slice(-1) != "src") // attempt to change into 'src'
                process.chdir(process.cwd() + "/src");
        } catch (Ex) {}; // Assume it's okay to continue.

        // Import ourselves and other stuff
        const app = require(`${process.cwd()}/app/cfg/app.js`);
        app.debugMode = true;
        app.config = require(`${process.cwd()}/app/cfg/config.js`);
        app.functions = require(`${process.cwd()}/app/func/main.js`)();
        app.functions.setContext(app);


        // Import logger (so we look pretty :)
        app.logger = require(`${process.cwd()}/app/func/logger.js`)();
        app.logger.setContext(app);
        app.logger.info("SYS", `Hello world of ${app.name}! Logger configured!`);

        // Load dependencies
        app.logger.info("SYS", `Loading ${app.dependencies.length} dependencies...`);
        app.modules = {};
        app.functions.loadDependencies(app.dependencies);

        // Define our Client lol
        app.logger.info("SYS", "Loading client...");
        const { Client, GatewayIntentBits } = app.modules["discord.js"];
        app.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildBans,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildWebhooks,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.DirectMessageTyping
            ]
        });


        // Load events
        const events = await app.modules.fs.readdirSync(`${process.cwd()}/app/evts`).filter(file => file.endsWith('.js'));
        app.logger.info("SYS", `Loading ${events.length} events...`);
        await app.functions.loadEvents(events);

        // Load commands
		app.client.slashCommands = new app.modules["discord.js"].Collection();
        const commands = await app.modules.fs.readdirSync(`${process.cwd()}/app/cmds`).filter(file => file.endsWith('.js'));
        app.logger.info("SYS", `Loading ${commands.length} commands...`);
        await app.functions.loadCommands(commands);

        app.client
            .login(process.env.DISCORD_BOT_TOKEN)
            .then(() => app.logger.info("DISCORD", "Logged in!"))
            .catch((err) => app.logger.error("DISCORD", err));

    } catch (Ex) {
        console.log("Something terribly went wrong and now I must exit. Until next time. :(");
        console.log(Ex);
    };
})(); // hello