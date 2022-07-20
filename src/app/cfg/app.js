/*
	TheCodingBot v6
	https://tcb.nekos.tech
*/

module.exports = {
    name: "TheCodingBot",
    shortName: "TCB",

    version: {
        major: 6,
        minor: 0,
        revision: 0,
        buildType: "A",
        toString: function() {
            const major = app.version.major,
                minor = app.version.minor,
                revision = app.version.revision;
            return major + "." + minor + "." + revision;
        },
        toBuildString: function() {
            let buildType = app.version.buildType;
            if (buildType == "A") buildType = "ALPHA";
            else if (buildType == "B") buildType = "BETA";
            else if (buildType == "R") buildType = "RELEASE";

            return buildType;
        },
        toFullString: function() {
            return app.version.toString() + " " + app.version.toBuildString();
        }
    },
    dependencies: [
        { name: "fs", required: true },
        { name: "path", required: true },
        { name: "util", required: true },
        { name: "node-fetch", required: false },
        { name: "discord.js", required: true },
        { name: "sequelize", required: true },
        { name: "canvas", required: false },
        { name: "os", required: true }
    ]
};