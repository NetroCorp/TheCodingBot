module.exports = {
    name: "serverinfo",
    description: "Extra! Extra! Info on the server!",
    guildOnly: true,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["DEFAULT"],
    cooldown: 5,
    aliases: [],
    syntax: [],
    execute: async(app, message, args) => {
        try {
            var guild = message.guild,
                splashData = null;

            guild.acronym = guild.name.match(/\b(\w)/g).join(""); // Cool thing

            var members = {
                "total": guild.members.cache.size
            };
            members["users"] = guild.members.cache.filter(member => !member.user.bot).size;
            members["bots"] = members.total - members.users;


            var embed = {
                title: `${app.config.system.emotes.information} **${guild.name}**`,
                color: app.config.system.embedColors.blue,
                fields: [
                    { name: "ID", value: guild.id, inline: true },
                    { name: "Acronym", value: guild.acronym, inline: true },
                    { name: "Boosts", value: guild.premiumSubscriptionCount.toString() || "N/A", inline: true },
                    { name: "Preferred Locale", value: guild.preferredLocale, inline: true },
                    { name: "Owner", value: `<@${guild.ownerId}> (${guild.ownerId})`, inline: true },
                    { name: "Features", value: ((guild.features.length > 0) ? "`" + guild.features.join("`, `") + "`" : "No special features :(") },

                    { name: "Channels", value: guild.channels.cache.size.toString() || "N/A", inline: true },
                    { name: "Roles", value: guild.roles.cache.size.toString() || "N/A", inline: true },
                    { name: "Bans", value: guild.bans.cache.size.toString() || "N/A", inline: true },

                    { name: "Invites", value: guild.invites.cache.size.toString() || "N/A", inline: true },
                    { name: "Emojis", value: guild.emojis.cache.size.toString() || "N/A", inline: true },
                    { name: "Stickers", value: guild.stickers.cache.size.toString() || "N/A", inline: true },

                    { name: "Total Members", value: members.total.toString() || "N/A", inline: true },
                    { name: "Users", value: members.users.toString() || "N/A", inline: true },
                    { name: "Bots", value: members.bots.toString() || "N/A", inline: true }
                ]
            };

            if (guild.description != null) embed.description = guild.description;
            if (guild.vanityURLCode) embed.fields.push({ name: "Vanity URL", value: "https://discord.gg/" + guild["vanityURLCode"], inline: true }, { name: "Vanity Uses", value: (guild.vanityURLUses != null) ? guild.vanityURLUses.toString() : "None", inline: true });

            embed.fields.push({ "name": "Server Created", "value": new Date(guild.createdTimestamp).toString() || "N/A" }, { "name": `${app.name} Joined`, "value": new Date(guild.joinedTimestamp).toString() || "N/A" });

            if (guild.icon != null)
                embed.thumbnail = { url: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${app.functions.isAnimated(guild.icon) ? "gif": "png"}?size=1024` };
            if (guild.splash != null)
                splashData = `https://cdn.discordapp.com/splashes/${guild.id}/${guild.splash}.${app.functions.isAnimated(guild.splash) ? "gif": "png"}?size=600`;
            if (guild.banner != null)
                embed["image"] = { url: `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.${app.functions.isAnimated(guild.banner) ? "gif": "png"}?size=512` };

            var options = { embeds: [embed] };
            if (splashData != null) {
                const { MessageAttachment } = app.modules["discord.js"];
                options.files = [new MessageAttachment(splashData)];
            };

            app.functions.msgHandler(message, options);

        } catch (Ex) {
            console.log(Ex);	
            return app.functions.msgHandler(message, {
                embeds: [{
                    description: `${app.config.system.emotes.error} **${Ex.message}**`,
                    color: app.config.system.embedColors.red,
                }]
            });
        };
    }
};