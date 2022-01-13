//TCG Bot - Created in Discord.JS (https://discord.js.org). Bot created by TheCodingGuy#6697.
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const config = require("./config.json");
const prefix = config.prefix;

const TCG = "222073294419918848";

//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];
var time;
var date;
var systemlog = "";
var messagelog = "";

var version = "1.2";
var footertxt = "TCG Bot.\nMaintenance Mode.\nBot created by TheCodingGuy#6697.\nVersion: "+version;

function syslog(type, message) {
	console.log(`\n[${type}] ${message}`);
	if(type == "WARN") { emcolor = colors[3]; } else { emcolor = colors[0]; }
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
	var msg = `TCG Bot is online [IN MAINTENANCE MODE] as of ${time} on ${date}`;
	syslog("INFO", `${msg}`);
	client.user.setActivity("Maintenance Mode v1.5");
});

// EVENTS
client.on("guildCreate", guild => {
	try {
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
		description: "__**Hi! I'm TCG Bot.**__\nPrefix: "+prefix+"\nGet TCG Bot Help Commands: "+prefix+" help\n\nThanks for adding me and I'll be here if you need me.\nProblems? **Report to TheCodingGuy#6697**.",
		footer: { text: footertxt }
	}});
	} catch (err) { syslog("ERROR", err); } //Catch the error

});

client.on("guildDelete", guild => {
	GetTime();
	GetDate();
	syslog("REMOVE", `Added to server: ${guild.name} | Server ID: ${guild.id} | At Time: ${time} on ${date}`);
});
client.on("messageDelete", (msgdel) => {
	GetTime();
	GetDate();
	var message = `User: @${msgdel.author.username}#${msgdel.author.discriminator}\nMessage: ${msgdel.content}\nDeleted from: #${msgdel.channel.name} on ${msgdel.guild}\nTime sent: ${time} on ${date}`;
	client.channels.get(messagelog).send({embed:{
		title: "TCG Bot | Message Deleted",
		color: colors[3],
		description: `${message}`,
		footer:{text:footertxt}
	}});
	//Created by TCG
});

client.on('messageUpdate', (omsg, nmsg) => {

	if(omsg.author.bot) return;
	GetTime();
	GetDate();
	var message = `User: @${nmsg.author.username}#${nmsg.author.discriminator}\nOld Message: ${omsg.content}\nNew Message: ${nmsg.content}\nSent in: #${nmsg.channel.name} on ${nmsg.guild}\nTime sent: ${time} on ${date}`;
	client.channels.get(messagelog).send({embed:{
		title: "TCG Bot | Message Update",
		color: colors[0],
		description: `${message}`,
		footer:{text:footertxt}
	}});
	//Created by TCG
});


client.on("message", message => {
	if(message.author.bot) return;

	var msg = `@${message.author.username}#${message.author.discriminator}\nMessage: ${message.content}\nIn: ${message.guild} | #${message.channel.name}\nSent: ${message.createdAt}`;
	client.channels.get(messagelog).send({embed:{
		title: "TCG Bot | Message Sent",
		color: colors[1],
		description: `${msg}`,
		footer:{text:footertxt}
	}});

	if(!message.content.startsWith(prefix)) return;
	if(message.content == prefix + " ping") { try { let commandFile = require(`./commands/ping.js`); commandFile.run(client, message, footertxt, prefix); }
		catch (err){
			var msg = `Ping command failed.\n${err}`;
			syslog("WARN", `${msg}`);
			client.channels.get(messagelog).send({embed:{
				title: "TCG Bot | Failed to ping.",
				color: colors[3],
				description: `${msg}`,
				footer:{text:footertxt}
			}});
		}
		return;
	}
	if(message.content.startsWith(prefix)) {
		message.channel.send({embed:{
			title: "TCG Bot | Error",
			color: colors[3],
			description: "**Whoops.**\nSorry about this, but the bot is currently in maintenance mode.\nThis means the bot cannot handle any commands (example: ``/tcg help``).\n**TCG:**\nIf this is an error, please verify you started the bot with ``maintenance`` set to ``no``.\n** **\n**Thank you for your use of TCG Bot**.",
			footer:{text:footertxt}
		}});
	};

});

client.login(config.token);