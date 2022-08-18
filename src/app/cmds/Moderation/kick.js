module.exports = {
	name: "kick",
	description: "Yeet!",
	author: ["Aisuruneko"],
	options: [
		{
			name: 'user',
			description: 'The user you want to kick.',
			type: 6,
			required: true
		},
		{
			name: 'reason',
			description: 'The kick reason.',
			type: 3,
			required: false
		}
	],

	execute: (app, interaction, args) => {
		if (interaction.options.get('user') == null) return;
		const targetMember = interaction.guild.members.cache.get(interaction.options.get('user').value);
		const reason = interaction.options.get('reason') ? interaction.options.get('reason').value : "No reason provided.";
		if (targetMember == null) return interaction.followUp({ embeds: [{ title: app.lang.get(interaction.userInfo.get("language"), "commands.kick.title"), color: app.config.system.embedColors.red, description: app.lang.get(interaction.userInfo.get("language"), "errors.commands.kick.invalid_target"), footer: { text: app.config.system.footerText } }] });
		
		// Prevent against own bot
		if (targetMember.user.id == app.client.user.id) return interaction.followUp({ embeds: [{ title: app.lang.get(interaction.userInfo.get("language"), "commands.kick.title"), color: app.config.system.embedColors.red, description: ":(", footer: { text: app.config.system.footerText } }] });

		// Prevent against self
		if (targetMember.user.id == interaction.user.id) return interaction.followUp({ embeds: [{ title: app.lang.get(interaction.userInfo.get("language"), "commands.kick.title"), color: app.config.system.embedColors.red, description: app.lang.get(interaction.userInfo.get("language"), "errors.commands.kick.user_is_target"), footer: { text: app.config.system.footerText } }] });

		// Get the mod log channel from database.
		let modLogChannel = interaction.serverInfo.get("modLog") ? interaction.serverInfo.logging.get("modLog") : null;

		// Kick member
		targetMember.kick(interaction.user.tag + " >> " + reason).then(() => {
			// The member has been kicked successfully.

			interaction.followUp({
				embeds: [{
					title: app.lang.get(interaction.userInfo.get("language"), "commands.kick.title"),
					color: app.config.system.embedColors.lime,
					description: app.lang.get(interaction.userInfo.get("language"), "commands.kick.complete").replace("%USERTAG%", targetMember.user.tag),
					footer: { text: app.config.system.footerText }
				}]
			});

			// Log action to their account

			// Log action to logs
			if (!modLogChannel) return;
			modLogChannel = interaction.guild.channels.cache.get(modLogChannel);
			modLogChannel.send({
				embeds: [{
					thumbnail: { url: targetMember.displayAvatarURL({ size: 1024 }) },
					title: app.lang.get(interaction.userInfo.get("language"), "commands.kick.title"),
					color: app.config.system.embedColors.lime,
					description: app.lang.get(interaction.userInfo.get("language"), "commands.kick.complete").replace("%USERTAG%", targetMember.user.tag),
					fields: [
						{ name: "User", value: targetMember.user.tag + "(" + targetMember.user.id + ")" },
						{ name: "Reason", value: reason },
						{ name: "Moderator", value: interaction.user.tag + "(" + interaction.user.id + ")" }
					],
					footer: { text: app.config.system.footerText }
				}]
			});

		}).catch(err => {
			// The member didn't get kicked.

			interaction.followUp({
				embeds: [{
					title: app.lang.get(interaction.userInfo.get("language"), "commands.kick.title"),
					color: app.config.system.embedColors.red,
					description: app.lang.get(interaction.userInfo.get("language"), "error.commands.kick.fail_generic").replace("%USERTAG%", targetMember.user.tag),
					footer: { text: app.config.system.footerText }
				}]
			});
		});
	}
}