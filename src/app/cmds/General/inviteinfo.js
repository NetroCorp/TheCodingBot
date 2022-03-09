module.exports = {
    name: "inviteinfo",
    description: "What the invite doin'?",
    guildOnly: false,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["DEFAULT"],
    cooldown: 5,
    aliases: [],
    syntax: [" <inviteURLorCode>"],
    execute: async(app, message, args) => {
        var oInvite = args[0];
        if (!oInvite) return app.functions.msgHandler(message, { content: "You need to enter an invite!" }, 0, true);
        var invite = oInvite.replace(/[\/]/g, '').replace("https:", "").replace("http:", "").replace("discord.gg", "");

        var url = ("https://discord.com/api/v9/invites/" + invite + "?with_counts=true");

        const res = await app.modules["node-fetch"](url);
        try {
            if (res.status != 200 && res.status != 404) {
                throw new Error(res.status);
            } else {
                var invite = await res.json(),
                    embed = {},
                    splashData = null;
                if (invite["message"]) embed = {
                    description: `${app.config.system.emotes.error} **${invite["message"]}**`,
                    color: app.config.system.embedColors.red
                }
                else {
                    embed = {
                        title: `${app.config.system.emotes.information} **${invite.guild.name} (${invite.guild.id})**`,
                        color: app.config.system.embedColors.blue,
                        fields: [
                            { name: "Channel", value: `#${invite.channel.name} (${invite.channel.id}) | <#${invite.channel.id}>` },
                            { name: "Members", value: "About " + invite["approximate_member_count"] },
                            { name: "Features", value: ((invite.guild.features.length > 0) ? "`" + invite.guild.features.join("`, `") + "`" : "No special features :(") },
                            { name: "Boosts", value: invite.guild["premium_subscription_count"].toString(), inline: true }
                        ]
                    };
                    if (invite.guild.description != null) embed.description = invite.guild.description;
                    if (invite.guild["vanity_url_code"]) embed.fields.push({ name: "Vanity URL", value: "https://discord.gg/" + invite.guild["vanity_url_code"], inline: true });
                    if (invite["expires_at"]) embed.fields.push({ name: "Expires in", value: app.functions.TStoHR((new Date(invite["expires_at"]).getTime()) - new Date().getTime()), inline: true }); // expires_at Time minus the current Time
                    if (invite.inviter) {
                        var user = await app.client.users.cache.get(invite.inviter.id) || await app.client.users.fetch(invite.inviter.id, true);
                        embed["author"] = { name: `Invite Created by ${user.tag} (${user.id})`, icon_url: user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) };
                    };

                    if (invite.guild.icon != null)
                        embed.thumbnail = { url: `https://cdn.discordapp.com/icons/${invite.guild.id}/${invite.guild.icon}.${app.functions.isAnimated(invite.guild.icon) ? "gif": "png"}?size=1024` };
                    if (invite.guild.splash != null)
                        splashData = `https://cdn.discordapp.com/splashes/${invite.guild.id}/${invite.guild.splash}.${app.functions.isAnimated(invite.guild.splash) ? "gif": "png"}?size=600`;
                    if (invite.guild.banner != null)
                        embed["image"] = { url: `https://cdn.discordapp.com/banners/${invite.guild.id}/${invite.guild.banner}.${app.functions.isAnimated(invite.guild.banner) ? "gif": "png"}?size=600` };
                };

                var options = { embeds: [embed] };
                if (splashData != null) {
                    const { MessageAttachment } = app.modules["discord.js"];
                    options.files = [new MessageAttachment(splashData)];
                };

                app.functions.msgHandler(message, options);
            };
        } catch (Ex) {
            app.logger.error("SYS", `Failed fetch of invite: ${oInvite} | ${Ex.message}`);
            var messageData = Ex.message || "Unknown Message";

            messages = {
                "403": "The resource is blocked.",
                "500": "Server is experiencing downtime. Please check later.",
                "502": "Server is experiencing downtime. Please check later.",
                "503": "Server is experiencing downtime. Please check later.",
                "520": "Server is experiencing downtime. Please check later."
            };
            messageData = (messages[messageData]) ? messages[message] : messageData;
            return app.functions.msgHandler(message, {
                embeds: [{
                    description: `${app.config.system.emotes.error} **${messageData}**`,
                    color: app.config.system.embedColors.red,
                }]
            });
        };

    }
};