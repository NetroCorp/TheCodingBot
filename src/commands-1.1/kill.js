//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];
var cmdtitle = "TCG Bot | Killing Machine v1.0";

exports.run = (client, message, footertxt, prefix) => {
	var args = message.content.split('"')
	if(args.length >= 3){
		var target = args[1]
		if(args.length == 5){
			var weapon = args[3]
			message.channel.send("**" + target + "** has been killed by **" + message.author.username + "** using **" + weapon + "**")
		}else{
			message.channel.send("**" + target + "** has been killed by **" + message.author.username + "**")
		}
	}
};