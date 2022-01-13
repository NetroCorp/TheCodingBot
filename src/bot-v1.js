const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const weather = require('weather-js');

const token = config.token;
const prefix = config.prefix;
let wprefix = "/tcg wgen";

const TCG = "222073294419918848";
// Embed colors:

var blue = "3447003";
var lime = "65280";
var yellow = "16312092";
var red = "15158332";


// Quote Generator stuff:

fs = require("fs");
var data;

// TCG Stuff:
var build = "M";
var ver = "1.0.1";
var version;
var numb = 1;

if(build == "A") { version = ver+" ALPHA" } else
if(build == "B") { version = ver+" BETA" } else
if(build == "T") { version = ver+" TEST MODE" } else
if(build == "" || build == " ") { version = ver; }
var footertxt = "Bot created by TheCodingGuy#6697.\nBot version: "+version;
if(build == "M") { version = ver+" MAINTENANCE MODE"; footertxt = "Bot is in maintenance mode. Please tell TheCodingGuy#6997 if there are any problems"; }

// Mortal Kombat Simulator Stuff:
var playerID = [];
var playerHP = [];
var ready = "no";
var playerActive = 0; // Add 1 to get the actual player number.
var player1HP;
var player2HP;
var mkgameenable = "No";

client.on("guildCreate", guild => {
	console.log("\n");
	console.log(`[INFO] Joined a server\n\tI have joined: ${guild.name} (id: ${guild.id}). This server has ${guild.memberCount} members!`);
	let defaultChannel = "";
	guild.channels.forEach((channel) => {
		if(channel.type == "text" && defaultChannel == "") {
			if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
				defaultChannel = channel;
			}
		}
	});
	//defaultChannel will be the channel object that it first finds the bot has permissions for
	defaultChannel.send({embed: {
		title: "TCG Bot | Welcome",
		color: 255,
		description: "Hi! I'm TCG Bot. I am here to give weather or support via quotes.\nFor Weather: **"+wprefix+" location**.\nFor Quotes: **"+prefix+"qhelp**. \n\nThanks for adding me and I'll be here if you need me.\nProblems? **Report to TheCodingGuy#6697**.",
		footer: {
			text: footertxt
		}
	}}); //Catch the error, DM me, with the custom message.
});

client.on("guildDelete", guild => {
	console.log("\n");
  // this event triggers when the bot is removed from a guild.
  console.log(`[INFO] Removed from a server\n\tRemoved from: ${guild.name} (id: ${guild.id})`);
});

function ConLogEvt(type, message){
	console.log(`[${type}] ${message}`);
}
client.on('ready', () => {
	//client.user.setStatus("online");
	//client.user.setActivity(" ");
	client.user.setStatus("dnd");
	client.user.setActivity("maintenance mode.");
	console.log("Playing: ");
	function resetBot() {
		// Mortal Kombat Simulator Stuff:
		var playerID = [];
		var playerHP = [];
		var ready = "no";
		var playerActive = 0; // Add 1 to get the actual player number.
		var player1HP;
		var player2HP;
	}
	function AfterParty() {
		var hrs = new Date().getHours();
		var min = new Date().getMinutes();
		var sec = new Date().getSeconds();
		if (hrs == 10 && min == 46 && sec == 45) {
			// Handle After Party message
			ConLogEvt("AFTER PARTY", "After Party message is about to begin.");
			client.channels.get("276166375574077440").send({embed:{title:"After Party",color:lime,description:`The time is: ${hrs}:${min}:${sec} Eastern Time which means an After Party is starting here.\nJoin nkrsRadio now for the After Party experience.\n*Enjoy the experience:tm:*.`,footer:{text:footertxt} }});
		}
	};

	console.log("\n[TCG Bot Information] TCG Bot is now ready.");
	resetBot(); //Execute the bot to clear everything, in clear of restart too
	AfterParty(); //Execute on load to check for AfterParty
	setInterval(function() { AfterParty(); }, 1000);
});

