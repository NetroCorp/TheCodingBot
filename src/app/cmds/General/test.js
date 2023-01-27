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
			name: "test",
			description: "Test command!",
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
		return "Hello world!";
	}
}

module.exports = function() { return new command() }