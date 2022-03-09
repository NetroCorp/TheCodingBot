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
    app.client.guildInvites = new Map();;

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
                var serverID = server["serverID"];
                if (server["reactionRoles"] != null) {
                    var reactionRolesSettings = JSON.parse(server["reactionRoles"]);

                    for (var channelID in reactionRolesSettings) {
                        var guild = app.client.guilds.cache.get(serverID) || null;
                        if (!guild || !guild.id) continue;

                        channel = app.client.channels.cache.get(channelID) || null;
                        if (!channel || !channel.id) {
                            app.logger.warn("DISCORD", `Channel ${channelID} cannot be resolved! Removing from database...`);
                            delete reactionRolesSettings[channelID];
                            try { await app.DBs.serverSettings.update({ reactionRoles: JSON.stringify(reactionRolesSettings, null, "\t") }, { where: { serverID: serverID } }); } catch (Ex) {};
                            continue;
                        };
                        var messageID = reactionRolesSettings[channelID]["message"],
                            reactionRoles = reactionRolesSettings[channelID]["reactionRoles"];

                        message = channel.messages.cache.get(messageID) || channel.messages.fetch(messageID, true, true) || null;
                        if (!message) {
                            app.logger.warn("DISCORD", `Message ${message} in ${channelID} cannot be resolved! Removing from database...`);
                            delete reactionRolesSettings[channelID][messageID];
                            try { await app.DBs.serverSettings.update({ reactionRoles: JSON.stringify(reactionRolesSettings, null, "\t") }, { where: { serverID: serverID } }); } catch (Ex) {};
                            continue;
                        };
                        app.logger.debug("DISCORD", `Loaded reaction roles for ${serverID}/${channelID}-${messageID}!`);
                    };
                };
            };
            app.logger.success("DISCORD", `Initialized Reaction Roles!`);

            // Cache invites
            app.logger.info("DISCORD", `Caching all invites of ${app.client.guilds.cache.size} servers...`);
            var inviteCount = 0;
            await app.client.guilds.cache.forEach(async guild => {
                try {
                    if (!guild) return;
                    if (guild.partial) await guild.fetch().catch(err => app.logger.error("DISCORD", "Something went wrong while fetching the guild " + guild.id + " | " + err.message));

                    const firstInvites = await guild.invites.fetch();
                    app.client.guildInvites.set(guild.id, new Map(firstInvites.map((invite) => [invite.code, invite.uses])));
                    app.logger.debug("DISCORD", `Cached ${firstInvites.size} invites from ${guild.id}.`);
                    inviteCount += firstInvites.size;
                } catch (err) {
                    if (err.code !== app.modules["discord.js"].Constants.APIErrors.MISSING_PERMISSIONS) {
                        app.logger.error("DISCORD", `Failed to cache invites for ${guild.name} (${guild.id}) | ${err.message}.`);
                    };
                    return;
                };
            });
            setTimeout(async function() { app.logger.success("DISCORD", `Cached ${inviteCount} invites from ${app.client.guildInvites.size} servers.`); }, (app.client.guilds.cache.size / 2) * 100);

        }, 3500); // Wait an addition 3.5 seconds
    }, 2000);

};