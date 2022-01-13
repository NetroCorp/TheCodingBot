//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];

const fs = reqiure("fs");

//TCB File Import
//var codingbytes = JSON.parse(fs.readFileSync("./Bytes-File.json", "utf8"));
var file = "/var/www/html/account/Bytes-File.json"
var codingbytes = JSON.parse(fs.readFileSync(file, "utf8"));
let userData;
let collectable = false;
let counter = 0;
var num = 0;
var maxnum = 0;
var m;
var msgfreeb;
maxnum = Math.floor(Math.random() * 19 + 1);

const TCG = "222073294419918848";

exports.run = async (client, message, footertxt, prefix, command) => {

	//Error Handler

	function ErrorHandler(Error) {
		message.channel.send({embed:{
			title: "TCG Bot | ERROR",
			color: colors[3],
			description: `**Sorry, but an error has occurred.**\n**ERROR:** ${Error}\n\n**If you believe this is an error that restricts the bot functionality, please report it to TheCodingGuy#6697.**`,
			footer:{text: footertxt}
		}}).then( msg => { if(Error == "There is nothing to collect."){ msg.delete(4000); } });
	}

	//Load the data from Bytes-File.JSON
	userData = codingbytes[message.author.id];

	//Count up
	if(!collectable) counter++;
	console.log(`Counter: ${counter} | Max Counter: ${maxnum}`);
	if (maxnum == counter || counter > maxnum) {
		if(command == "write"){
			message.delete(0);
			if(collectable){
				m.delete(0);
				if(codingbytes[message.author.id]){

					//Run the code!
					userData.bytes = userData.bytes + num;

					//Sent the success!
					message.channel.send({embed:{title:"TCG Bot | Bytes | Written", color:colors[1], description:`Written ${num} bytes to ${message.author.username}.tcgbank.\nThis file now has ${userData.bytes} Bytes.`,footer:{text:footertxt} }}).then( msg => { setTimeout(function() { msg.delete(0); }, 8000); });

					//Change collectable to false:
					collectable = false;
					counter = 0;
					maxnum = Math.floor(Math.random() * 19 + 1);
				}else{ErrorHandler("You do not have a account yet. Run ``/tcg bytes-create`` to make one.");}
			}else{ErrorHandler("There is nothing to collect.");}
			return;
		}
		if(!collectable){num = Math.floor(Math.random() * 19) + 1;
		m = await message.channel.send({embed:{title:"TCG Bot | Bytes | Collect",color:colors[2],description:"You need "+num+" Bytes for your account file. Run ``/tcg write`` to write them to your account file.",footer:{text:footertxt} }})
		collectable = true;
		}
	}else
	if (counter > maxnum + 10) {
		if(collectable){
			maxnum = Math.floor(Math.random() * 19 + 1);
			collectable = false;
			counter = 0;
			console.log("No one collected the "+num+" Bytes. Resetted.");
		}
	}	
	//Write the data to the file
	fs.writeFile(file, JSON.stringify(codingbytes, null, 2), (err) => { if (err) { console.error(err); ErrorHandler(err); } });
	if(!message.content.startsWith(prefix)) return;

	//TCB Shop
	if(command == "bytes-shop"){
		var responses = "1 | Byte Collector [ROLE] | 1,024 Bytes\n2 | Byte Hunter [ROLE] | 5,000 Bytes\n3 | Byte Hoarder [ROLE] | 10,000 Bytes\n";
		message.channel.send({embed:{ title:"TCG Bot | TCB Shop", color:colors[0], description:"Currently in the shop:\n**ID NUMBER | ITEM NAME | PRICE**\n"+responses,footer:{text:footertxt} }});
	}else
	if(command == "bytes-buy"){
		var buyargs = message.content.split(' ');
		if(isNaN(buyargs[2])) { ErrorHandler("You must put the ID Number you want to buy. Run ``/tcg bytes-shop`` to find a ID Number"); return;}
		let role;
		let amount;
		if(buyargs[2] == "1") { role = message.guild.roles.find("name", "Byte Collector"); amount = "1024";}else
		if(buyargs[2] == "2") { role = message.guild.roles.find("name", "Byte Hunter"); amount = "5000";}else
		if(buyargs[2] == "3") { role = message.guild.roles.find("name", "Byte Hoarder"); amount = "10000";}
		else{ ErrorHandler("That ID Number ("+buyargs[2]+") does not exist in the database. Run ``/tcg bytes-shop`` to find a ID Number"); return;}
		if (message.member.roles.has(role.id)) { ErrorHandler("You already have that. Run ``/tcg bytes-shop`` to find another a ID Number"); return;}
		message.author.addRole(role);
		message.channel.send({embed:{title:"TCG Bot | TCB Shop | Purchase Complete", color:colors[1], description:"Purchase complete!",footer:{text:footertxt} }});
		userData.bytes = userData.bytes - amount;
	}else
	if(command == "free-bytes"){
	if(message.author.id == TCG){
		message.delete(0);
		msgfreeb = await message.channel.send({embed:{
			title: "TCG Bot | Free Bytes",
			color: colors[2],
			description: "Whoa! 500 Free Bytes are up, but for only a minute!\nCollect them now by reacting to the check!",
			footer:{text:footertxt}
		}}).then(() => { message.react('☑️') });

		const filter = (reaction, user) => {
			return ['☑️'].includes(reaction.emoji.name) && user.id === message.author.id;
		};

		message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
		.then(collected => {
			const reaction = collected.first();

			if (reaction.emoji.name === '☑️') {
				console.log(`TCG is starting a reaction event`);
				if(!codingbytes[message.author.id]){ console.log("User: "+message.author.id+" does not have a account yet."); return; }
				else{userData = codingbytes[message.author.id]; }
				userData.bytes = userData.bytes + 500;
				fs.writeFile(file, JSON.stringify(codingbytes, null, 2), (err) => { if (err) { console.error(err); ErrorHandler(err); } });
				console.log(`Written 500 Bytes to ${message.author.id}'s account.`);
			}
    		}).catch(collected => {
			console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
			msgfreeb.delete(0);
		});
	} else {
		ErrorHandler("You do not have permission to do this.");
	}
	} else
	if(command == "bytes-award"){
		if(message.author.id == TCG){
			var awardargs = message.content.split(' ');
			var awardnum = awardargs[2];
			if(isNaN(awardnum)) return;
			var person = awardargs[3];
			console.log(`${message.author.username} is awarding ${awardnum} to ${person}`);
			var personid = person.replace(/[<@!>]/g, '');
			if(!codingbytes[personid]){ ErrorHandler("This user does not have a account yet. Run ``/tcg bytes-create`` to make one."); return; }
			else{userData = codingbytes[personid]; }
			userData.bytes = userData.bytes + parseInt(awardnum);
			fs.writeFile(file, JSON.stringify(codingbytes, null, 2), (err) => { if (err) { console.error(err); ErrorHandler(err); } });
			message.channel.send({embed:{title:"TCG Bot | Bytes | Force Write", color:colors[0], description:`Written ${awardnum} Bytes to <@!${personid}>.tcgbank.`,footer:{text:footertxt} }}); 
		}else{
			ErrorHandler("You do not have permission to do this.");
		}
	}else
	if(command == "bytes-wipe"){
		if(message.author.id == TCG){
			var wipeargs = message.content.split(' ');
			var wipenum = wipeargs[2];
			var person = wipeargs[3];
			console.log(`${message.author.username} is wiping ${awardnum} to ${person}`);
			var personid = person.replace(/[<@!>]/g, '');
			if(!codingbytes[personid]){ ErrorHandler("This user does not have a account yet. Run ``/tcg bytes-create`` to make one."); return; }
			else{userData = codingbytes[personid]; }
			if(wipenum > userData.bytes){ErrorHandler(`This user does not have that much Bytes. (${userData.bytes} Bytes is all they have)`); return; }
			userData.bytes = userData.bytes - wipenum;
			fs.writeFile(file, JSON.stringify(codingbytes, null, 2), (err) => { if (err) { console.error(err); ErrorHandler(err); } });
			message.channel.send({embed:{title:"TCG Bot | Bytes | Force Wipe", color:colors[0], description:`Wiped ${wipenum} Bytes from <@!${personid}>.tcgbank.`,footer:{text:footertxt} }}); 
		}else{
			ErrorHandler("You do not have permission to do this.");
		}
	}else
	if(command == "bytes"){
		message.channel.send({embed:{title:"TCG Bot | Bytes | Help", color:colors[0], description:"**CURRENCY (in TheCodingBytes [TCB]**\n"+prefix+" bytes-create\n"+prefix+" bytes-bal\n"+prefix+" write",footer:{text:footertxt} }}); 
	}else
	if(command == "bytes-bal"){
		var balargs = message.content.split(' ');
		if(!balargs[2] || balargs[2] == null || balargs[2] == "" || balargs[2] == " "){
			if (!codingbytes[message.author.id]) {
				ErrorHandler("You do not have a account yet. Run ``/tcg bytes-create`` to make one.");
				return;
			}else{
				message.channel.send({embed:{title:"TCG Bot | Bytes | Current", color:colors[1], description:`You have ${userData.bytes} Bytes.`,footer:{text:footertxt} }});
			}
		}else{
			var person = balargs[2];
			var personid = person.replace(/[<@!>]/g, '');
			if(!codingbytes[personid]){ ErrorHandler("This user does not have a account yet. Run ``/tcg bytes-create`` to make one."); return; }
			else{userData = codingbytes[personid];}
			message.channel.send({embed:{title:"TCG Bot | Bytes | Current", color:colors[0], description:`<@!${personid}> has ${userData.bytes} Bytes.`,footer:{text:footertxt} }}); 
		}
	}else if(command == "bytes-create") {
		try {
			if (!codingbytes[message.author.id]) {
				message.channel.send({embed:{title:"TCG Bot | Bytes | Create", color:colors[0], description:`We are creating your Bytes Account for you.\n__**Welcome!**__\nBalance: \`\`${prefix} bytes-bal\`\`\n`,footer:{text:footertxt} }});
			} else {
				ErrorHandler("You already have an account.");
				return;
			}
			//Check if user has TheCodingBytes -- if not, create the data
			if (!codingbytes[message.author.id]) codingbytes[message.author.id] = {
				bytes: 0
			};
		} catch (err) { ErrorHandler(err); }
	}

};