//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];

const TCG = "222073294419918848";
const fs = require("fs");

exports.run = (client, message, footertxt, cont, blockedidsfile, blockedids) => {

	//Error Handler

	function ErrorHandler(Error) {
		message.channel.send({embed:{
			title: "TCG Bot | ERROR",
			color: colors[3],
			description: `**Sorry, but an error has occurred.**\n**ERROR:** ${Error}\n\n**If you believe this is an error that restricts the bot functionality, please report it to TheCodingGuy#6697.**`,
			footer:{text: footertxt}
		}});
	}

	if(message.author.id == TCG || message.author.hasPermission('ADMINISTRATOR')) {
		let idblock = cont[2];
		let idblockname = message.guild.channels.get(idblock);
		blockedids.ids = blockedids.ids + ", "+idblock;
		fs.writeFile("../Bytes-Blacklist.json", JSON.stringify(blockedids), (err) => { if (err) { console.error(err); ErrorHandler(err); } });
		message.channel({embed:{title:"TCG Bot | Bytes | Blacklist",color:colors[1],description:`Blocked channel #${idblockname.name} (ID: ${idblock}) from TheCodingBytes commands & collection.`,footer:{text:footertxt} }});
	}else{
		ErrorHandler("You do not have permission to do this.");
	}
}