var chproexec = require('child_process').exec;
module.exports = {
	name: "exec",
	description: "CMD Execution for TheCodingBot.",
	guildOnly: false,
	authorizedGuilds: [],
	hidden: true,
	permissions: ["BOT_OWNER"],
	cooldown: 0,
	aliases: [],
	syntax: [" <JSCode>"],
	execute: async(client, message, args) => {
		function clean(text) {
			if (typeof(text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
			else return text;
		};
		try {

			const code = message.content.split(" ").slice(1).join(" ");
			
			if (message.author.id != "222073294419918848" && code.includes("config") && code.includes("tokendata.json")) {
				throw new Error("Loading tokens/api keys are disallowed on this bot. Please see the true BOT_OWNER for more information.");
			};

			if (message.author.id != "222073294419918848" && code.includes("config") && code.includes("tokendata.json")) {
				throw new Error("Accesing commands with 'sudo' cannot be performed. Please see the true BOT_OWNER for more information.");
			};

			return execute(code);

			// Functions
			function execute(command) {
				chproexec(command, function(error, stdout, stderr) { if (error != null) { callback(null, error); }; if (stdout) { callback(stdout); }; });
			};
			function callback(execed, err = null) {
				if (err != null)
						throw new Error(err);
				if (typeof execed !== "string") execed = require("util").inspect(execed);

				if (execed !== "Promise { <pending> }") {
					var result = [];
					if (execed == "")
						result.push({ name: "Execution Result", value: "```js\n\"\"```" });
					else
						result.push({ name: "Execution Result", value: "```js\n" + clean(execed) + "```" });
					message.channel.send({ embed: {
						title: client.config.system.emotes.success + " **Exec**",
						color: client.config.system.embedColors.aqua,
						fields: result,
						footer: { text: client.config.system.footerText }
					}});
				};
			};
		} catch (err) {
			message.channel.send({ embed: {
				title: client.config.system.emotes.error + " **Exec Error!**",
				color: client.config.system.embedColors.red,
				fields: [
					{ name: "Execution Failure!", value: "```js\n" + err.message + "```" }
				],
				footer: { text: client.config.system.footerText + " | There was an error." }
			}});
			log("!", "SYS", "[EXEC] " + err.message + "\n" + err.stack + "!");
		};
	}
};