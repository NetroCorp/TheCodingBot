/*
	TheCodingBot v6
	https://tcb.nekos.tech
*/

module.exports = {
    name: "messageCreate",
    description: "Fired when a new message is received.",
    author: ["Aisuruneko"],

    execute: async(app, message) => {
		message = await message.fetch();
		if ((message.content.startsWith("t/")) || (message.content.startsWith("tB/")))
			message.reply(app.config.system.emotes.error + " TheCodingBot v6 has moved to slash commands `/`. Please start using them now to continue your usage of TheCodingBot.");
		return;
	}
}