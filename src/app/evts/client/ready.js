//
// TheCodingBot
// Netro Corporation
//
// https://codingbot.gg

class ready {
	constructor() {
		this.functions = [];
	}

	meta = () => {
		return {
			name: "ready",
			type: "normal",
			author: "Aisuruneko",
			version: "1.0.0"
		};
	}

	add = (fun) => {
		this.functions.push(fun);
	}

	run = (app, params) => {
		this.default(app, params); // Run default function
		for (var i = 0; i < this.functions.length; i++) {
			this.functions[i](app, params);
		};
	}

	default = async(app, params) => {
		app.footerText = app.footerText.replaceAll("%currentYear%", new Date().getFullYear());
		app.log.success("DISCORD", `Logged in as ${app.client.user.tag}`);

		const { Routes, REST } = app.dependencies["discord.js"];
		const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
		app.log.info("DISCORD", "Now registering slash commands...");
		try {
			await rest.put(
				Routes.applicationCommands(process.env.CLIENT_ID),
				{ body: app.commands.slash_data }
			);
			app.log.debug("DISCORD", "Successfully registered all slash commands.");
		} catch (Ex) {
			app.log.error("SYSTEM", `Could not register slash commands.`);
			console.log(Ex);
		};


		app.startUp.finishTime = new Date().getTime();
		const totalTime = (app.startUp.finishTime - app.startUp.startTime);
		app.log.success("SYSTEM", `Startup finished! It took ${totalTime}ms (${totalTime / 1000}s)!`);
	}
}

module.exports = function() { return new ready() }