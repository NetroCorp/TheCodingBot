//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];

const TCG = "222073294419918848";
exports.run = (client, message, footertxt, prefix) => {

	message.delete();
	if(message.content == prefix+"dsay") {
		if(message.author.id == TCG) {
			let cont = message.content.split(' ');
			let msg = cont.slice(1).join(" ");
			if(!msg) return message.channel.send({embed: { title: "TCG Bot | Error while sending your message", color: colors[3], description: "**ERROR:\n**Please supply the message.", footer: { text: footertxt } }});
			message.channel.send(msg);
		}
	}
}