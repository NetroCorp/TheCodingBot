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
        if (app.lastMessageID != null) {
            await app.client.channels.fetch(app.lastMessageID.split("-")[0]).then(channel => {

                channel.messages.fetch(app.lastMessageID.split("-")[1]).then(msg => {
                    app.functions.msgHandler(msg, {
                        embeds: [{
                            title: `${app.config.system.emotes.success} **Restart complete**`,
                            color: app.config.system.embedColors.lime,
                            description: "Restart was successful!"
                        }]
                    }, 1, true);
                }).catch(err => app.logger.debug("DISCORD", err));
            }).catch(err => app.logger.debug("DISCORD", err));
            app.lastMessageID = null;
        };

        await app.functions.RPSSystem(app, "start"); // Start RPSUpdater

        setTimeout(async function() {
            // Reaction Roles
            app.logger.info("DISCORD", `Initializing Reaction Roles...`);
            var serverSettings = await app.DBs.serverSettings.findAll({ where: {}, raw: true }); // WARNING: Do not expose this variable.
            for (server in serverSettings) {
                server = serverSettings[server];
                if (server["reactionRoles"] != null) {
                    var reactionRolesSettings = JSON.parse(server["reactionRoles"]);

                    for (var channelID in reactionRolesSettings) {
                        channel = app.client.channels.cache.get(channelID) || client.channels.fetch(channelID, true, true) || null;
                        if (!channel) {
                            app.logger.warn("DISCORD", `Channel ${channel} cannot be resolved! Removing from database...`);
                            delete reactionRolesSettings[channelID];
                            try { await app.DBs.serverSettings.update({ reactionRoles: JSON.stringify(reactionRolesSettings, null, "\t") }, { where: { serverID: guild.id } }); } catch (Ex) {};
                            return;
                        };
                        var messageID = reactionRolesSettings[channel.id]["message"],
                            reactionRoles = reactionRolesSettings[channel.id]["reactionRoles"];

                        message = channel.messages.cache.get(messageID) || channel.messages.fetch(messageID, true, true) || null;
                        if (!message) {
                            app.logger.warn("DISCORD", `Message ${message} in ${channel} cannot be resolved! Removing from database...`);
                            delete reactionRolesSettings[channelID][messageID];
                            try { await app.DBs.serverSettings.update({ reactionRoles: JSON.stringify(reactionRolesSettings, null, "\t") }, { where: { serverID: guild.id } }); } catch (Ex) {};
                            return;
                        };

                        app.logger.debug("DISCORD", `Loaded reaction roles for ${channel.guild.id}/${channelID}-${messageID}!`);
                    };
                };
            };
            app.logger.success("DISCORD", `Initialized Reaction Roles!`);

            // Cache invites
            app.logger.info("DISCORD", `Caching all invites of ${app.client.guilds.cache.size} servers...`);
            var inviteCount = 0;
            await app.client.guilds.cache.forEach(async guild => {
                if (!guild) return;
                else if (guild.partial) await guild.fetch();
                if (guild.vanityURLCode) invites.set(guild.vanityURLCode, await guild.fetchVanityData());

                await guild.invites.fetch()
                    .then(async invites => {
                        const codeUses = new Map();
                        invites.each(inv => codeUses.set(inv.code, inv.uses));

                        app.client.guildInvites.set(guild.id, invites);
                        app.logger.debug("DISCORD", `Cached ${invites.size} invites from ${guild.id}.`);
                        inviteCount += invites.size;
                    })
                    .catch(err => {
                        if (err.code !== Discord.Constants.APIErrors.MISSING_PERMISSIONS) {
                            app.logger.error("DISCORD", `Failed to cache invites for ${guild.name} (${guild.id}).`);
                        };
                    });

            });
            setTimeout(async function() { app.logger.success("DISCORD", `Cached ${inviteCount} invites from ${app.client.guildInvites.size} servers.`); }, 200 * (app.client.guilds.cache.size / 2));

        }, 2500); // Wait an addition 2.5 seconds
    }, 2000);

};