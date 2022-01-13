// TCG Radio
// Version 1.0.0.0


//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];

const TCG = "222073294419918848";
var footertxt = "TCG Radio\nMade by TheCodingGuy#6697";
var prefix = "/tcg-r"

function log(type, message) {
	console.log("\n["+type+"] "+message);
};

exports.run = (client, message) => {

	message.delete(0);
	function embed(embedtitle, embedcolor, content) {
		message.channel.send({embed: {
			title: "TCG Radio | "+embedtitle,
			color: embedcolor,
			description: content,
			footer:{text:footertxt}
		}});
	};

	if(!message.content.startsWith(prefix)) return;

	if(message.content == prefix + " start") {
	
		log("RADIO", "User is wanting to start TCG Radio...");
		if(message.author.id == TCG) {
			const voiceChannel = message.member.voiceChannel;
			if (!voiceChannel || voiceChannel.type !== 'voice') return embed("Error", colors[3], "You are not in a voice channel. Please connect to one and try again.");
			voiceChannel.join().then(connection =>{
				message.channel.send({embed: { title: "TCG Radio | Starting...", color: colors[0], description: "Starting TCG Radio...", footer:{text:footertxt} }}).then((msg) => {msg.delete(3000);});
				log("RADIO", "Started. Playing intro sound.");
				var dispatcher = message.guild.voiceConnection.playFile("./start.mp3");
				dispatcher.on("end", end => {
					log("RADIO", "End of broadcast, playing end sound...");
					var dispatcher = message.guild.voiceConnection.playFile("./end.mp3");
					dispatcher.on("end", end => {
						message.channel.send({embed: { title: "TCG Radio | End of broadcast", color: colors[1], description: "The radio has reached the end of the broadcast.", footer:{text:footertxt} }}).then((msg) => {msg.delete(3000);});
						message.member.voiceChannel.leave();
					});
				});
			}).catch(err => { log("ERROR", err); embed("Error", colors[3], "Cannot start TCG Radio because of:\n"+err); });

		} else {
			embed("Error", colors[3], "You do not have permission to execute this command");
			return;
		}
	} else
	if(message.content == prefix + " end") {
		log("RADIO", "Ending TCG Radio...")
		message.channel.send({embed: { title: "TCG Radio | Ending...", color: colors[0], description: "Ending TCG Radio", footer:{text:footertxt} }}).then((msg) => {msg.delete(3000);});
		message.member.voiceChannel.leave();
		return;
	}
};