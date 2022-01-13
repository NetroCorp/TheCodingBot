//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];
const TCG = "222073294419918848";
const fs = require('fs');

exports.run = (client, message, footertxt) => {

	function ErrorHandler(Error) {
		message.channel.send({embed:{
			title: "TCG Bot | ERROR",
			color: colors[3],
			description: `**Sorry, but an error has occurred.**\n**ERROR:** ${Error}\n\n**If you believe this is an error that restricts the bot functionality, please report it to TheCodingGuy#6697.**`,
			footer:{text: footertxt}
		}});
	}

	console.log(`${message.author.username} is trying to shutdown the bot, making sure it is the right person or people.`);
	if (message.author.id == TCG) {
		message.channel.send({embed:{title:"TCG Bot | Shutting down...", color:colors[1], description:"OK, give me a moment. I will be gone shortly. :wave:", footer:{text:footertxt} }})
		.then(() => { client.user.setActivity("shutting down..."); console.log("Please wait, shutting down...\n\n\n\n\n"); client.destroy(); process.exit(0); })
	} else {
		ErrorHandler("You don't have permission to perform this command.");
		console.log(`Failed to reboot. ${message.author.username} is not TheCodingGuy.`);
	}
}