/*
	TheCodingBot v6
	https://tcb.nekos.tech
*/

class main {
    constructor() {
        this.app = null;
    }

    setContext(app) {
        this.app = app;
    }

    clearCache = (module) => {
        if (module == null)
            Object.keys(require.cache).forEach(function(key) { delete require.cache[key] });
        else
            delete require.cache[module];
    };
    convertTimestamp = (unix_timestamp, getDate, bigHour) => {
        if (bigHour == null) bigHour = false;

        let date = new Date(unix_timestamp * 1); // Create Date from timestamp

        let hours = date.getHours(); // Hours part from the timestamp
        let minutes = "0" + date.getMinutes(); // Minutes part from the timestamp
        let seconds = "0" + date.getSeconds(); // Seconds part from the timestamp

        // Will display time in hh:mm:ss format
        let formattedTime = ((bigHour) ? ((hours > 12) ? (hours - 12) : (hours == 0) ? 12 : hours) : hours) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + ((bigHour) ? ((hours < 12) ? " AM" : " PM") : "");

        if (getDate) {
            const dd = String(date.getDate()).padStart(2, '0'),
                mm = String(date.getMonth() + 1).padStart(2, '0'), //January is 0!
                yyyy = date.getFullYear();
            formattedTime = mm + '/' + dd + '/' + yyyy + ' ' + formattedTime;
        };

        // Return that bad boy
        return formattedTime;
    };
    isAnimated = (str) => { return str.substring(0, 2) === 'a_'; };
    sleep = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)); };
    getTicks = () => { return ((new Date().getTime() * 10000) + 621355968000000000); };
    getID = (string) => { return string.replace(/[<#@&!>]/g, ''); };
	splitMulti = (str, tokens) => {
        const tempChar = tokens[0];
        for (let i = 1; i < tokens.length; i++) {
        	str = str.split(tokens[i]).join(tempChar);
        }
        str = str.split(tempChar);
        return str;
    };
	getFiles = async(dir, filter = []) => {
        if (filter.length > 2) return "filter too powerfuuuuul [startsWith, endsWith] only please, or no filter.";

        const { resolve } = this.app.modules["path"];
        const { readdir } = this.app.modules["fs"].promises;

        const dirents = await readdir(dir, { withFileTypes: true });
        const files = await Promise.all(dirents.map((dirent) => {
            let res = resolve(dir, dirent.name);
        	if (dirent.isDirectory()) return this.app.functions.getFiles(res, filter);
            else {

            	if (filter[0] != null || filter[0] != undefined || filter[0] != "")
                	if (!res.startsWith(filter[0])) return "";
                if (filter[1] != null || filter[1] != undefined || filter[0] != "")
                	if (!res.endsWith(filter[1])) return "";
    			res = this.app.functions.splitMulti(res, ['\\', '\\\\', '/', '//'])
                return res.slice((res.length - 2), res.length).join("/");
            };
        }));
        return files.flat().filter(Boolean);
    };

    loadDependencies = (dependencies) => {
		const startTime = new Date().getTime();
        this.app.functions.clearCache();
        dependencies.forEach(dependency => {
            const dependencyName = dependency.name;
            try {
                this.app.logger.debug("SYS", `Loading dependency: ${dependencyName}...`);
                this.app.modules[dependencyName] = require(dependencyName);
				this.app.logger.info("SYS", `Loaded dependency: ${dependencyName} in ${new Date().getTime() - startTime}ms.`);
            } catch (Ex) {
				if (dependency.required) {
					this.app.logger.error("SYS", `Failed to load required dependency: ${dependencyName}. Bailing out!`);
					process.exit(1);
				} else {
					this.app.logger.error("SYS", `Failed to load dependency: ${dependencyName}.`);
				};
            };
        });
    };
    loadEvents = (events) => {
		const startTime = new Date().getTime();
        for (let i = 0; i < events.length; i++) {
            const eventName = events[i].split(".")[0];
			const eventLocation = process.cwd() + "/app/" + ((eventName.split("/")[0] != "evts") ? "evts/" : "") + eventName;
            try {
                this.app.logger.debug("SYS", `Loading event: ${eventName}...`);
				this.app.functions.clearCache(eventLocation);
                const rqEvent = require(eventLocation);

                this.app.client.on(rqEvent.name, rqEvent.execute.bind(null, this.app));
				this.app.logger.info("SYS", `Loaded event: ${eventName} by ${rqEvent.author.join(", ")} in ${new Date().getTime() - startTime}ms.`);
            } catch (Ex) {
				this.app.logger.error("SYS", `Failed to event: ${eventName}. ${Ex.message}\n${Ex.stack}`);
            };
        };
    };
    loadCommands = (commands) => {
		const startTime = new Date().getTime();
		this.app.client.arrayOfSlashCommands = [];
        for (let i = 0; i < commands.length; i++) {
            const commandName = commands[i].split(".")[0];
			const commandLocation = process.cwd() + "/app/" + ((commandName.split("/")[0] != "cmds") ? "cmds/" : "") + commandName;
            try {
                this.app.logger.debug("SYS", `Loading command: ${commandName}...`);
				this.app.functions.clearCache(commandLocation);
                const rqCommand = require(commandLocation);

				rqCommand.file = commandLocation;
				rqCommand.category = ((commandName.split("/")[0] == "cmds") ? "" : commandName.split("/")[0]) || "Uncategorized";

                this.app.client.slashCommands.set(rqCommand.name, rqCommand);
				this.app.client.arrayOfSlashCommands.push(rqCommand);
				this.app.logger.info("SYS", `Loaded command: ${commandName} by ${rqCommand.author.join(", ")} in ${new Date().getTime() - startTime}ms.`);
            } catch (Ex) {
				this.app.logger.error("SYS", `Failed to command: ${commandName}. ${Ex.message}\n${Ex.stack}`);
            };
        };
    };

	exitHandler = (options, exitCode) => {
		if (options.cleanup) {
			if (this.app.client != null)
				if (this.app.client.user != null) {
					this.app.logger.info("DISCORD", "Logging out...");
					this.app.client.destroy();
				};

			if (this.app.db != null) {
					this.app.logger.info("DISCORD", "Closing Database...");
					this.app.databases.unload();
			};
		};
		if (exitCode || exitCode === 0) {}
		if (options.exit) process.exit();
	}

}

// module.exports = main;
module.exports = function() { return new main() };