module.exports = {
    name: "kick",
    description: "The boot. At your service!",
    guildOnly: true,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["KICK_MEMBERS"],
    cooldown: 5,
    aliases: ["boot"],
    syntax: [" <@MentionOrUserID> [reason]"],
    execute: async(app, message, args) => {
        function KickError(msg) {
            return app.functions.msgHandler(message, {
                embeds: [{
                    title: `${app.config.system.emotes.error} Kick Error!`,
                    color: app.config.system.embedColors.red,
                    description: msg ? msg : "Missing error data??",
                }],
                author: message.author
            }, 0, true);
        };
        if (!args[0]) return KickError("You kicked some air...");

        var userID = app.functions.getID(args[0]),
            reason = args.slice(1).join(" ");

        var user;
        await app.client.users.fetch(userID, true, true)
            .then(u => {
                user = u;
            })
            .catch(err => {
                if (err.message.includes("Unknown User")) {
                    return KickError("That was an invalid user. I even tried searching through Discord...");
                } else {
                    return KickError(`Something went wrong while fetching the user.\nError: ${err.message}`);
                };
            });

        if (user && user.id) {
            if (user.id === message.author.id) return KickError("Kicking yourself is rather pointless.");
            var guildMember = message.guild.members.cache.get(user.id);

            if (!guildMember) return KickError("That user does not exist in the server!")
            if (!guildMember.kickable) return KickError("That user is higher than me... sorry kiddo.");

            try {
                var kickReason = message.author.tag + " " + ((reason) ? reason : "provided no reason for the kick.");
                message.guild.members.kick(userID, { reason: kickReason }).then(() => {
                    var embed = {
                        title: `${app.config.system.emotes.success} Kick Success!`,
                        color: app.config.system.embedColors.lime,
                        description: `Yeet! The boot has kicked ${user.tag} out!`,
                        fields: []
                    };
                    if (reason) embed.fields.push({ name: "Reason", value: ((reason) ? reason : "Missing reason yet this is here???") });

                    return app.functions.msgHandler(message, {
                        embeds: [embed],
                        author: message.author
                    }, 0, true);
                }).catch(err => {
                    return KickError(`I failed to kick that user because: ${err.message}`);
                })
            } catch (Ex) {
                return KickError(`I failed to kick that user because: ${Ex.message}`);
            }
        }
    }
};