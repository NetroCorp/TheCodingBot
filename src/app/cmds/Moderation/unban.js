module.exports = {
    name: "unban",
    description: "They did the crime, they did the time.",
    guildOnly: true,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["BAN_MEMBERS"],
    cooldown: 5,
    aliases: ["unbanhammer"],
    syntax: [" <@MentionOrUserID> [reason]"],
    execute: async(app, message, args) => {
        function UnbanError(msg) {
            return app.functions.msgHandler(message, {
                embeds: [{
                    title: `${app.config.system.emotes.error} Unban Error!`,
                    color: app.config.system.embedColors.red,
                    description: msg ? msg : "Missing error data??",
                }],
                author: message.author
            }, 0, true);
        };
        if (!args[0]) return UnbanError("The air isn't banned...?");

        var userID = app.functions.getID(args[0]),
            reason = args.slice(1).join(" ");

        var user;
        await app.client.users.fetch(userID, true, true)
            .then(u => {
                user = u;
            })
            .catch(err => {
                if (err.message.includes("Unknown User")) {
                    return UnbanError("That was an invalid user. I even tried searching through Discord...");
                } else {
                    return UnbanError(`Something went wrong while fetching the user.\nError: ${err.message}`);
                };
            });

        if (user.id) {
            if (user.id === message.author.id) return UnbanError("...you wouldn't be running this command if you were banned.");
            var guildMember = message.guild.members.cache.get(user.id);

            var getBan = async(userID) => await message.guild.bans.fetch(userID, true, true).then(b => { return true; }).catch(() => { return false; });

            if (guildMember || !await getBan(userID)) return UnbanError("That user is not banned!");

            try {
                var unbanReason = message.author.tag + " " + ((reason) ? reason : "provided no reason for the unban.");
                message.guild.members.unban(userID, unbanReason).then(() => {
                    var embed = {
                        title: `${app.config.system.emotes.success} Unban Success!`,
                        color: app.config.system.embedColors.lime,
                        description: `Unhammered the user, ${user.tag}!`,
                        fields: []
                    };
                    if (reason) embed.fields.push({ name: "Reason", value: ((reason) ? reason : "Missing reason yet this is here???") });

                    return app.functions.msgHandler(message, {
                        embeds: [embed],
                        author: message.author
                    }, 0, true);
                }).catch(err => {
                    return UnbanError(`I failed to unban that user because: ${err.message}`);
                })
            } catch (Ex) {
                return UnbanError(`I failed to unban that user because: ${Ex.message}`);
            }
        }
    }
};