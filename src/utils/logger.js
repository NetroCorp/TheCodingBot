/*
 * TheCodingBot v6
 * codingbot.gg
 * (c) 2023 Netro Corporation
*/

const meta = () => {
	return {
		name: "Logger",
		description: "Logs things to the CONSOLE."
	};
};

const fs = require("fs");
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
const knownTypes = { "ERROR": logColors.FgRed, "INFO": logColors.FgBlue, "WARN": logColors.FgYellow, "SUCCESS": logColors.FgGreen, "DEBUG": logColors.FgMagenta };
const knownLocations = { "SYSTEM": logColors.FgGreen, "BOOTSTRAP": logColors.FgMagenta, "DATABASE": logColors.FgYellow, "DISCORD": logColors.FgCyan };

class Logger {

    constructor (bot) {
		this.bot = bot;
		this.logLocation = `${__dirname}/../../logs`;
    };

	genDT = () => {
		const pZ = (i) => { return `${(i < 10) ? "0": ""}${i}` };
		const currently = new Date();
		return `${pZ(currently.getFullYear())}` + "/" +
		`${pZ(currently.getMonth() + 1)}` + "/" +
		`${pZ(currently.getDate())}` +
		" " +
		`${pZ(currently.getHours())}` + ":" +
		`${pZ(currently.getMinutes())}` + ":" +
		`${pZ(currently.getSeconds())}`;
	};

	logToFile = (data) => {
		if (!fs.existsSync(this.logLocation)) fs.mkdirSync(this.logLocation);
		fs.writeFileSync(`${this.logLocation}/${this.bot.uptime.startAt}-log.log`, `${data}\r\n`, {flag:'a+'});
	};

	genMsg = (type, location, msg) => {
		const currently = this.genDT();
		const typeColor = knownTypes[type] || logColors.FgWhite;
		const locationColor = knownLocations[location] || logColors.FgWhite;

		console[type.toLowerCase()](
			`${logColors.Reset}[` +
			`${logColors.FgCyan}${currently}` +
			`${logColors.Reset} · ` +
			`${typeColor}${type}` +
			`${logColors.Reset} | ` +
			`${locationColor}${location}` +
			`${logColors.Reset}]:` +
			" " +
			msg
		);
		this.logToFile(
			`[` +
			`${currently}` +
			` · ` +
			`${type}` +
			` | ` +
			`${location}` +
			`]:` +
			" " +
			msg
		);
	};

	log = (loc, msg) => { this.genMsg("LOG", loc, msg); };
	error = (loc, msg) => { this.genMsg("ERROR", loc, msg); };
	info = (loc, msg) => { this.genMsg("INFO", loc, msg); };
	warn = (loc, msg) => { this.genMsg("WARN", loc, msg); };
	debug = (loc, msg) => { if (this.bot.config.debug) this.genMsg("DEBUG", loc, msg); };
}

module.exports = (bot) => {
	return {
		meta,
		execute: Logger
	}
};