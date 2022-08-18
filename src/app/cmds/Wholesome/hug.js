module.exports = {
	name: "hug",
	description: "Hug someone and show wholesomeness!",
	author: ["Aisuruneko"],
	aliases: [],
	syntax: [],
	permissions: [ "DEFAULT" ],
	cooldown: 2,
	guildOnly: false,
	hidden: false,
	options: [
		{
			name: 'user',
			description: 'The user you want to hug.',
			type: 6,
			required: true
		}
	],

	execute: (app, interaction, args) => {
		app.functions.interactions.getImg("hug")
			.then((response) => {
				const huggedUser = interaction.guild.members.cache.get(interaction.options.get('user').value);
				let msg = `${interaction.user.username} **${app.lang.get(interaction.userInfo.get("language"), "commands.hug.hugs")}** ${huggedUser.user.username}`;
				
				if (interaction.user.id === huggedUser.user.id) msg = `**${app.lang.get(interaction.userInfo.get("language"), "commands.hug.personal")}** ${interaction.user.username}`;
				
				interaction.followUp({
					embeds: [{
						title: app.lang.get(interaction.userInfo.get("language"), "commands.hug.title"),
						description: `${msg}`,
						color: app.config.system.embedColors.lime,
						image: { url: response.data.url },
						footer: { text: app.config.system.footerText }
					}]
				});
			})
			.catch((response) => {
				interaction.followUp({
					embeds: [{
						title: app.lang.get(interaction.userInfo.get("language"), "commands.hug.title"),
						color: app.config.system.embedColors.red,
						fields: [
							{ name: app.lang.get(interaction.userInfo.get("language"), "errors.generic"), value: response.error }
						],
						footer: { text: app.config.system.footerText }
					}]
				});
			})
	}
}