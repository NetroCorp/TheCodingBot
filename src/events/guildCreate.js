//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];

var time;
var date;

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

var systemlog = "";
const TCG = "222073294419918848";


exports.run = (client, guild, footertxt, prefix) => {
	GetTime();
	GetDate();
	try {
		function syslog(type, msg) {
			console.log(`\n[${type}] ${msg}`);
			if(type == "WARN" || type == "ERR") { emcolor = colors[3]; } else if(type == "JOIN" || type == "LEAVE") { emcolor = colors[2]; } else { emcolor = colors[0]; }
			client.channels.get(systemlog).send({embed:{
				title: `TCG Bot | ${type}`,
				color: emcolor,
				description: `${msg}`,
				footer:{text:footertxt}
			}});
			client.fetchUser(TCG).then(user => {user.send({embed:{
				title: `TCG Bot | ${type}`,
				color: emcolor,
				description: `${msg}`,
				footer:{text:footertxt}
			}}); });
		};
		syslog("JOIN", `Added to server: ${guild.name} | Server ID: ${guild.id} | Members: ${guild.memberCount} | At Time: ${time} on ${date}`);
		let defaultChannel = "";
		guild.channels.forEach((channel) => {
			if(channel.type == "text" && defaultChannel == "") {
				if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) { defaultChannel = channel; }
			}
		});
		//defaultChannel will be the channel object that it first finds the bot has permissions for
		defaultChannel.send({embed: {
			title: "TCG Bot | Welcome",
			color: colors[1],
			description: "**Why hello there. I'm TCG Bot.**\nTCG Bot Help commands: ``"+prefix+" help``\n\n**Thanks for adding me to your server.**\n\n**An error occurred? Contact TheCodingGuy#6697 (Creator of bots)**",
			//v1.1 :: description: "__**Hi! I'm TCG Bot.**__\nPrefix: "+prefix+"\nGet TCG Bot Help Commands: "+prefix+" help\n\nThanks for adding me and I'll be here if you need me.\nProblems? **Report to TheCodingGuy#6697**.",
			footer: { text: footertxt }
		}});
		syslog("JOIN", `Successfully sent welcome message to: ${guild.name} | Server ID: ${guild.id}`);
	} catch (err) { syslog("ERR", `An error occurred while trying to send the welcome message to: ${guild.name} | Server ID: ${guild.id}.\nERROR is below:`); syslog("ERR", err);} //Catch the error
}