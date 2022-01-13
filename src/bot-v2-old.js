//TCG Bot - Created in Discord.JS (https://discord.js.org). Bot created by TheCodingGuy#6697.
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const config = require("./config.json");
const prefix = config.prefix;

//TCB File Import
let codingbytes = JSON.parse(fs.readFileSync("./Bytes-File.json", "utf8"));
let userData = "";
const TCG = "222073294419918848";

//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];
var version = "1.1 Beta";
var footertxt = "Bot created by TheCodingGuy#6697.\nVersion: "+version;


client.on('ready', () => {
	console.log("\n\n[INFO] TCG Bot is online");
});

client.on("messageDelete", (messageDelete) => {
 console.log(`\n[DELETED] @${messageDelete.author.username}#${messageDelete.author.discriminator}: ${messageDelete.content} (In: ${messageDelete.guild}, #${messageDelete.channel.name} at: ${messageDelete.createdAt} `);
});

client.on('messageUpdate', (omsg, nmsg) => {
  console.log('\n[UPDATED] @%s#%s Old message: %s => New message: %s in: %s, #%s', nmsg.author.username, nmsg.author.discriminator, omsg.content, nmsg.content, nmsg.guild ,nmsg.name);
});


client.on("message", message => {
	if(message.author.bot) return;
	console.log(`\n@${message.author.username}#${message.author.discriminator}: ${message.content} (In: ${message.guild}, #${message.channel.name} at: ${message.createdAt} `);

	//TCB System
	if (codingbytes[message.author.id]) {
		//Load the data from Bytes-File.JSON
		userData = codingbytes[message.author.id];
		//Count up
		userData.counter++;

		//Count up locally
		let curcounter = Math.floor(3 * Math.sqrt(userData.counter));
		console.log(`Counter for ${message.author.username} file counter: ${userData.counter} local counter: ${curcounter}`);
		if (curcounter > userData.counter) {
			//Reset counter
			curcounter = userData.counter;

			//Give them free TheCodingBytes
			var num = Math.floor(Math.random() * 10) + 1;

			userData.bytes = Math.floor(userData.bytes + num);

			//Notify them
			message.reply(`you have been rewarded **${num}** Bytes.`);
		}
		//Write the data to the file
		fs.writeFile("./Bytes-File.json", JSON.stringify(codingbytes), (err) => { if (err) { console.error(err); ErrorHandler(err); } });
	}

	if(message.content.indexOf(config.prefix) !== 0) return;
	let cont = message.content.split(" ");
	let command = cont[1];

	//Error Handler

	function ErrorHandler(Error) {
		message.channel.send({embed:{
			title: "TCG Bot | ERROR",
			color: colors[3],
			description: `**Sorry, but an error has occurred.**\n**ERROR:** ${Error}\n\n**If you believe this is an error, please report it to TheCodingGuy#6697.**`,
			footer:{text: footertxt}
		}});
	}

	//Command Handler

	try {
		console.log(`User is wanting to run command: ${command} command`);
		if(command == "bytes"){
			message.channel.send({embed:{title:"TCG Bot | Bytes | Help", color:colors[0], description:"**CURRENCY (in TheCodingBucks [TCB]**\n"+prefix+" bytes-create\n"+prefix+" bytes-bal",footer:{text:footertxt} }}); 
		}else
		if(command == "bytes-bal"){
			if(message.author.id == TCG) {
				message.channel.send({embed:{title:"TCG Bot | Bytes | Current", color:colors[0], description:`You have 9999999 Bytes`,footer:{text:footertxt} }}); 
			}else if (!codingbytes[message.author.id]) {
				ErrorHandler("You do not have a account yet. Run ``/tcg bytes-create`` to make one.");
			}else{
				message.channel.send({embed:{title:"TCG Bot | Bytes | Current", color:colors[0], description:`You have ${userData.bytes} Bytes`,footer:{text:footertxt} }}); }
			}
		else if(command == "bytes-create") {
			try {
				if (!codingbytes[message.author.id]) {
					message.channel.send({embed:{title:"TCG Bot | Bytes | Create", color:colors[0], description:`We are creating your Bytes Account for you.\n__**Welcome!**__\nBalance: \`\`${prefix} bytes-bal\`\`\n`,footer:{text:footertxt} }});
				} else {
					ErrorHandler("You already have an account.");
					return;
				}
				//Check if user has TheCodingBytes -- if not, create the data
				if (!codingbytes[message.author.id]) codingbytes[message.author.id] = {
					bytes: 0,
					counter: 0
				};
			} catch (err) { ErrorHandler(err); }
		}else{
		let commandFile = require(`./commands/${command}.js`);
		commandFile.run(client, message, footertxt, prefix); }
	} catch (err) {
		if(err == `Error: Cannot find module './commands/${command}.js'`){
			ErrorHandler(`The command "${command}" does not exist.`);
		}else{
			ErrorHandler(err);
		}
		console.error(err);
	};
});


client.login(config.token);