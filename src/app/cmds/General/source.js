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
			name: "source",
			description: "Bot is open source??",
			author: "Aisuruneko",
			version: "1.0.0",

			supportsPrefix: true,
			supportsSlash: true,

			options: [],
			permissions: {
				DEFAULT_MEMBER_PERMISSIONS: ["SendMessages"]
			}
		};
	}

	slashRun = async(app, interaction) => {
		await interaction.reply(this.execute(app));
	}

	messageRun = async(app, message) => {
		await message.reply(this.execute(app));
	}

	execute = (app) => {
		return {
			embeds: [{
				title: "TheCodingBot",
				color: app.system.embedColors.blue,
				description: "TheCodingBot is also made possible by those on the GitHub (thanks!)\nYou can obtain the source code and contribute at [here](https://codingbot.gg/source).",
				footer: { text: app.footerText }
			}]
		};
	}
}

module.exports = function() { return new command() }