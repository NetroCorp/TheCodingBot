module.exports = {
	name: "eval",
	description: "JavaScript executor for TheCodingBot.",
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
				throw new Error("`Loading tokens/api keys are disallowed on this bot. Please see the true BOT_OWNER for more information.`");
			};

			let evaled = eval(code);

			if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

			if (evaled !== "Promise { <pending> }") {
				var result = [];
				if (evaled == "")
					result.push({ name: "Execution Result", value: "```js\n\"\"```" });
				else
					result.push({ name: "Execution Result", value: "```js\n" + clean(evaled) + "```" });
				message.channel.send({ embed: {
					title: client.config.system.emotes.success + " **Eval**",
					color: client.config.system.embedColors.aqua,
					fields: result,
					footer: { text: client.config.system.footerText }
				}});
			};
		} catch (err) {
			message.channel.send({ embed: {
				title: client.config.system.emotes.error + " **Eval Error!**",
				color: client.config.system.embedColors.red,
				fields: [
					{ name: "Execution Failure!", value: "```js\n" + err.message + "```" }
				],
				footer: { text: client.config.system.footerText + " | There was an error." }
			}});
			log("!", "SYS", "[EVAL] " + err.message + "\n" + err.stack + "!");
		};
	}
};