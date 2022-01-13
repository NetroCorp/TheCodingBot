//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];
var cmdtitle = "TCG Bot | Administration > Ban";

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
	if(isNaN(user)) user = message.mentions.members.first();
	let reason = cont.slice(2).join(" ");
	if(!user) {message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:** invalid user to ban.", footer:{text:footertxt} }}); return;}
	if (!message.channel.permissionsFor(message.author).has("BAN_MEMBERS")) return message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:**\nYou do not have permission to ban people.",footertext:{text:footertxt} }});
	if (!message.channel.permissionsFor(client.user).has("BAN_MEMBERS")) return message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:**\nI do not have permission to ban people.",footertext:{text:footertxt} }});
	if (!user.bannable) return message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:**\nI cannot ban "+user+".\nThey may have a higher role or is not on this server.",footertext:{text:footertxt} }});
	user.ban().then(() => {
		GetTime();
		GetDate();
		if(!reason || reason == null || reason == "" || reason == " ") {
			message.channel.send({embed:{
				title:cmdtitle,
				color:colors[1],
				description: `**User Banned**\nUser: ${user} (ID: ${user.id})\nReason: __No reason provided.__\nServer: ${message.guild.name}\nAt: ${time} on ${date}.`,
				footer:{text:footertxt}
			}}); 
			client.fetchUser(user.id).then(user => { user.send({embed:{
				title: `TCG Bot | Banned from server`,
				color: colors[3],
				description: `You were Banned from the server: ${message.guild.name}.\nAt: ${time} on ${date}.\nAdmin: ${message.author.username}#${message.author.discriminator}\nReason: __No reason provided.__`,
				footer:{text:footertxt}
			}}); }).catch(() => { message.reply(":x: **|** Failed to inform "+user+" of ban"); });
			return;
		} else {
			message.channel.send({embed:{
				title:cmdtitle,
				color:colors[1],
				description: `**User Banned**\nUser: ${user} (ID: ${user.id})\nReason: ${reason}\nServer: ${message.guild.name}\nAt: ${time} on ${date}.`,
				footer:{text:footertxt}
			}});
			client.fetchUser(user.id).then(user => { user.send({embed:{
				title: `TCG Bot | Banned from server`,
				color: colors[3],
				description: `You were Banned from the server: ${message.guild.name}.\nAt: ${time} on ${date}.\nAdmin: ${message.author.username}#${message.author.discriminator}\nReason: ${reason}`,
				footer:{text:footertxt}
			}}); }).catch(() => { message.reply(":x: **|** Failed to inform "+user+" of ban"); });
			return;
		}
	}).catch(err => {
		message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:**\n"+err,footertext:{text:footertxt} }});
 	});

}