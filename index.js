/*
	TheCodingBot v6
	https://tcb.nekos.tech
*/

// Version 6 of TheCodingBot
// Can you believe we've come this far?

const log = (msg) => { console.log(`[${new Date().getTime()}] ${msg}`) };

// -- Requirements to even start.
try {
    const { ShardingManager } = require("discord.js");
    log("Discord package found.");

    require('dotenv').config();
    log("Environment Variables loaded.");

    log("Creating Shard Manager...");
    const manager = new ShardingManager("./src/bot.js", {
        execArgv: ['--trace-warnings'], // Find those warnings!
        totalShards: "auto", // Automatically determine
        token: process.env.DISCORD_BOT_TOKEN, // Bot token
        delay: 4200 // Give a delay, kinda like a big network starting up their servers lol.
    });

    manager.on("shardCreate", async(shard) => {
        log(`Shard [${shard.id}]: Created!`);

        shard.on('reconnecting', () => {
            log(`Shard [${shard.id}]: Reconnecting...`);
        });
        shard.on('spawn', () => {
            log(`Shard [${shard.id}]: Spawned!`);
        });
        shard.on('ready', () => {
            log(`Shard [${shard.id}]: Ready!`);
        });
        shard.on('death', () => {
            log(`Shard [${shard.id}]: I am dead!`);
        });
        shard.on('error', (err) => {
            log(`Shard [${shard.id}]: Error!\n\t${err} `)
            shard.respawn()
        });
    });

    log("Spawning shards...");
    manager.spawn();

} catch (Ex) {
    if (Ex.message.includes("Cannot find module")) {
        if (Ex.message.includes("discord.js")) console.error("Could not load discord.js package. It's probably not installed.");
        else console.error("Could not load required item. It's probably missing, or invaild.");
    };

    console.log(Ex);
    process.exit(-1);
};