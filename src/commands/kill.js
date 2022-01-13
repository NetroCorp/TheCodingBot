//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];
var cmdtitle = "TCG Bot | Killing Machine v1.0";

exports.run = (client, message, footertxt) => {
	// var
	var args = message.content.split(" ");
	var target = args[1];
	if(!target) return message.channel.send({embed:{title:cmdtitle,color:colors[3],description:"**ERROR:** You did input who should be killed.",footer:{text:footertxt} }});
	var weapon = args.slice(2).join(" ");
	if(!isNaN(target)) { target = "<@!"+target+">"; }

	if(weapon) {
		message.channel.send({embed:{
			title:cmdtitle,
			color:colors[0],
			description:"**" + target + "** has been killed by **<@!" + message.author.id + ">** using **" + weapon + "**.",
			footer:{text:footertxt}
		}});
	}else{
		message.channel.send({embed:{
			title:cmdtitle,
			color:colors[0],
			description:"**" + target + "** has been killed by **<@!" + message.author.id + ">** using **their bare hands**.",
			footer:{text:footertxt}
		}});
	}
};