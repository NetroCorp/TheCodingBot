module.exports = {
    name: "ban",
    description: "Yeet but forever!",
    author: ["Aisuruneko"],
    aliases: [],
    syntax: ["user", "reason"],
    permissions: ["BAN_MEMBERS"],
    cooldown: 2,
    guildOnly: true,
    hidden: false,
    options: [{
            name: 'user',
            description: 'The user you want to ban.',
            type: 6,
            required: true
        },
        {
            name: 'reason',
            description: 'The reason for ban.',
            type: 3,
            required: false
        }
    ],
    execute: async(app, interaction, args) => {
        if (interaction.options.get('user') == null) return;
        var forced = false,
            failedDM = false;

        const guild = interaction.guild;
        const targetMember = guild.members.cache.get(interaction.options.get('user').value) || await app.client.users.fetch(interaction.options.get('user').value, true);
        if (targetMember.user == null) {
            forced = true;
            targetMember.user = targetMember;
        };

        const reason = interaction.options.get('reason') ? interaction.options.get('reason').value : "No reason provided.";
        if (targetMember == null) return interaction.followUp({ embeds: [{ title: app.lang.get(interaction.userInfo.get("language"), "commands.ban.title"), color: app.config.system.embedColors.red, description: app.lang.get(interaction.userInfo.get("language"), "errors.commands.ban.invalid_target"), footer: { text: app.config.system.footerText } }] });

        // Prevent against own bot
        if (targetMember.user.id == app.client.user.id) return interaction.followUp({ embeds: [{ title: app.lang.get(interaction.userInfo.get("language"), "commands.ban.title"), color: app.config.system.embedColors.red, description: ":(", footer: { text: app.config.system.footerText } }] });

        // Prevent against self
        if (targetMember.user.id == interaction.user.id) return interaction.followUp({ embeds: [{ title: app.lang.get(interaction.userInfo.get("language"), "commands.ban.title"), color: app.config.system.embedColors.red, description: app.lang.get(interaction.userInfo.get("language"), "errors.commands.ban.user_is_target"), footer: { text: app.config.system.footerText } }] });

        // Get the mod log channel from database.
        let modLogChannel = interaction.serverInfo.get("modLog") ? interaction.serverInfo.logging.get("modLog") : null;

        if (targetMember.bannable) {
            if (targetMember.roles.highest.position > interaction.member.roles.highest.position) {
                return interaction.followUp({ embeds: [{ title: app.lang.get(interaction.userInfo.get("language"), "commands.ban.title"), color: app.config.system.embedColors.red, description: app.lang.get(interaction.userInfo.get("language"), "errors.commands.ban.target_is_higher"), footer: { text: app.config.system.footerText } }] });
            };

            targetMember.userInfo = await app.DBs[app.name].userSettings.findOne({ where: { userID: targetMember.user.id } });
            const targetMemberLang = (targetMember.userInfo) ? targetMember.userInfo.get("language") : app.config.system.defaultLanguage;
            await targetMember.user.send({
                content: "app.lang.get(targetMemberLang, "commands.ban.user_complete").replace("%SERVERNAME%", guild.name),
                embeds: [{
                    thumbnail: { url: guild.iconURL({ size: 1024 }) },
                    // title: app.lang.get(interaction.userInfo.get("language"), "commands.ban.title"),
                    color: app.config.system.embedColors.lime,
                    // description: app.lang.get(interaction.userInfo.get("language"), "commands.ban.user_complete").replace("%SERVERNAME%", guild.name),
                    fields: [
                        { name: "Reason", value: reason },
                        { name: "Case", value: "Coming soon." }
                    ],
                    footer: { text: app.config.system.footerText }
                }]
            }).catch(err => { failedDM = true; });
        } else {
            return interaction.followUp({ embeds: [{ title: app.lang.get(interaction.userInfo.get("language"), "commands.ban.title"), color: app.config.system.embedColors.red, description: app.lang.get(interaction.userInfo.get("language"), "errors.commands.ban.target_is_higher_bot"), footer: { text: app.config.system.footerText } }] });
        };

        // Ban member
        const bannedMember = async() => {
            // The member has been banned successfully.
            interaction.followUp({
                embeds: [{
                    title: app.lang.get(interaction.userInfo.get("language"), "commands.ban.title"),
                    color: app.config.system.embedColors.lime,
                    description: "app.lang.get(interaction.userInfo.get("language"), "commands.ban.complete").replace("%USERTAG%", targetMember.user.tag) + "\n" + ((failedDM) ? app.lang.get(interaction.userInfo.get("language"), "errors.commands.ban.failed_dm") : ""),
                    footer: { text: app.config.system.footerText }
                }]
            });

            // Log action to logs
            if (modLogChannel) {
                modLogChannel = guild.channels.cache.get(modLogChannel);
                if (modLogChannel) modLogChannel.send({
                    embeds: [{
                        thumbnail: { url: targetMember.displayAvatarURL({ size: 1024 }) },
                        title: app.lang.get(interaction.userInfo.get("language"), "commands.ban.title"),
                        color: app.config.system.embedColors.lime,
                        description: app.lang.get(interaction.userInfo.get("language"), "commands.ban.complete").replace("%USERTAG%", targetMember.user.tag),
                        fields: [
                            { name: "User", value: targetMember.user.tag + " (" + targetMember.user.id + ")" },
                            { name: "Reason", value: reason },
                            { name: "Moderator", value: interaction.user.tag + " (" + interaction.user.id + ")" },
                            { name: "Case", value: "Coming soon." }
                        ],
                        footer: { text: app.config.system.footerText }
                    }]
                });
            };

            // Log action to their account
            // PLACEHOLDER
        };
        const errorBanning = async(err) => {
            // The member didn't get banned.
            interaction.followUp({
                embeds: [{
                    title: app.lang.get(interaction.userInfo.get("language"), "commands.ban.title"),
                    color: app.config.system.embedColors.red,
                    description: app.lang.get(interaction.userInfo.get("language"), "error.commands.ban.fail_generic").replace("%USERTAG%", targetMember.user.tag).replace("%ERRMSG%", err.message),
                    footer: { text: app.config.system.footerText }
                }]
            });
            console.log(err);
        };

        if (!forced) targetMember.ban({ reason: interaction.user.tag + " >> " + reason }).then(bannedMember).catch(err => errorBanning(err));
        else guild.bans.create(targetMember.id, { reason: interaction.user.tag + " >> " + reason }).then(bannedMember).catch(err => errorBanning(err));
    }
}