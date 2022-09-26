module.exports = {
    name: "kick",
    description: "Yeet!",
    author: ["Aisuruneko"],
    aliases: [],
    syntax: ["user", "reason"],
    permissions: ["KICK_MEMBERS"],
    cooldown: 2,
    guildOnly: true,
    hidden: false,
    options: [{
            name: 'user',
            description: 'The user you want to kick.',
            type: 6,
            required: true
        },
        {
            name: 'reason',
            description: 'The reason for kick.',
            type: 3,
            required: false
        }
    ],
    execute: async(app, interaction, args) => {
        if (interaction.options.get('user') == null) return;
        var failedDM = false;

        const guild = interaction.guild;
        const targetMember = guild.members.cache.get(interaction.options.get('user').value);
        const reason = interaction.options.get('reason') ? interaction.options.get('reason').value : "No reason provided.";
        if (targetMember == null) return interaction.followUp({ embeds: [{ title: app.lang.get(interaction.userInfo.get("language"), "commands.kick.title"), color: app.config.system.embedColors.red, description: app.lang.get(interaction.userInfo.get("language"), "errors.commands.kick.invalid_target"), footer: { text: app.config.system.footerText } }] });

        // Prevent against own bot
        if (targetMember.user.id == app.client.user.id) return interaction.followUp({ embeds: [{ title: app.lang.get(interaction.userInfo.get("language"), "commands.kick.title"), color: app.config.system.embedColors.red, description: ":(", footer: { text: app.config.system.footerText } }] });

        // Prevent against self
        if (targetMember.user.id == interaction.user.id) return interaction.followUp({ embeds: [{ title: app.lang.get(interaction.userInfo.get("language"), "commands.kick.title"), color: app.config.system.embedColors.red, description: app.lang.get(interaction.userInfo.get("language"), "errors.commands.kick.user_is_target"), footer: { text: app.config.system.footerText } }] });

        // Get the mod log channel from database.
        let modLogChannel = interaction.serverInfo.get("modLog") ? interaction.serverInfo.logging.get("modLog") : null;

        if (targetMember.kickable) {
            if (targetMember.roles.highest.position > interaction.member.roles.highest.position) {
                return interaction.followUp({ embeds: [{ title: app.lang.get(interaction.userInfo.get("language"), "commands.kick.title"), color: app.config.system.embedColors.red, description: app.lang.get(interaction.userInfo.get("language"), "errors.commands.kick.target_is_higher"), footer: { text: app.config.system.footerText } }] });
            };

            targetMember.userInfo = await app.DBs[app.name].userSettings.findOne({ where: { userID: targetMember.user.id } });
            const targetMemberLang = (targetMember.userInfo) ? targetMember.userInfo.get("language") : app.config.system.defaultLanguage;
            await targetMember.user.send({
                content: app.lang.get(targetMemberLang, "commands.kick.user_complete").replace("%SERVERNAME%", guild.name),
                embeds: [{
                    thumbnail: { url: guild.iconURL({ size: 1024 }) },
                    // title: app.lang.get(interaction.userInfo.get("language"), "commands.kick.title"),
                    color: app.config.system.embedColors.lime,
                    // description: app.lang.get(interaction.userInfo.get("language"), "commands.kick.user_complete").replace("%SERVERNAME%", guild.name),
                    fields: [
                        { name: "Reason", value: reason },
                        { name: "Case", value: "Coming soon." }
                    ],
                    footer: { text: app.config.system.footerText }
                }]
            }).catch(err => { failedDM = true; });
        } else {
            return interaction.followUp({ embeds: [{ title: app.lang.get(interaction.userInfo.get("language"), "commands.kick.title"), color: app.config.system.embedColors.red, description: app.lang.get(interaction.userInfo.get("language"), "errors.commands.kick.target_is_higher_bot"), footer: { text: app.config.system.footerText } }] });
        };

        // Kick member
        targetMember.kick(interaction.user.tag + " >> " + reason).then(() => {

            // The member has been kicked successfully.
            interaction.followUp({
                embeds: [{
                    title: app.lang.get(interaction.userInfo.get("language"), "commands.kick.title"),
                    color: app.config.system.embedColors.lime,
                    description: app.lang.get(interaction.userInfo.get("language"), "commands.kick.complete").replace("%USERTAG%", targetMember.user.tag) + "\n" + ((failedDM) ? app.lang.get(interaction.userInfo.get("language"), "error.commands.kick.failed_dm") : ""),
                    footer: { text: app.config.system.footerText }
                }]
            });

            // Log action to logs
            if (modLogChannel) {
                modLogChannel = guild.channels.cache.get(modLogChannel);
                if (modLogChannel) modLogChannel.send({
                    embeds: [{
                        thumbnail: { url: targetMember.displayAvatarURL({ size: 1024 }) },
                        title: app.lang.get(interaction.userInfo.get("language"), "commands.kick.title"),
                        color: app.config.system.embedColors.lime,
                        description: app.lang.get(interaction.userInfo.get("language"), "commands.kick.complete").replace("%USERTAG%", targetMember.user.tag),
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
        }).catch(err => {

            // The member didn't get kicked.
            interaction.followUp({
                embeds: [{
                    title: app.lang.get(interaction.userInfo.get("language"), "commands.kick.title"),
                    color: app.config.system.embedColors.red,
                    description: app.lang.get(interaction.userInfo.get("language"), "error.commands.kick.fail_generic").replace("%USERTAG%", targetMember.user.tag).replace("%ERRMSG%", err.message),
                    footer: { text: app.config.system.footerText }
                }]
            });
        });
    }
}