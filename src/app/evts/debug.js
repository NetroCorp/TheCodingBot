/*
	TheCodingBot v6
	https://tcb.nekos.tech
*/

module.exports = {
    name: "debug",
    description: "Runs when the Gateway does something.",
    author: ["Aisuruneko"],

    execute: async(app, data) => {
        if (/(Sending a heartbeat|Latency of)/i.test(data)) return null;

        if (app.debugMode) {
            if (app.logger)
                app.logger.debug("DISCORD", data);
            else
                console.log(data);
        };
    }
}