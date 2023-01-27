//
// TheCodingBot
// Netro Corporation
//
// https://codingbot.gg

class command {
	constructor() {
	}

	meta = () => {
		return {
			name: "cuddle",
			description: "Cuddle someone!",
			author: "Aisuruneko",
			version: "1.0.0",

			supportsPrefix: true,
			supportsSlash: true,

			options: [
				{
					name: "user",
					description: "The user you wish to cuddle",
					type: 6,
					required: true
				}
			],
			permissions: {
				DEFAULT_MEMBER_PERMISSIONS: ["SendMessages"]
			}
		};
	}

	slashRun = async(app, interaction) => {
		await interaction.reply(await this.execute(app, interaction.user.toString(), interaction.guild.members.cache.get(interaction.options.get("user").value).user.toString()));
	}

	messageRun = async(app, message, args) => {
		await message.reply(await this.execute(app, message.author.toString(), args[0]));
	}

	execute = (app, executor, target) => {
		if (!target) return { content: `Specify someone to ${this.meta().name}!`};
		return app.functions.fetchFromAPI(1, `/imgs/${this.meta().name}`).then((response) => {
			return {
				content: `**${executor}** cuddles **${target}**!`,
				embeds: [{
					color: app.system.embedColors.lime,
					image: { url: response.data.url },
					footer: { text: app.footerText }
				}]
			};
		}).catch((response) => {
			return {
				embeds: [{
					color: app.system.embedColors.red,
					description: `${(response.message) ? response.message : response.error}`,
					footer: { text: app.footerText }
				}]
			};
		});
	}
}

module.exports = function() { return new command() }