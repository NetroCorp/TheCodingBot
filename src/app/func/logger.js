/*
	TheCodingBot v6
	https://tcb.nekos.tech
*/

const loggingcolors = {
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

const knownLocations = { "SYS": loggingcolors.FgGreen, "DISCORD": loggingcolors.FgMagenta, "WEB": loggingcolors.FgBlue, "DB": loggingcolors.FgYellow };
const knownTypes = { "X": loggingcolors.FgRed, "i": loggingcolors.FgBlue, "!": loggingcolors.FgYellow, "S": loggingcolors.FgGreen, "D": loggingcolors.FgMagenta };

// Okay, the legit function begin here.
class Logger {
	constructor() {
		this.app = null;
	}

	setContext(app) {
		this.app = app;
	}

	getTimestamp = () => { return `${loggingcolors.Reset}[${loggingcolors.FgCyan}${this.app.functions.convertTimestamp(new Date().getTime(), true, true)}${loggingcolors.Reset}] `; };

	log = function(type, location, message, useTimeStamp, logToFile) { // no need to = true or = false, we should have the passed already.
		const typecolor = knownTypes[type] || loggingcolors.FgWhite;
		const locationcolor = knownLocations[location] || loggingcolors.FgWhite;
		console.log(`${((useTimeStamp) ? this.getTimestamp() : "")}${loggingcolors.Reset}[${typecolor}${type}${loggingcolors.Reset}] [${locationcolor}${location}${loggingcolors.Reset}] ${message}`);
	}

	error = (location, message, useTimeStamp = true, logToFile = true) => { this.log("X", location, message, useTimeStamp, logToFile); };
	info = (location, message, useTimeStamp = true, logToFile = true) => { this.log("i", location, message, useTimeStamp, logToFile); };
	warn = (location, message, useTimeStamp = true, logToFile = true) => { this.log("!", location, message, useTimeStamp, logToFile); };
	success = (location, message, useTimeStamp = true, logToFile = true) => { this.log("S", location, message, useTimeStamp, logToFile); };
	debug = (location, message, useTimeStamp = true, logToFile = true) => { if (this.app.debugMode) this.log("D", location, message, useTimeStamp, logToFile); };
	bigWarn = async(message, useTimeStamp = true, logToFile = true) => {
		console.log(`${((useTimeStamp) ? this.getTimestamp() : "")}${loggingcolors.BgRed}WARNING: ${message}${loggingcolors.Reset}`);
	};
}

// module.exports = Logger;
module.exports = function() { return new Logger() };