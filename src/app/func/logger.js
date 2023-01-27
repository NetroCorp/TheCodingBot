//
// TheCodingBot
// Netro Corporation
//
// https://codingbot.gg

const logColors = {
	"Reset": "\x1b[0m",

	"FgBlack": "\x1b[30m",
	"FgRed": "\x1b[31m",
	"FgGreen": "\x1b[32m",
	"FgYellow": "\x1b[33m",
	"FgBlue": "\x1b[34m",
	"FgMagenta": "\x1b[35m",
	"FgCyan": "\x1b[36m",
	"FgWhite": "\x1b[37m",

	"BgBlack": "\x1b[40m",
	"BgRed": "\x1b[41m",
	"BgGreen": "\x1b[42m",
	"BgYellow": "\x1b[43m",
	"BgBlue": "\x1b[44m",
	"BgMagenta": "\x1b[45m",
	"BgCyan": "\x1b[46m",
	"BgWhite": "\x1b[47m"
};

const knownLocations = { "SYSTEM": logColors.FgGreen, "DISCORD": logColors.FgMagenta, "DATABASE": logColors.FgYellow };
const knownTypes = { "ERROR": logColors.FgRed, "INFO": logColors.FgBlue, "WARN": logColors.FgYellow, "SUCCESS": logColors.FgGreen, "DEBUG": logColors.FgMagenta };

class Logger {
	constructor(app) {
		this.app = app;
	}

	genDT = () => {
		const currently = new Date();
		return `${logColors.FgCyan}${currently.toLocaleDateString() + " " + currently.toLocaleTimeString()}`;
	};

	genMsg = (type, location, msg) => {
		const typeColor = knownTypes[type] || logColors.FgWhite;
		const locationColor = knownLocations[location] || logColors.FgWhite;
		
		// [DATE TIME - TYPE] FROM: MSG
		console.log(
			`${logColors.Reset}[${this.genDT()}${logColors.Reset} - ${typeColor}${type}${logColors.Reset}] ` +
			`${locationColor}${location}${logColors.Reset}: ` +
			msg
		);
	}

	error = (from, msg) => { this.genMsg("ERROR", from, msg); }
	info = (from, msg) => { this.genMsg("INFO", from, msg); }
	warn = (from, msg) => { this.genMsg("WARN", from, msg); }
	success = (from, msg) => { this.genMsg("SUCCESS", from, msg); }
	debug = (from, msg) => { if (this.app.debugMode) this.genMsg("DEBUG", from, msg); };
}

module.exports = function(app) { return new Logger(app) }