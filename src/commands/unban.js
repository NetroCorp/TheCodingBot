//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];
var cmdtitle = "TCG Bot | Administration > Unban";

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
	let user = cont[1];
	if(isNaN(user)) {message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:** Invaild user to unban (must be a user id).", footer:{text:footertxt} }}); return;}
	if (!message.channel.permissionsFor(message.author).has("BAN_MEMBERS")) return message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:**\nYou do not have permission to unban people.",footertext:{text:footertxt} }});
	if (!message.channel.permissionsFor(client.user).has("BAN_MEMBERS")) return message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:**\nI do not have permission to unban people.",footertext:{text:footertxt} }});

	GetTime();
	GetDate();
	message.guild.fetchBans().then(bans => {

		message.guild.unban(user).then((member) => {
			message.channel.send({embed:{
				title:cmdtitle,
				color:colors[1],
				description: `**User Unbanned**\nUser: <@!${user}>\nServer: ${message.guild.name}\nAt: ${time} on ${date}.`,
				footer:{text:footertxt}
			}});
			try { user.send({embed:{
				title: `TCG Bot | Banned from server`,
				color: colors[1],
				description: `You were Unbanned from the server: ${message.guild.name}.\nAt: ${time} on ${date}.\nAdmin: ${message.author.username}#${message.author.discriminator}\n**Please follow the rules and enjoy your stay.**`,
				footer:{text:footertxt}
			}}); } catch { message.reply(":x: **|** Failed to inform <@!"+user+"> of unban"); }
			return;
		}).catch(err => {
			message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:**\nUser never banned.",footertext:{text:footertxt} }});
 		});
	}).catch(err => {
		message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:**\n"+err,footertext:{text:footertxt} }});
		return;
 	});


}