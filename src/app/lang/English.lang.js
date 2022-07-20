/*
	TheCodingBot v6
	https://tcb.nekos.tech
*/

module.exports = {
	metadata: {
		name: "English",
		full_name: "English (en_US)",
		description: "English - United States",
		langCode: "en_US",
		translator: "Aisuruneko",
		version: "1.0.0.0"
	},
	translations: {


		// Errors
		"errors.generic": "An error occurred!",
		"errors.commands.generic": "That command does not exist or is no longer available.",


		// Commands
		"commands.test.test": "Hello, world!",

		"commands.ping.title": "APPNAME Status",
		"commands.ping.status": "Status",
		"commands.ping.statusTypes": [
			"READY",
			"CONNECTING",
			"RECONNECTING",
			"IDLE",
			"NEARLY",
			"DISCONNECTED",
			"WAITING FOR GUILDS",
			"IDENTIFYING",
			"RESUMING"
		],
		"commands.ping.ping": "Ping",
		"commands.ping.servers": "Servers",
		"commands.ping.latency": "Latency",

		"commands.hug.title": "Hug",
		"commands.hug.hugs": "hugs",
		"commands.hug.personal": "Here's a hug to you,",

		"commands.pat.title": "Pat",
		"commands.pat.pats": "pats",
		"commands.pat.personal": "Here's a pat to you,",

		"commands.kiss.title": "Kiss",
		"commands.kiss.kisses": "kisses",
		"commands.kiss.personal": "Here's a kiss to you,",

		"commands.nom.title": "Nom",
		"commands.nom.noms": "noms",
		"commands.nom.personal": "Nomming you,",

		"commands.cuddle.title": "Cuddle",
		"commands.cuddle.cuddles": "cuddles",
		"commands.cuddle.personal": "I will cuddle you,"
	}
}