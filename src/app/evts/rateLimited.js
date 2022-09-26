/*
	TheCodingBot v6
	https://tcb.nekos.tech
*/

module.exports = {
    name: "rateLimited",
	type: "rest", // rateLimit became a REST event and renamed
    description: "Runs when the Gateway ratelimits you.",
    author: ["Aisuruneko"],

    execute: async(app, data) => {
		console.log(data);
		const msg = `-- Ratelimit detected! --\n` +
			`Discord has placed a limit on ${data.path} for ${data.limit} requests.\n` +
			`This ratelimit is ${(data.global) ? "global" : "non-global"} and will expire in ${data.timeout}ms.\n`;
        if (app.logger)
            app.logger.error("DISCORD", msg);
        else
            console.error(msg);
    }
}