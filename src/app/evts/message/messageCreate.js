//
// TheCodingBot
// Netro Corporation
//
// https://codingbot.gg

class messageCreate {
	constructor() {
		this.functions = [];
	}

	meta = () => {
		return {
			name: "messageCreate",
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
		let message = params[0];
		message = await message.fetch().catch(err => {});
		if (!message) return;

		if (!message.content.startsWith(process.env.COMMANDS_PREFIX_DEFAULT)) return;
		const args = message.content.slice(process.env.COMMANDS_PREFIX_DEFAULT.length).split(/ +/);
		const commandName = args.shift().toLowerCase();

		const command = app.commands.prefix.get(commandName);
		if (!command) return message.reply("I couldn't find that command.");

		try {
			await command.messageRun(app, message, args);
		} catch (Ex) {
			message.reply(`Something went wrong! - ${Ex.message}`);
			console.log(Ex);
		};
	}
}

module.exports = function() { return new messageCreate() }