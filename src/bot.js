//TCG Bot - Created in Discord.JS (https://discord.js.org). Bot created by TheCodingGuy#6697.

function syslog(type, message) {
	console.log(`\n[${type}] ${message}`);
	if(type == "WARN" || type == "ERR") { emcolor = colors[3]; } else { emcolor = colors[0]; }
	client.channels.get(systemlog).send({embed:{
		title: `TCG Bot | ${type}`,
		color: emcolor,
		description: `${message}`,
		footer:{text:footertxt}
	}});
	client.fetchUser(TCG).then(user => {user.send({embed:{
		title: `TCG Bot | ${type}`,
		color: emcolor,
		description: `${message}`,
		footer:{text:footertxt}
	}}); });
};

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

var count = "";
var bootTime = "";
var countmin = "0";
var countsec = "0";
var botload = "";
function Starting() {
	GetDate();
	GetTime();
	console.log(`[INFO] TCG BOT is attempting start at ${time} on ${date}...`);
	botload = `${time} on ${date}`;
}
Starting();
count = setInterval(function() {
	if(countsec == "60" || countsec == 60) {
		console.log("[WARNING] TCG Bot couldn't connect within 60 seconds.\nVerify you have a stable internet connection and the Discord servers are done.");
		client.destroy();
		process.exit(0);
		return;
	}
	countsec++;
	bootTime = countsec + " seconds";
}, 1000);
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const config = require("./config.json");
const prefix = config.prefix;

const TCG = "222073294419918848";

//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];
var version = "1.2-u2";
//var version = "TEST BUILD";
if(version == "TEST BUILD") { var footertxt = "!! WARNING !!\nWelcome to the future of TCG Bot.\nThis version is not yet public.\nIf errors occurr, contact TheCodingGuy#6697 ASAP."; }
else { var footertxt = "Bot created by TheCodingGuy#6697.\nVersion: "+version; }

var time;
var date;

var systemlog = "";
var messagelog = "";


// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir("./events/", (err, files) => {
	if (err) return syslog("ERR", err);
	files.forEach(file => {
		let eventFunction = require(`./events/${file}`);
		let eventName = file.split(".")[0];
		// super-secret recipe to call events with all their proper arguments *after* the `client` var.
			client.on(eventName, (...args) => eventFunction.run(client, ...args, footertxt));
	});
});

// EVENTS
client.on("ready", () => {

	//client.user.setActivity("Starting up...");
	GetTime();
	GetDate();
	clearInterval(count);
	var msg = `TCG Bot was loaded at ${botload}\nAt ${time} on ${date}, the bot logged in.\nIt took the bot **${bootTime}** to load.\nI'm ready.`;
	syslog("INFO", `${msg}`);
	console.log("\n\n\n");
	var i = 0;
	function Activity() {
		if(i == 3) {
			stuff = setInterval(function(){	GetTime(); GetDate(); client.user.setActivity(`${time} ${date}`); }, 1000);
			setTimeout(function(){clearInterval(stuff); i=0; Activity(); }, 5000);
		} else {
			var statuses = [`with ${prefix}help`, `as version ${version}`, `on ${client.guilds.size} servers. Use ${prefix}invite to add me.`, "with the future.", "on TCG's site: http://officialtcgmatt.ml"];
			var newgame = statuses[Math.floor(Math.random() * statuses.length)];
			client.user.setActivity(newgame).then(() => console.log("[INFO] Set playing status: "+newgame));
			i++;
			setTimeout(function(){Activity();}, 300000);
		}
	}
	Activity();


});



client.on("message", message => {
	let cont = message.content.slice(prefix.length).split(" ");
	let command = cont[0];

	if(!message.author.username == "TCG Bot") {
		var msg = `@${message.author.username}#${message.author.discriminator}\nMessage: ${message.content}\nIn: ${message.guild} | #${message.channel.name}\nSent: ${message.createdAt}`;
		client.channels.get(messagelog).send({embed:{
			title: "TCG Bot | Message Sent",
			color: colors[1],
			description: `${msg}`,
			footer:{text:footertxt}
		}});
	}

	//Error Handler

	function ErrorHandler(Error) {
		message.channel.send({embed:{
			title: "TCG Bot | ERROR",
			color: colors[3],
			description: `**Sorry, but an error has occurred.**\n**ERROR:** ${Error}\n\n**If you believe this is an error that restricts the bot functionality, please report it to TheCodingGuy#6697.**`,
			footer:{text: footertxt}
		}});
	}

	//Command Handler

	//TCB System
	try{
		if(command == "write" || message.content.startsWith(prefix+"bytes")) {
			if(!message.author.id == TCG) {
				ErrorHandler(`The Bytes system is currently getting rewritten`); return;
			} else {
				let commandFile = require(`./commands/bytes-new.js`);
				commandFile.run(client, message, footertxt, prefix, command);
			}
		}
	} catch (err) {
		if(err == `Error: Cannot find module './commands/bytes-new.js'`){
			ErrorHandler(`Bytes system handler was not found. __Report now__.`);
			return;
		}
	}

	try {
		if(message.content.startsWith("/tcg")) { ErrorHandler("``/tcg`` prefix was removed. It is now ``/``. This warning message will be removed from the bot on 6/30/2018."); return; }
		if(!message.content.startsWith(prefix)) return;
		console.log(`[INFO] ${message.author.username}#${message.author.discriminator} is trying to run: ${command} command`);
		let commandFile = require(`./commands/${command}.js`);
		commandFile.run(client, message, footertxt, prefix, command, cont);
	} catch (err) {
		if(err == `Error: Cannot find module './commands/${command}.js'`){
			if(message.guild == null) return syslog("ERR", `This no longer sends to the user if command was not found.\n${message.author.username}#${message.author.discriminator} tried to run the command, "${command}", in DMs, but it does not exist.`);
			syslog("ERR", `This no longer sends to user if command was not found.\n${message.author.username}#${message.author.discriminator} tried to run the command, "${command}", in #${message.channel.name}, on the server, ${message.guild}, but it does not exist.`);
			return;

		}else{
			ErrorHandler(err);
			console.error(err);
			syslog("ERR", `An error occurred while running command: ${command}\n**Details:** ${err}\nMore information has been said in console.`);

		}
	};
});


client.login(config.token);
