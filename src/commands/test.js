//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];

const TCG = "222073294419918848"

exports.run = (client, message, footertxt) => {

	function ErrorHandler(Error) {
		message.channel.send({embed:{
			title: "TCG Bot | ERROR",
			color: colors[3],
			description: `**Sorry, but an error has occurred.**\n**ERROR:** ${Error}\n\n**If you believe this is an error that restricts the bot functionality, please report it to TheCodingGuy#6697.**`,
			footer:{text: footertxt}
		}});
	}

	if(message.author.id == TCG) {
		var args = message.content.split(' ');
		var ID = args[1];
		var channelname = client.channels.get(ID);
		var username = "<@!"+ID+">";
		if(!args) return message.channel.send({embed:{description:`**Testing ID**:\nI think that's a... wait you didn't put an id` }});
		if(!channelname) {
			if(ID === "438532019924893707") {
				return message.channel.send({embed:{description:`**Testing ID**:\nI think it's a userID, the username is... wait a moment, that's ME! Hi there!` }});
			} else {
				return message.channel.send({embed:{description:`**Testing ID**:\nI think it's a userID, the username is: ${username}` }});
			}
			return;
		} else if(!username) {
			return message.channel.send({embed:{description:`**Testing ID**:\nI think it's a channelID, the channel name is: ${channelname}` }});
		} else {
			return message.channel.send({embed:{description:`**Testing ID**:\nHmm, this doesn't look like a real ID.` }});
		}
	}
};