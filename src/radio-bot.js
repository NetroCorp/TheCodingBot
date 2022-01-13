//TCG Radio Bot - Created in Discord.JS (https://discord.js.org). Bot created by TheCodingGuy#6697.
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const config = require("./config.json");
const prefix = config.prefix;

const TCG = "222073294419918848";
var systemlog = "";

//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];

function syslog(type, message) {
	console.log(`\n[${type}] ${message}`);
	client.channels.get(systemlog).send(`[${type}] ${message}`);
	client.fetchUser(TCG).then(user => {user.send(`[${type}] ${message}`)});
}

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


client.on('ready', () => {
	GetTime();
	GetDate();
	var msg = `=== TCG RADIO STARTUP ===\nBOOTUP: ${time} ${date}`;
	syslog("INFO", `${msg}`);


});

client.on('message', message => {

	if(!message.author.id == TCG) return;
	if(message.content.startsWith(prefix + " begin")) {
		
	}

});

client.login(config.token);