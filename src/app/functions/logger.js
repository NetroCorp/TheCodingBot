/*
	THECODINGBOT v5
	Logger
	6/24/2021

	https://tcb.nekos.tech/source
	https://themattchannel.com
*/


const app = require("../cfg/app.js");

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

getTimestamp = () => { return `${loggingcolors.Reset}[${loggingcolors.FgCyan}${app.functions.convertTimestamp(new Date().getTime(), true, true)}${loggingcolors.Reset}] `; };
const knownLocations = { "SYS": loggingcolors.FgGreen, "DISCORD": loggingcolors.FgMagenta, "WEB": loggingcolors.FgBlue, "DB": loggingcolors.FgYellow };
const knownTypes = { "X": loggingcolors.FgRed, "i": loggingcolors.FgBlue, "!": loggingcolors.FgYellow, "S": loggingcolors.FgGreen, "D": loggingcolors.FgMagenta };
log = function(type, location, message, useTimeStamp, logToFile) { // no need to = true or = false, we should have the passed already.
    var typecolor = knownTypes[type] || loggingcolors.FgWhite;
    var locationcolor = knownLocations[location] || loggingcolors.FgWhite;
    console.log(`${((useTimeStamp) ? getTimestamp() : "")}${loggingcolors.Reset}[${typecolor}${type}${loggingcolors.Reset}] [${locationcolor}${location}${loggingcolors.Reset}] ${message}`);
}
class Logger {
    error = (location, message, useTimeStamp = true, logToFile = true) => { log("X", location, message, useTimeStamp, logToFile); };
    info = (location, message, useTimeStamp = true, logToFile = true) => { log("i", location, message, useTimeStamp, logToFile); };
    warn = (location, message, useTimeStamp = true, logToFile = true) => { log("!", location, message, useTimeStamp, logToFile); };
    success = (location, message, useTimeStamp = true, logToFile = true) => { log("S", location, message, useTimeStamp, logToFile); };
    debug = (location, message, useTimeStamp = true, logToFile = true) => { if (app.debugMode) log("D", location, message, useTimeStamp, logToFile); };
    warnAboutDebug = async(debug) => {
        if (debug) {
            console.log(`${getTimestamp()}${loggingcolors.BgRed}WARNING: Debug messages are spammy!${loggingcolors.Reset} (They really are...)`);
            await app.functions.sleep(1069);
        };
    }
}

module.exports = Logger;