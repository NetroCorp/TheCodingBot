module.exports = {
    name: "cuddle",
    description: "Get close and show even more wholesomeness!",
    author: ["Aisuruneko"],
	options: [
        {
            name: 'user',
            description: 'The user you want to cuddle.',
            type: 6,
			required: true
        }
	],

	execute: (app, interaction, args) => {
		app.functions.interactions.getImg("cuddle")
			.then((response) => {
				const cuddlegedUser = interaction.guild.members.cache.get(interaction.options.get('user').value);
				let msg = `${interaction.user.username} **${app.lang.get(interaction.userInfo.preferredLanguage, "commands.cuddle.cuddles")}** ${cuddlegedUser.user.username}`;
				
				if (interaction.user.id === cuddlegedUser.user.id) msg = `**${app.lang.get(interaction.userInfo.preferredLanguage, "commands.cuddle.personal")}** ${interaction.user.username}`;
				
				interaction.followUp({
					embeds: [{
						title: app.lang.get(interaction.userInfo.preferredLanguage, "commands.cuddle.title"),
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
						title: app.lang.get(interaction.userInfo.preferredLanguage, "commands.cuddle.title"),
						color: app.config.system.embedColors.red,
						fields: [
							{ name: app.lang.get(interaction.userInfo.preferredLanguage, "errors.generic"), value: response.error }
						],
						footer: { text: app.config.system.footerText }
					}]
				});
			})
	}
}