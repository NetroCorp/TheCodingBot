/*
	THECODINGBOT v5 LOGGER
	Created 6/24/2021
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

class Logger {
    log = function(type, location, message, useTimeStamp = true, logToFile = true) {
        var typecolor = loggingcolors.FgWhite;

        if (type == "X") typecolor = loggingcolors.FgRed;
        else if (type == "i") typecolor = loggingcolors.FgBlue;
        else if (type == "!") typecolor = loggingcolors.FgYellow;
        else if (type == "S") typecolor = loggingcolors.FgGreen;

        var locationcolor = loggingcolors.FgWhite;

        if (location == "SYS") locationcolor = loggingcolors.FgGreen;
        else if (location == "DISCORD") locationcolor = loggingcolors.FgMagenta;
        else if (location == "WEB") locationcolor = loggingcolors.FgBlue;
        else if (location == "DB") locationcolor = loggingcolors.FgYellow;

        var timestamp = "";
        if (useTimeStamp) timestamp = `${loggingcolors.Reset}[${loggingcolors.FgCyan}${app.functions.convertTimestamp(new Date().getTime(), true, true)}${loggingcolors.Reset}] `;

        console.log(`${timestamp}${loggingcolors.Reset}[${typecolor}${type}${loggingcolors.Reset}] [${locationcolor}${location}${loggingcolors.Reset}] ${message}`);
    }

}

module.exports = Logger;