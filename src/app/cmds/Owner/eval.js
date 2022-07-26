module.exports = {
    name: "eval",
    description: "Run that code!",
    author: ["Aisuruneko"],
	aliases: [],
	syntax: [],
	permissions: [ "BOT_OWNER" ],
	cooldown: 2,
	guildOnly: false,
	hidden: false,
	options: [
        {
            name: 'code',
            description: 'The code you want to execute.',
            type: 3,
			required: true
        }
	],

	execute: (app, interaction, args) => {
		let theCode = interaction.options.getString("code");
		try {
			const { inspect } = require("util");
			let evaluated = inspect(eval(theCode, { depth: 0 }));
			if (evaluated !== "Promise { <pending> }") {
				interaction.followUp({
					embeds: [{
						title: app.lang.get(interaction.userInfo.get("language"), "commands.eval.title"),
						color: app.config.system.embedColors.red,
						fields: [
							{ name: app.lang.get(interaction.userInfo.get("language"), "commands.eval.result"), value: "```js\n" + ((evaluated == "") ? "" : evaluated) + "```" }
						],
						footer: { text: app.config.system.footerText }
					}]
				});
			} else interaction.followUp("** **");
		} catch (Ex) {
			interaction.followUp({
				embeds: [{
					title: app.lang.get(interaction.userInfo.get("language"), "commands.eval.title"),
					color: app.config.system.embedColors.red,
					fields: [
						{ name: app.lang.get(interaction.userInfo.get("language"), "errors.generic"), value: "```js\n" + Ex.stack + "```" }
					],
					footer: { text: app.config.system.footerText }
				}]
			});
		};
	}
}