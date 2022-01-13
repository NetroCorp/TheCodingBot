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

exports.run = (client, message, guild, footertxt) => {
	GetTime();
	GetDate();

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

	syslog("REMOVE", `Added to server: ${guild.name} | Server ID: ${guild.id} | At Time: ${time} on ${date}`);
}