//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];

const TCG = "222073294419918848";
exports.run = (client, message, footertxt, prefix) => {

	if(message.author.id == TCG) {
		let cont = message.content.split(' ');
		let id = cont[1];
		let msg = cont.slice(2).join(" ");
		if(!msg) return message.channel.send({embed: { title: "TCG Bot | Error while sending your message", color: colors[3], description: "**ERROR:\n**Please supply the message.", footer: { text: footertxt } }});
		client.channels.get(id).send(msg);
	} else {
		let cont = message.content.split(' ');
		let msg = cont.slice(1).join(" ");
		if(!msg) return message.channel.send({embed: { title: "TCG Bot | Error while sending your message", color: colors[3], description: "**ERROR:\n**Please supply the message.", footer: { text: footertxt } }});

		message.channel.send(msg);
		message.channel.send({embed:{description:"Said by "+message.author }});
	}

}