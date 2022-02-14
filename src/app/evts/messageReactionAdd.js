module.exports = async(app, reaction, user) => {
    if (!reaction || !user) return; // Just making sure.
    if (user.bot) return; // No bots >:(

    var message = reaction.message;
    if (!message) return; // hmm, no message?
    var guild = message.guild,
        channel = message.channel;
    if (!guild) return; // Must be in a server :)

    var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: message.guild.id } });
    if (!serverSettings) return;

    if (serverSettings["reactionRoles"] != null) {
        var reactionRolesSettings = JSON.parse(serverSettings["reactionRoles"]);

        for (var dbChannel in reactionRolesSettings) {
            if (channel.id === dbChannel) {
                var settings = reactionRolesSettings[dbChannel];
                if (message.id === settings["message"]) {
                    var reactionThing = reaction.emoji.name || reaction.emoji.id;
                    reactionRoles = settings["reactionRoles"];

                    for (var i = 0; i < reactionRoles.length; i++) {
                        try {
                            var data = reactionRoles[i];
                            if (data["emoji"] === reactionThing) {
                                const member = guild.members.cache.get(user.id),
                                    role = guild.roles.cache.get(data["roleID"]);
                                member.roles.add(role).catch(err => {});
                            };
                        } catch (Ex) {
                            app.logger.error("SYS", `Unable to give user ${user.id} the role ${data["roleID"]}...`)
                        };
                        return;
                    };
                };
            };

        };
    };
};