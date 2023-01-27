//
// TheCodingBot
// Netro Corporation
//
// https://codingbot.gg

module.exports = {
	footerText: "© Netro Corporation 2018-%currentYear%.", // The bottom text added the bottom of embeds.
	defaultLanguage: "English (en_US)", // The bot's default language (for new users).
	rotatingStatus: { // The RPS (Rotating Playing Status) changes the bot's activity every x seconds.
		enabled: true, // Should this feature be enabled?
		timeToChange: 180 // After how long (in seconds) should we wait to change the status?
	},

	// DO NOT TOUCH BELOW THIS LINE.
	// Unless you know what you're doing.
	// ================================================================================================

	version: {
		major: 6,
		minor: 0,
		revision: 0,
		type: "ALPHA",

		toString: function() {
			const major = this.major,
				minor = this.minor,
				revision = this.revision;
			return `${major}.${minor}.${revision}`;
		},
		toBuildString: function() {
			let buildType = this.type;
			if (buildType == "A") buildType = "ALPHA"; else if (buildType == "B") buildType = "BETA"; else if (buildType == "R") buildType = "RELEASE"; else buildType = "UNKNOWN";
			return buildType;
		},
		toFullString: function() { return `${this.toString()} ${this.toBuildString()}`; }
	},

	system: {
		dependencies: [
			{ name: "dotenv", required: true },

			{ name: "fs", required: true },
			{ name: "path", required: true },
			{ name: "util", required: true },
			{ name: "node-fetch", required: true },
			{ name: "os", required: true },

			{ name: "discord.js", required: true },
			{ name: "canvas", required: false },

			{ name: "sequelize", required: true }
		],

		embedColors: {
			aqua: 1752220,
			green: 3066993,
			lime: 65280,
			blue: 3447003,
			purple: 10181046,
			gold: 15844367,
			orange: 15105570,
			red: 15158332,
			yellow: 16312092,
			gray: 9807270,
			navy: 3426654,
			pink: 16580705,
			light_orange: 16098851,
			light_gray: 12370112,
			dark_aqua: 1146986,
			dark_green: 2067276,
			dark_blue: 2123412,
			dark_purple: 7419530,
			dark_gold: 12745742,
			dark_orange: 11027200,
			dark_red: 10038562,
			dark_gray: 9936031,
			darker_gray: 8359053,
			dark_navy: 2899536,
			dark_pink: 12320855
		}
	}

}