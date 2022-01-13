//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];
var cmdtitle = "TCG Bot | Administration > Kick";

function GetTime() {
	var today=new Date();
	var h=today.getHours();
	var m=today.getMinutes();
	var s=today.getSeconds();
	var ampm = "";
	m = checkTime(m);
	s = checkTime(s);

	if (h > 12) { h = h - 12; ampm = " PM"; }
	else if (h == 12){ h = 12; ampm = " PM"; }
	else if (h < 12){ ampm = " AM"; }
	else { ampm = "PM"; };
	if(h==0) { h=12; }
	time = h+":"+m+":"+s+ampm;
}
function GetDate(){
	var d = new Date();
	var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	var month = [d.getMonth()+1];
	var day = d.getDate();
	var year = d.getFullYear();
	date = days[d.getDay()]+" "+month+"/"+day+"/"+year;
}
function checkTime(i) {
	if (i<10) {i = "0" + i};  // add zero in front of numbers < 10
	return i;
}


exports.run = (client, message, footertxt, prefix) => {
	if (message.guild === null) return message.channel.send({embed:{ title:cmdtitle, color: colors[3], description: "**ERROR:**\nCommand cannot be ran in DMs.", footer:{text:footertxt} }});

	let cont = message.content.split(' ');
	let user = message.mentions.members.first() || message.guild.members.get(cont[1]);
	let reason = cont.slice(2).join(" ");
	if(!user) {message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:** Invaild user to kick.", footer:{text:footertxt} }}); return;}
	if (!message.channel.permissionsFor(message.author).has("KICK_MEMBERS")) return message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:**\nYou do not have permission to kick people.",footertext:{text:footertxt} }});
	if (!message.channel.permissionsFor(client.user).has("KICK_MEMBERS")) return message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:**\nI do not have permission to kick people.",footertext:{text:footertxt} }});
	if (!user.kickable) return message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:**\nI cannot kick "+user+".\nThey may have a higher role.",footertext:{text:footertxt} }});
	user.kick().then((member) => {
		GetTime();
		GetDate();
		if(!reason || reason == null || reason == "" || reason == " ") {
			message.channel.send({embed:{
				title:cmdtitle,
				color:colors[1],
				description: `**User kicked**\nUser: ${user}\nReason: __No reason provided.__\nServer: ${message.guild.name}\nAt: ${time} on ${date}.`,
				footer:{text:footertxt}
			}}); 
			user.send({embed:{
				title: `TCG Bot | Kicked from server`,
				color: colors[3],
				description: `You were kicked from the server: ${message.guild.name}.\nAt: ${time} on ${date}.\nAdmin: ${message.author.username}#${message.author.discriminator}\nReason: __No reason provided.__`,
				footer:{text:footertxt}
			}})
		} else {
			message.channel.send({embed:{
				title:cmdtitle,
				color:colors[1],
				description: `**User kicked**\nUser: ${user}\nReason: ${reason}\nServer: ${message.guild.name}\nAt: ${time} on ${date}.`,
				footer:{text:footertxt}
			}});
			user.send({embed:{
				title: `TCG Bot | Kicked from server`,
				color: colors[3],
				description: `You were kicked from the server: ${message.guild.name}.\nAt: ${time} on ${date}.\nAdmin: ${message.author.username}#${message.author.discriminator}\nReason: ${reason}`,
				footer:{text:footertxt}
			}});
			return;
		}
	}).catch(err => {
		message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:**\n"+err,footertext:{text:footertxt} }});
 	});

}