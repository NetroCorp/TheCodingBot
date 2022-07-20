module.exports = {
    name: "nom",
    description: "Mmm, tasty.",
    author: ["Aisuruneko"],
	options: [
        {
            name: 'user',
            description: 'The user you want to nom.',
            type: 6,
			required: true
        }
	],

	execute: (app, interaction, args) => {
		app.functions.interactions.getImg("nom")
			.then((response) => {
				const nomgedUser = interaction.guild.members.cache.get(interaction.options.get('user').value);
				let msg = `${interaction.user.username} **${app.lang.get(interaction.userInfo.preferredLanguage, "commands.nom.noms")}** ${nomgedUser.user.username}`;
				
				if (interaction.user.id === nomgedUser.user.id) msg = `**${app.lang.get(interaction.userInfo.preferredLanguage, "commands.nom.personal")}** ${interaction.user.username}`;
				
				interaction.followUp({
					embeds: [{
						title: app.lang.get(interaction.userInfo.preferredLanguage, "commands.nom.title"),
						description: `${msg}`,
						color: app.config.system.embedColors.lime,
						image: { url: response.data.url },
						footer: { text: app.config.system.footerText }
					}],
				});
			})
			.catch((response) => {
				interaction.followUp({
					embeds: [{
						title: app.lang.get(interaction.userInfo.preferredLanguage, "commands.nom.title"),
						color: app.config.system.embedColors.red,
						fields: [
							{ name: app.lang.get(interaction.userInfo.preferredLanguage, "errors.generic"), value: response.error }
						],
						footer: { text: app.config.system.footerText }
					}],
				});
			})
	}
}