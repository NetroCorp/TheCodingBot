//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];
const TCG = "222073294419918848";
const fs = require('fs');

const config = require("../config.json");
exports.run = (client, message, footertxt) => {

	function ErrorHandler(Error) {
		message.channel.send({embed:{
			title: "TCG Bot | ERROR",
			color: colors[3],
			description: `**Sorry, but an error has occurred.**\n**ERROR:** ${Error}\n\n**If you believe this is an error that restricts the bot functionality, please report it to TheCodingGuy#6697.**`,
			footer:{text: footertxt}
		}});
	}

	console.log(`${message.author.username} is trying to restart the bot, making sure it is the right person or people.`);
	if (message.author.id == TCG) {
		message.channel.send({embed:{title:"TCG Bot | Rebooting...", color:colors[1], description:"OK, give me a moment. I will be back shortly. :wave:", footer:{text:footertxt} }});
		client.user.setActivity("restarting...");
		console.log("Please wait, restarting...\n\n\n\n\n");
		client.destroy();
		console.log("Please wait, logging in.");
		client.login(config.token);
	} else {
		ErrorHandler("You don't have permission to perform this command.");
		console.log(`Failed to reboot. ${message.author.username} is not TheCodingGuy.`);
	}
}