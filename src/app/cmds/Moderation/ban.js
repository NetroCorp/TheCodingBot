module.exports = {
    name: "ban",
    description: "Ban those pesky members!",
    guildOnly: true,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["BAN_MEMBERS"],
    cooldown: 5,
    aliases: ["banhammer"],
    syntax: [" <@MentionOrUserID> [reason]"],
    execute: async(app, message, args) => {
        function BanError(msg) {
            return app.functions.msgHandler(message, {
                embeds: [{
                    title: `${app.config.system.emotes.error} Ban Error!`,
                    color: app.config.system.embedColors.red,
                    description: msg ? msg : "Missing error data??",
                }],
                author: message.author
            }, 0, true);
        };
        if (!args[0]) return BanError("Well, you can't really ban air, can you...");

        var userID = app.functions.getID(args[0]),
            reason = args.slice(1).join(" ");

        var user;
        await app.client.users.fetch(userID, true, true)
            .then(u => {
                user = u;
            })
            .catch(err => {
                if (err.message.includes("Unknown User")) {
                    return BanError("That was an invalid user. I even tried searching through Discord...");
                } else {
                    return BanError(`Something went wrong while fetching the user.\nError: ${err.message}`);
                };
            });

        if (user.id) {
            if (user.id === message.author.id) return BanError("Banning yourself is rather pointless.");
            var guildMember = message.guild.members.cache.get(user.id),
                forced = false;


            var getBan = async(userID) => await message.guild.bans.fetch(userID, true, true).then(b => { return true; }).catch(() => { return false; });


            if (!guildMember)
                forced = true;
            else {
                if (!guildMember.bannable) return BanError("That user is higher than me... sorry kiddo.");
                forced = false;
            };

            try {
                if (await getBan(userID)) return BanError("That user is already banned!");
                var banReason = app.functions.pomeloHandler(message.author) + " " + ((reason) ? reason : "provided no reason for the ban.");
                message.guild.members.ban(userID, { reason: banReason }).then(() => {
                    var embed = {
                        title: `${app.config.system.emotes.success} ${(forced) ? "Force-" : ""}Ban Success!`,
                        color: app.config.system.embedColors.lime,
                        description: `You know the rules and so do I, so say goodbye to ${app.functions.pomeloHandler(user)}!`,
                        fields: []
                    };
                    if (reason) embed.fields.push({ name: "Reason", value: ((reason) ? reason : "Missing reason yet this is here???") });

                    return app.functions.msgHandler(message, {
                        embeds: [embed],
                        author: message.author
                    }, 0, true);
                }).catch(err => {
                    return BanError(`I failed to ban that user because: ${err.message}`);
                })
            } catch (Ex) {
                return BanError(`I failed to ban that user because: ${Ex.message}`);
            }
        }
    }
};