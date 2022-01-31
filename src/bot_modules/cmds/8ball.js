module.exports = {
	name: "8ball",
	description: "The magic 8ball will answer your question!",
	guildOnly: false,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["DEFAULT"],
	cooldown: 2,
	aliases: [],
	syntax: [" <Question>"],
	execute: async(client, message, args) => {

		let question = args.slice(0).join(" ");
		// if (!question || question == null || question == undefined) { throw new Error("Missing argument (question)."); };

		var answers = [ "Yes!", "Nah.", "Uh...", "I don't actually know...", "I don't know how to respond to that.", "I think.", "I don't think so.", "Go ahead.", "Don't. It will cause either chaos or explosions!", ":thinking: I'm not sure...", "Mhm!" ];
		var answerNum = Math.floor(Math.random() * answers.length);

		var colorToUse = client.config.system.embedColors.lime;

		if (answerNum == 0 || answerNum == 7 || answerNum == 10) colorToUse = client.config.system.embedColors.lime;
		else if (answerNum == 1 || answerNum == 8) colorToUse = client.config.system.embedColors.red;
		else colorToUse = client.config.system.embedColors.purple;

		var answer = answers[answerNum];


		message.channel.send({ embed: {
			title: ":8ball: **8ball**",
			color: colorToUse,
			description: "Some magic please....",
			fields: [
				{ "name": "Question", "value": question },
				{ "name": "Answer", "value": answer }
			],
			footer: { text: client.config.system.footerText }
		}});
		return;
	}	
};