client.on('message', message => {

	// NEEDED for Weather System:
	let cont = message.content.slice(wprefix.length).split(" ");
	let args = cont.slice(1);
	let conte = message.content.slice(prefix.length).split(" ");
	let args1 = cont.slice(1);

	// Mortal Kombat Simulator

	function MKError(MKerr) {
		message.channel.send({embed:{
			title: "TCG Bot | Mortal Kombat",
			color: red,
			description: "**An error occurred:**\n"+MKerr,
			footer: { text:footertxt }
		}});
	}
	if(message.content == "mk!join") {
		console.log(`Player: ${message.author.username} attempting join...`);
		if(playerID.includes(message.author.id)) {
			MKError("Oops. You are already in this game, silly...");
			console.log(message.author.username + " is already in this game.");
		}else if(playerID.length == 2){
			MKError("Max players reached. Please try again when the current game has finished.");
			console.log(message.author.username + " wants to join, but the max players has been reached");
		}else{
			playerID.push(message.author.id);
			playerHP.push(100);
			message.channel.send({embed: {
				title: "TCG Bot | Mortal Kombat",
				color: lime,
				description: "Welcome! You are Player "+playerID.length+".",
				footer: { text: footertxt }
			}});
			console.log("Player IDs Logged:");
			console.log(playerID); // test build ready
			if(player1HP == 100){
				player2HP = playerHP[1];
			}else{
				player1HP = playerHP[0];
			}
		}
	}else if(message.content == "mk!start") {
		if(playerID.includes(message.author.id)) {
			if (playerID[0] == message.author.id) {
				if (ready == "yes") {
					MKError("Game is not ready to start. Oh wait, it was already started :b:oi.");
					console.log("The game was attempted to be started, but it was already started.");
				}else if(playerID.length == 2){
					ready = "yes";
					message.channel.send({embed: { title: "TCG Bot | Mortal Kombat", color: lime, description: "Welcome to Mortal Kombat Simulator. The game is ready to begin. Please, verify no one else interrupts you. Thanks for wanting to play! Player 1, run \`mk!fight\`.", footer: { text: footertxt } }});
					console.log(`The game was started by ${message.author.username} in ${message.guild.name}.`);
				}else{
					MKError("Game is not ready to start. Please ensure both players have joined using mk!join.\nCurrently joined players: " +playerID.length);
					console.log("The game was attempted to be started, but not all players are in the game.\nCurrently joined players: "+playerID.length);
				}
			} else { MKError("Only Player 1 (<@!"+playerID[0]+">) can execute this command."); }
		} else { MKError("You aren't even in the game."); }
	}else if(message.content.startsWith("mk!fight")) {
		if(!playerID.includes(message.author.id)) {
			MKError("You aren't even in the game.");
			return;
		}else
		if(playerID.length == 2 && ready == "yes") { //Ensures the game is ACTUALLY started
			if(playerID[playerActive] != message.author.id){ //Ensures player's turn
				MKError("You cannot fight yet. It is currently <@!" + playerID[playerActive] + ">'s turn");
				return;
			}
			var fightargs = message.content.split(" ");
			var damage = Math.floor(Math.random() * 10) + 1;
			var used = "fists";
			if(fightargs[1]) {
				if(fightargs[1] == "kick"){
					damage = Math.floor(Math.random() * 20) + 1;
					used = "kick";
					
				}else if(fightargs[1] == "weapon"){
					damage = Math.floor(Math.random() * 30) + 1;
					used = "a weapon";
				}
			}
			if(playerActive == 0){
				if(player2HP < 30 && used == "a weapon") { MKError("Player 2's HP is less than 30 HP (HP: "+player2HP+"). Please use kick or normal mk!fight instead."); return; }else
				if(player2HP < 20 && used == "kick") { MKError("Player 2's HP is less than 20 HP (HP: "+player2HP+"). Please use normal mk!fight instead."); return; }
				player2HP = player2HP - damage;
				message.channel.send({embed:{ title: "TCG Bot | Mortal Kombat", color: blue, description: `Player 1 dealt ${damage} damage to Player 2 with ${used}.\nPlayer 2 now has ${player2HP} HP.` }});
				if (player2HP < 0 || player2HP == 0) {
					message.channel.send({embed:{ color: red, description: "Player 2 (<@!"+playerID[1]+">) has died. Player 1 (<@!"+playerID[0]+">) has won." }});
					GameOver();
					return;
				}else
				if (player2HP < 10 && player2HP > 0) {
					message.channel.send({embed:{ color: yellow, description: ":warning: **|** WARNING: Player 2 (<@!"+playerID[1]+">) is below 10 HP ("+player2HP+")." }});
				}
				playerActive = 1;
				message.channel.send({embed: { color: lime, description: "Player 2 (<@!"+playerID[1]+">)'s turn." }});
			}else
			if(playerActive == 1){
				if(player1HP < 30 && used == "a weapon") { MKError("Player 1's HP is less than 30 HP (HP: "+player1HP+"). Please use kick or normal mk!fight instead."); return; }else
				if(player1HP < 20 && used == "kick") { MKError("Player 1's HP is less than 20 HP (HP: "+player1HP+"). Please use normal mk!fight instead."); return; }
				player1HP = player1HP - damage;
				message.channel.send({embed:{ title: "TCG Bot | Mortal Kombat", color: blue, description: `Player 2 dealt ${damage} damage to Player 1 with ${used}.\nPlayer 1 now has ${player1HP} HP.` }});
				if (player1HP < 0 || player1HP == 0) {
					message.channel.send({embed:{ color: red, description: "Player 1 (<@!"+playerID[0]+">) has died. Player 2 (<@!"+playerID[1]+">) has won." }});
					GameOver();
					return;
				}else
				if (player1HP < 10 && player1HP > 0) {
					message.channel.send({embed:{ color: yellow, description: ":warning: **|** WARNING: Player 1 (<@!"+playerID[0]+">) is below 10 HP ("+player1HP+")." }});
				}
				playerActive = 0;
				message.channel.send({embed: { color: lime, description: "Player 1 (<@!"+playerID[0]+">)'s turn." }});
			}
		}else{ MKError("The game hasn't been started yet.\nTry again when everyone uses ``mk!join`` or when Player 1 executes ``mk!start``"); }
	}else if(message.content == "mk!reset"){
		if (message.author.id == TCG) {
			if (playerID.length == 1) {
				message.channel.send({embed: { title: "TCG Bot | Mortal Kombat", color: lime, description: "OK, resetting the game, this will take a few seconds...", footer: { text: footertxt } }});
				GameOver();
			} else { MKError("There must be at least 1 player in the game in order to perform this command"); }
		}else{
			MKError("You do not specific permissions to do this.");
		}
	}else if(message.content == "mk!players"){
		if (playerID.length == 2) {
			message.channel.send({embed: { title: "TCG Bot | Mortal Kombat", color: lime, description: "There are " + playerID.length + " players in the game currently.\nPlayer 1: <@!" + playerID[0] + ">\nPlayer 2: <@!" + playerID[1] +">.", footer: { text: footertxt } }});
		} else if(playerID.length == 1) {
			message.channel.send({embed: { title: "TCG Bot | Mortal Kombat", color: blue, description: "There is only 1 player in the game. That player is: <@!" + playerID[0] +">.", footer: { text: footertxt } }});
		} else {
			MKError("There are no players in the game. What are you thinking?");
		}
	}else if(message.content == "mk!leave") {
		if (playerID.includes(message.author.id)) {
			message.channel.send({embed: { title: "TCG Bot | Mortal Kombat", color: yellow, description: "This command is coming soon. Please continue the game, it'd be better if you did. Just saying...", footer: { text: footertxt } }});
		} else {
			MKError("You are not in the game.");
		}
	}else if(message.content == "mk!help") {
		message.channel.send("Mortal Kombat Simulator.\nCreated by TheCodingGuy and RealTTNetwork.\nCopyright 2018.\nBot version: "+version+"\n**Commands:**\nmk!join -- Joins a game\nmk!start -- Starts the game\nmk!fight -- Fights the other player\nmk!players -- shows the players in the game\nmk!leave -- Leaves the game, making other player win.\nmk!help -- Gives this help screen.");
	}

	function GameOver() {
		console.log("\n[WARNING] Resetting Mortal Kombat game...\n");
		//Handles the game over
		setTimeout(function() {
			ready = "no";
			console.log("[INFO] Set the game to not ready.");
			playerID.length = 0;
			console.log("[INFO] CLEARED Player IDs, basically kicked.");
			playerHP.length = 0;
			console.log("[INFO] RESETTED all HPs.");
			playerActive = 0;
			console.log("[INFO] CLEARED playerActive value.\n");
			console.log("\n[ALL CLEAR] Successful reset.\n");
		}, 2000);
	}

	// TCG Commands

	function ErrorHandler(Error){
		message.channel.send({embed: {
			title: "TCG Bot | Error",
			color: red,
			description: `An error has occurred.\n**Error code:** __${Error}__\nIf you think is this is incorrect, give **TheCodingGuy#6697** that error.`,
			footer: { text: footertxt }
		}});
		return;
	}
	function cmdstuff(cmdname, colur, descript) {
		message.channel.send({embed:{
			title: "TCG Bot | "+cmdname,
			color: colur,
			description: descript,
			footer:{text:footertxt}
		}});
	}


	if(message.content == prefix+"botdata"){
		if(message.author.id == TCG) {
			cmdstuff("Bot data", blue, `I am on with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} servers.\n**Thank you everyone who has added this bot to their server!**`);
		}else{ ErrorHandler("You don't have permission to perform this command."); }
	}else
	if(message.content.startsWith(prefix+"prune")){
		if (message.guild === null) {
			ErrorHandler("You cannot run this command in a DM.");
			return;
		}
		var pruarg = message.content.split(' ');
		var messages = "1";
		if(pruarg[2]) { messages = pruarg[2]; }
		console.log(`${message.author.username} wanting to delete ${messages} messages.`);
		if (!message.channel.permissionsFor(message.author).has("MANAGE_MESSAGES")) {
			ErrorHandler("User does not have permission: MANAGE MESSAGES.");
			console.log("Sorry, you don't have the permission to execute the command \""+message.content+"\"");
			return;
		} else if (!message.channel.permissionsFor(client.user).has("MANAGE_MESSAGES")) {
			ErrorHandler("Bot does not have permission: MANAGE MESSAGES.");
			console.log("Bot doesn't have the permission MANAGE MESSAGES to prune.");
			return;
		}
		message.delete();
		if (message.channel.type == 'text') {
			message.channel.fetchMessages()
			.then( () => {
				message.channel.bulkDelete(messages);
				messagesDeleted = messages; // number of messages deleted

				// Logging the number of messages deleted on both the channel and console.
				if(messages == "1"){ msgwithornots = "message" } else { var msgwithornots = "messages" }
				message.channel.send({embed:{title:"TCG Bot | Prune Successful",color:lime,description:`Deletion of messages successful.\nDeleted **${messages}** ${msgwithornots}.`,footer:{text:footertxt} }})
				.then(msg => { setTimeout(function() { msg.delete(0); }, 4000); });
				console.log('Deletion of messages successful. Total messages deleted: '+messagesDeleted);
			}).catch(err => {
				console.log('Error while doing Bulk Delete');
				console.log(err);
				ErrorHandler("Error while doing deleting: "+err);
			});
		}
   	}else
	if(message.content == prefix+"invite") {
		cmdstuff("Add me to your server!", blue, "Add me into your server today!\nhttps://discordapp.com/oauth2/authorize?client_id=438532019924893707&scope=bot&permissions=54000704");
	}else
	if(message.content.startsWith(prefix+"status")){
		if(message.author.id == TCG){
			//args is already defined, so I had to make it a new (and args1 is defined too)
			var args2 = message.content.split(' ');
			if(args2[3] == "default"){
				client.user.setStatus("online");
				client.user.setActivity(`on ${client.guilds.size} servers`);
				if(message.guild == null){
					message.channel.send(`**DEBUG: **Setting online status: online\nSetting playing status to: on ${client.guilds.size} servers`);
				}
				return;
			}else if (args2[3]) {
				client.user.setStatus(args2[2]);
				console.log(`Setting status to: ${args2[2]}`);
				var activity = args2[3].split(':');
				var activityName = message.content.split('"');
				client.user.setActivity(activityName[1], { type: activity[0] });
				console.log(`Setting playing status to: ${activity[0]} ${activityName[1]}`);
				if(message.guild == null){
					message.channel.send(`**DEBUG: **Setting online status: ${args2[2]}\nSetting playing status to: ${activity[0]} ${activityName[1]}`);
				}
				cmdstuff("Status Update", lime, ":white_check_mark: Status has been updated.");
				return;
			}else{
				client.user.setStatus(args2[2]);
				console.log(`Setting status to: ${args2[2]}`);
				if (message.guild === null) {
					message.channel.send(`**DEBUG: **Setting online status: ${args2[2]}`);
				}
				cmdstuff("Status Update", lime, ":white_check_mark: Status has been updated.");
			}
		}else{
			ErrorHandler("You don't have permission to perform this command.");
		}
	}else
	if(message.content == prefix+"ping") {
		var APIPing = Math.round(client.ping);
		// var APIPing = "0"; // Testing
		if (APIPing == "0") { msg = "YA... right..."; } else
		if (APIPing < 0) { msg = "OK, what? Not a positive number! Ahhh!"; } else
		if (APIPing > 2000 || APIPing == 2000) { msg = "Discord or the hoster's machine is slow or unstable."; } else
		if (APIPing > 500 || APIPing == 500) { msg = "Whoa. Getting slow there..."; } else
		if (APIPing < 500) { msg = "Fast, I suppose."; } else
		if (APIPing < 50 || APIPing == 50) { msg = "WHOA! LIGHTNING FAST... almost.";
		} else { msg = "Hmm... unable to create message based on ping."; }
		message.channel.send(":ping_pong: Waiting for the ball...!").then(m => {
			m.edit({embed: {
				title: "TCG Bot | Ping-Pong",
				color: blue,
				description: `:ping_pong: Pong!\nLatency: ${m.createdTimestamp - message.createdTimestamp}ms.\nAPI Latency: `+APIPing+`ms.\n`+msg,
				footer:{text:footertxt}
			}});
		});
	} else
	if(message.content == prefix+"version") {
		cmdstuff("Version", blue, "Version: "+version);
	} else
	if(message.content == prefix+"reboot") {
		console.log(`${message.author.username} is trying to restart the bot, making sure it is the right person or people.`);
		if (message.author.id == TCG) {
			message.channel.send({embed:{title:"TCG Bot | Rebooting...", color:blue, description:"OK, give me a moment. I will be back shortly. :wave:", footer:{text:footertxt} }})
			.then(msg => { client.user.setActivity("restarting..."); console.log("Please wait, restarting...\n\n\n\n\n"); client.destroy(); })
			.then(() => { console.log("Please wait, logging in."); client.login(token)});
		} else {
			ErrorHandler("You don't have permission to perform this command.");
			console.log(`Failed to reboot. ${message.author.username} is not TheCodingGuy.`);
		}
	} else
	if(message.content == prefix+"shutdown") {
		console.log(`${message.author.username} is trying to shutdown the bot, making sure it is the right person or people.`);
		if (message.author.id == TCG) {
			message.channel.send({embed:{title:"TCG Bot | Shutting down...", color:blue, description:"OK, give me a moment. I will be gone shortly. :wave:", footer:{text:footertxt} }})
			.then(msg => { client.user.setActivity("shutting down..."); console.log("Please wait, shutting down...\n\n\n\n\n"); client.destroy(); process.exit(0); });
		} else {
			ErrorHandler("You don't have permission to perform this command.");
			console.log(`Failed to shutdown. ${message.author.username} is not TheCodingGuy.`);
		}
	} else if(message.content == "Stop acting like Microsoft Sam!") { message.channel.send("Stop fighting Goddamnit..."); }else
	if(message.content.startsWith(prefix+"8ball")) {
		var responses = ["Totally. You should know that!","Some guy said yes.","Some other guy said no.","TheCodingGuy said no.","TheROFL98 said no.","VeryBadKids said no.","megaMan9521 said no.","TheCodingGuy said yes.","TheROFL98 said yes.","VeryBadKids said yes.","megaMan9521 said yes.","Yup!","Sure","Nah.","I'm unsure, try asking again?","No.","Yes.","I suppose.","Oops. I forgot what the answer was.","error","YES OF FREAKING COURSE!","mmhmm.","Uh... no.",":100:% YES",":100:% NO!"]
		var ballmsg = responses[Math.floor(Math.random() * responses.length)];
		if(ballmsg == "error") { cmdstuff("8ball", red, ":question: Question: "+args.join(" ")+"\n:8ball: Answer: Sorry. Something went wrong. If you see **TheCodingGuy#6697**, tell him: TCGBOTERROR8ballRESPONSEFATAL6017174302018"); }
		else{ cmdstuff("8ball", blue, ":question: Question: "+args.join(" ")+"\n:8ball: Answer: "+ballmsg); }
	} else
	//if(message.content == prefix+"divideby0") { message.channel.send({embed: { title: "TCG Bot | Dividing by 0...", color: yellow, description: "Please wait...", footer: { text: footertxt } }}).then(msg => { setTimeout(function() { msg.delete(0); message.channel.send({embed: { title: " ", color: blue, description: "Imagine you have 0 pieces of bacon, and you cut it up among 0 friends. See? It doesn't make any freaking sense. Bacon is sad there is no bacon bacon ba-bacon, and you are sad you have 0 friends still. And even if you had some friends, they probably won't like Bacon.", footer: { text: footertxt } }}); }, 1000); }); } else
	if(message.content == prefix+"social") {
		cmdstuff("Social", blue, "Here's TCG's Social Media:\n**Youtube:** https://www.youtube.com/channel/UCc5Gp0c85XKV90Z-NrUjYMQ\n**Twitter:** https://twitter.com/OfficialTCGMatt/");
	} else
	if(message.content == prefix+"help") {
		cmdstuff("Help", blue, "**__Welcome to the new help__.**\n**Prefix: "+prefix+"**\n**COMMANDS:**\n"+prefix+"help\n"+prefix+"invite **(Add me to another server\)**\n"+prefix+"prune number **(REQUIRES MANAGE MESSAGES Permission)**\n"+prefix+"support **(After the word support, you @ someone. Leave it blank to support yourself.)**\n"+prefix+"8ball\n"+prefix+"numgen **(Generate a number 1-10, put a number and it will generate a number from 1-your number.)**\n"+prefix+"ping\n"+prefix+"social\n"+prefix+"version\n"+prefix+"qgen **(Quote Generator command)**\n"+prefix+"qhelp **(Quote Generator command)**\n"+wprefix+" location **(Weather System command)**\n\n**Problems? Notify TheCodingGuy#6697.**");
	} else
	if(message.content.startsWith(prefix+"support")) {
		if(message.content == prefix+"support <@!438532019924893707>" || prefix+"support @TCG Bot"){
			message.channel.send("Hey there, TCG Bo- Wait what... why would I need support? Support a human, not me. Thanks!");
		} else if(message.content == prefix+"support") {
			message.channel.send("Hey there, <@!"+message.author.id+">, TCG Bot here,\nI don't know extactly what the problem is, but I want you to know, you are needed & wonderful.\nBelieve you can do it and your half-way there.\nLife can be hard at times, but I believe you will get through it.\nBe happy, enjoy life, and continue to be strong.\nYou may get support whenever.\nGood luck to you, your family, your friends, and everyone else you know.\nFrom,\n\tTCG Bot.");
		} else {
			message.channel.send("Hey there, "+args[0]+", TCG Bot & <@!"+message.author.id+"> here,\nWe (at least I) may not know extactly what the problem is, but we want you to know, you are needed & wonderful.\nBelieve you can do it and your half-way there.\nLife can be hard at times, but we believe you will get through it.\nBe happy, enjoy life, and continue to be strong.\nYou may get support whenever.\nGood luck to you, your family, your friends, and everyone else you know.\nFrom,\n\tTCG Bot & <@!"+message.author.id+">.");
		}
	} else
	if(message.content.startsWith(prefix+"numgen")) {
		if(message.content == prefix+"numgen") {
			var num = Math.floor(Math.random() * 10) + 1;
			cmdstuff("Random Number Generator", blue, "Random number between 1 & 10:\nNumber: "+num);
		}else{
			var num = Math.floor(Math.random() * args.join(" ")) + 1;
			if(num == "NaN" || num == null || num == "" || num == NaN) {
				ErrorHandler("Invaild number");
			}else{
				cmdstuff("Random Number Generator", blue, "Random number between 1 & "+args.join(" ")+":\nNumber: "+num);
			}
		}
	} else
	if(message.content.startsWith("Bad TCG Bot")) {
		if (numb == "1") {message.channel.send("I'm sorry. I'll try to do better."); numb = "2"; } else
		if (numb == "2") {message.channel.send("I didn't mean it. Sorry."); numb = "3"; } else
		if (numb == "3") {message.channel.send("Please don't hate me."); numb = "1"; }
	} else
	if(message.content == prefix+"crash") {
		message.delete();
		message.channel.send({embed:{title:"TCG Bot", color:red, description:"**A problem has been detected and TCG OS has shutdown to prevent damage to this computer.**\n\n**Error:** *FORCE_CRASH*\n**File caused:** *C:/TCG-Bot/System/System.tcg*\n\n**STOP CODE:** *0x000f12*\n**Technical data:** *0x000f12 caused over render of 0x001f11*\n\n**Generating a crash report...**\n**Dumping to C:/TCG-Bot/System/Crashes/crash.tcgdmp**\n**Dump complete.**\n\n**Contact your system administrator or technical support group for help.**" }});
	} else
	// Quote Generator code

	if(message.content == prefix+"qhelp") {
		message.channel.send({embed: {
			title: "TCG Bot | Quote Generator",
			color: blue,
			description: "*Type* **"+prefix+"qgen** *for the magic to happen.",
			footer: {
				text: footertxt
			}
		}});
	} else
	if (message.content == prefix+"qgen") {
		message.channel.send({embed: {
			title: "TCG Bot | Quote Generator",
			color: yellow,
			description: "Please wait, generating a quote.",
			footer: {
				text: footertxt
			}
		}}).then(msg => { setTimeout(function() { msg.delete(0); QuoteGen() }, 200); });
	} else if(message.content.startsWith("/tcg")) {
		ErrorHandler("Invaild command");
	}
	function randomInt (low, high) {
		return Math.floor(Math.random() * (high - low) + low);
	}
	function QuoteGen() {
		if (message.guild === null) {
			console.log(`User ${message.author.username} in DMs is running Quote Generator command.`);
		} else {
			console.log(`User ${message.author.username} in ${message.guild.name} is running Quote Generator command.`);
		}
		fs.readFile('quotes.txt', 'utf8', function (err,rawData) {
			if (err) {
				ErrorHandler(err);
				console.log(err);
				return;
			}
			data = rawData.split('\n');
			var quote = data[randomInt(0,data.length)];
			message.channel.send({embed: {
				title: "TCG Bot | Quote Generator",
				color: blue,
				description: ""+quote+"",
				footer: {
					text: footertxt
				}
			}});
			console.log("Returned: "+quote);
		});
	}

	// Weather System code

	if(message.content.startsWith(wprefix)) {
		message.channel.send({embed: {
			title: "TCG Bot | Weather System",
			color: yellow,
			description: "Please wait, getting the weather.",
			"image": {
				"url": "http://nkrstech.co/Weather/assets/sun-loading.gif"
			},
			footer: {
				text: footertxt
			}
		}}).then(msg => { setTimeout(function() { msg.delete(0); GetWeather() }, 200); });
	}

	function GetWeather() {
		if (message.guild === null) {
			console.log(`User ${message.author.username} in DMs is running Weather System command.`);
		} else {
			console.log(`User ${message.author.username} in ${message.guild.name} is running Weather System command.`);
		}
		weather.find({search: args.join(" "), degreeType: 'F'}, function(err, result) {
			if (err) {
				ErrorHandler(err);
				console.log(err);
				return;
			}
            		if (result === undefined || result.length === 0) {
				ErrorHandler("Please enter a vaild location.");
				console.log("ERROR: User entered a invaild location.");
				return;
			}

			var current = result[0].current; // current part
			var location = result[0].location; // location part

			var weather = `It is currently: ${current.skytext}\nTimezone: UTC${location.timezone}\nTemperature: ${current.temperature} `+location.degreetype+`\nFeels like: ${current.feelslike}\nWinds: `+current.winddisplay+`\nHumidity: ${current.humidity}%`;
			message.channel.send({embed: {
				title: `TCG Bot | Weather System | Weather for ${current.observationpoint}`,
				color: blue,
				description: ""+weather+"",
				footer: {
					text: footertxt
				}
			}});
			console.log(`Returned:\nWeather System | Weather for ${current.observationpoint}\n`+weather);
		});
	}
});

console.log("Please wait, logging in.");
client.login(token);

//Invite: https://discordapp.com/oauth2/authorize?client_id=438532019924893707&scope=bot&permissions=37084224