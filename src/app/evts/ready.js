module.exports = (app) => {
    app.config["tokendata"] = undefined; // This makes it so no crazy people can find the token (tho, the only way is through eval and uh.. you should keep that to yourself..)
    // app.client.connections.success = true;
    // clearInterval(client.connections.updateTime);

    app.config.system.footerText = app.config.system.footerText.replace("APPNAME", app.name).replace("currYear", new Date().getFullYear()); // Update year

    app.logger.success("DISCORD", `Logged in as ${app.client.user.tag} | ${app.client.user.id}.`);
    // app.logger.success("DISCORD", `It took ${app.client.connections.startupTime}ms (${(app.client.connections.startupTime / 1000)} seconds)!`);


    // Finish up anything else
    app.bypassEnabled = false; // Disable bypass
    app.functions.RPSSystem(app, "init"); // Init RPSUpdater

    // Init inviteData
    const Discord = app.modules["discord.js"];
    const guildInvites = new Discord.Collection();
    app.client.guildInvites = guildInvites;

    // Broadcast we up
    app.client.uptimeTimestamp = new Date().getTime();
    var timeTook = (app.client.uptimeTimestamp - app.startTime) || 0;
    app.logger.debug("SYS", `${app.name} online as of ${new Date(app.client.uptimeTimestamp)} | It took ~${app.functions.TStoHR(timeTook)} (${timeTook}ms) to start.`);
    setTimeout(async function() {
        await app.functions.RPSSystem(app, "start"); // Start RPSUpdater
        if (app.lastMessageID != null) {
            await app.client.channels.fetch(app.lastMessageID.split("-")[0]).then(channel => {

                channel.messages.fetch(app.lastMessageID.split("-")[1]).then(msg => {
                    app.functions.msgHandler(msg, {
                        embeds: [{
                            title: `${app.config.system.emotes.success} **Restart complete**`,
                            color: app.config.system.embedColors.lime,
                            description: "Restart was successful!",
                            footer: { text: app.config.system.footerText }
                        }]
                    }, 1, true);
                }).catch(err => app.logger.debug("DISCORD", err));
            }).catch(err => app.logger.debug("DISCORD", err));
            app.lastMessageID = null;
        };

        setTimeout(async function() {

            app.logger.info("DISCORD", `Caching all invites of ${app.client.guilds.cache.size} servers...`);

            // Cache invites
            await app.client.guilds.cache.forEach(async guild => {
                if (!guild) return;
                else if (guild.partial) await guild.fetch();
                await guild.invites.fetch()
                    .then(async invites => {
                        const codeUses = new Map();
                        invites.each(inv => codeUses.set(inv.code, inv.uses));

                        app.client.guildInvites.set(guild.id, invites);

                    })
                    .catch(err => {
                        if (err.code !== Discord.Constants.APIErrors.MISSING_PERMISSIONS) {
                            app.logger.error("DISCORD", `Failed to cache invites for ${g.name} (${g.id}).`);
                        };
                    });
                if (guild.vanityURLCode) invites.set(guild.vanityURLCode, await guild.fetchVanityData());

            })

            app.logger.success("DISCORD", `Cache invite function completed.`);

        }, 3500); // Wait an addition 3.5 seconds
    }, 2000);

};