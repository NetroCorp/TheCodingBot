//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];

const TCG = "222073294419918848";
const TCGBot = "438532019924893707";

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
	if (message.author.id == TCGBot) {
		message.channel.send({embed:{title:"TCG Bot | Rebooting...", color:colors[2], description:"<a:aero_busy:437003746447458304> **|** One moment...\nRestarting TCG Bot...", footer:{text:footertxt} }})
		.then(msg => {
			client.user.setActivity("restarting...");
			console.log("Please wait, restarting...\n\n\n\n\n");
			client.destroy();
			console.log("Please wait, logging in.");
			client.login(config.token).then(() => { message.delete(); msg.delete(); message.channel.send({embed:{title:"TCG Bot | Reboot Success", color:colors[1], description:":white_check_mark: **|** I have finished rebooting.",footer:{text:footertxt} }}).then(rmsg => rmsg.delete(5000)); });
		});
	} else {
		ErrorHandler("You don't have permission to perform this command.");
		console.log(`Failed to reboot. ${message.author.username} is not TheCodingGuy.`);
	}
}