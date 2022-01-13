//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];

exports.run = (client, message, footertxt, prefix) => {

	function ErrorHandler(Error) {
		message.channel.send({embed:{
			title: "TCG Bot | ERROR",
			color: colors[3],
			description: `**Sorry, but an error has occurred.**\n**ERROR:** ${Error}\n\n**If you believe this is an error that restricts the bot functionality, please report it to TheCodingGuy#6697.**`,
			footer:{text: footertxt}
		}});
	}

	let args = message.content.split(' ');

	if(!args[1]) {
		var num = Math.floor(Math.random() * 10) + 1;
		message.channel.send({embed:{title:"TCG Bot | Random Number Generator", color:colors[0], description:"Random number between 1 & 10:\nNumber: "+num, footer:{footertxt} }});
	}else{
		if(isNaN(args[1])) {
			ErrorHandler("Invaild number");
			return;
		}
		var num = Math.floor(Math.random() * args[1]) + 1;
		message.channel.send({embed:{title:"TCG Bot | Random Number Generator", color:colors[0], description:"Random number between 1 & "+args[1]+":\nNumber: "+num, footer:{footertxt} }});
	}
};