module.exports = {
	name: "hello",
	author: ["Aisuruneko"],
	type: 2, // 2 = USER

	execute: (app, interaction, args) => {
		if (interaction.options.get('user') == null) return;
		const targetMember = interaction.guild.members.cache.get((interaction.targetId) ? interaction.targetId : interaction.options.get('user').value);

		if (targetMember != null) return interaction.followUp({
			content: `Hello ${targetMember}! How are you doing today my friend?`
		});
		
	}
}