module.exports = {
    name: "userinfo",
    description: "User data, need info on da user...",
    guildOnly: false,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["DEFAULT"],
    cooldown: 5,
    aliases: [],
    syntax: [" <@MentionOrUserID>"],
    execute: async(app, message, args) => {
        async function userInfo(userID) {
            var states = {
                "offline": app.config.system.emotes.discord.offline + " **Offline**",
                "idle": app.config.system.emotes.discord.idle + " **Idle**",
                "dnd": app.config.system.emotes.discord.dnd + " **Do Not Disturb**",
                "online": app.config.system.emotes.discord.online + " **Online**"
            };

            function getJoinPosition(ID) {
                var memberJoins = message.guild.members.cache.map(member => member).sort((a, b) => a.joinedAt - b.joinedAt);
                for (var i = 0; i < memberJoins.length; i++) { if (memberJoins[i].id == ID) return i; };
            };

            try {
                var user = await app.client.api.users(userID).get();
                if (!user)
                    throw new Error("That user does not exist.");
                user.tag = `${user.username}#${user.discriminator}`; // Manually add this so it looks cool

                var embed = {
                    thumbnail: { url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${app.functions.isAnimated(user.avatar) ? "gif": "png"}?size=1024` },
                    title: `${app.config.system.emotes.information} **${user.tag} ${(user.bot ? "*[BOT]*" : "")}**`,
                    color: (user["accent_color"]) ? user["accent_color"] : app.config.system.embedColors.blue,
                    fields: [
                        { name: "Username", value: user.username, inline: true },
                        { name: "Discriminator", value: user.discriminator, inline: true },
                        { name: "Full Tag", value: user.tag, inline: true },
                        { name: "User ID", value: user.id, inline: false },
                    ]
                };

                if (user.banner != null)
                    embed["image"] = { url: `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${app.functions.isAnimated(user.banner) ? "gif": "png"}?size=600` };

                if (message.guild) {
                    var serverUser = await message.guild.members.cache.get(userID) || await message.guild.members.fetch(userID, true);
                    embed.fields.push({ name: '\u200b', value: '\u200b', inline: false });
                    if (serverUser.roles) {
                        var roles = serverUser.roles.cache.map(role => role).filter(role => role.id != message.guild.id).sort((a, b) => a.comparePositionTo(b)).map(role => role);
                        embed.fields.push({ name: `Roles (**${roles.length}**)`, value: roles.length > 0 ? roles.join(" ") : "No roles :(", inline: true })
                    };
                    if (serverUser.presence) embed.description = states[serverUser.presence.status];
                    if (serverUser.nickname) {
                        embed.fields.push({ name: `Nickname`, value: serverUser.nickname, inline: true });
                        embed.fields.push({ name: '\u200b', value: '\u200b', inline: true });
                    };
                    embed.fields.push({ name: "Join Position", value: (getJoinPosition(userID) + 1).toString(), inline: true }, { name: "Joined", value: (app.functions.TStoHR(new Date().getTime() - new Date(serverUser.joinedTimestamp).getTime()) + " ago"), inline: true })
                };

                app.functions.msgHandler(message, { embeds: [embed] })
            } catch (Ex) {
                return app.functions.msgHandler(message, {
                    embeds: [{
                        description: `${app.config.system.emotes.error} **${Ex.message}**`,
                        color: app.config.system.embedColors.red,
                    }]
                });
            };
        };
        if (!args[0]) return userInfo(message.author.id);
        else return userInfo(app.functions.getID(args[0]));

    }
};