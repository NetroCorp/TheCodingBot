//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];

const mysql = require("mysql");
var con = mysql.createConnection({
	host: 'localhost',
	user: 'account',
	password: 'data',
	database: 'accountdata'
});
con.connect(err => {
	if(err) { ErrorHandler(err); console.log(err); return; }
	console.log("Connected to the database!");
});
let userData;
let row;
let collectable = false;
let counter = 0;
var num = 0;
var maxnum = 0;
var msgfreeb;
maxnum = Math.floor(Math.random() * 19 + 1);
const TCG = "222073294419918848";

exports.run = async(client, message, footertxt, prefix, command) => {

	//Error Handler

	function ErrorHandler(Error) {
		message.channel.send({embed:{
			title: "TCG Bot | ERROR",
			color: colors[3],
			description: `**Sorry, but an error has occurred.**\n**ERROR:** ${Error}\n\n**If you believe this is an error that restricts the bot functionality, please report it to TheCodingGuy#6697.**`,
			footer:{text: footertxt}
		}}).then( msg => { console.log("[ERROR] "+Error); if(Error == "There is nothing to collect."){ msg.delete(4000); } });
	}
	if(command == "bytes"){
		message.channel.send({embed:{title:"TCG Bot | Bytes | Help", color:colors[0], description:"**CURRENCY (in TheCodingBytes [TCB]**\n"+prefix+"bytes-create\n"+prefix+"bytes-bal\n"+prefix+"write",footer:{text:footertxt} }}); 
	}
	//Load the data from MySQL
	con.query('SELECT * FROM bytesdata WHERE id = "'+message.author.id+'"', (err,row) => {
		if(err) ErrorHandler(err);
		//Count up.
		if (!collectable) counter++;
		console.log(`[BYTES] Counter: ${counter} | Max Counter: ${maxnum}`);
		if (maxnum >= counter){
			if(command=="write"){
				message.delete(0);
				if(collectable){ 
	
					if(!row){ErrorHandler("You do not have a account yet. Run ``/bytes-create`` to make one."); }

					//Run the code!
					con.query("UPDATE `bytesdata` SET `bytes`='"+Math.floor(row.bytes+num)+"' WHERE id='"+message.author.id+"'");

					//Sent the success!
					message.channel.send({embed:{title:"TCG Bot | Bytes | Written", color:colors[1], description:`Written ${num} bytes to ${message.author.username}.tcgbank.\nThis file now has `+row.bytes+` Bytes.`,footer:{text:footertxt} }}).then( msg => { setTimeout(function() { msg.delete(0); }, 8000); });

					//Change collectable to false:
					collectable = false;
					counter = 0;
					maxnum = Math.floor(Math.random() * 19 + 1);
				}else{ErrorHandler("There is nothing to collect.");}
			}else if(!collectable){
				num = Math.floor(Math.random() * 19) + 1;
				message.channel.send({embed:{title:"TCG Bot | Bytes | Collect",color:colors[2],description:"You need "+num+" Bytes for your account file. Run ``/write`` to write them to your account file.",footer:{text:footertxt} }})
				.then( msg => { msg.delete(60000); });
				collectable = true;
			}
		}
	});
	if(!message.content.startsWith(prefix)) return;
	if(command == "bytes-award"){
		if(message.author.id == TCG){
			var awardargs = message.content.split(' ');
			var awardnum = awardargs[2];
			if(isNaN(awardnum)) return;
			var person = awardargs[3];
			console.log(`${message.author.username} is awarding ${awardnum} to ${person}`);
			var personid = person.replace(/[<@!>]/g, '');
			con.query('SELECT * FROM bytesdata WHERE id = "'+personid+'"', (err,row) => {
				if(!row) {
					var sql = `UPDATE bytesdata SET bytes = ${row.bytes + parseInt(awardnum)} WHERE id = ${personid}`;
					con.query(sql, function (err, result) {
						if(err) { ErrorHandler(err); console.log(err); return; }
						message.channel.send({embed:{title:"TCG Bot | Bytes | Force Write", color:colors[0], description:`Written ${awardnum} Bytes to <@!${personid}>.tcgbank.`,footer:{text:footertxt} }}); 
					});
				} else { ErrorHandler("This user does not have a account yet. Run ``/bytes-create`` to make one."); return; }
			});
		} else { ErrorHandler("You do not have permission to do this."); }
	}else
	if(command == "bytes-wipe"){
		if(message.author.id == TCG){
			var wipeargs = message.content.split(' ');
			var wipenum = wipeargs[2];
			var person = wipeargs[3];
			console.log(`${message.author.username} is wiping ${awardnum} to ${person}`);
			var personid = person.replace(/[<@!>]/g, '');
			con.query('SELECT * FROM bytesdata WHERE id = "'+personid+'"', (err,row) => {
				if(!row) {
					if(wipenum > row.bytes){ErrorHandler(`This user does not have that much Bytes. (${userData.bytes} Bytes is all they have)`); return; }
					var sql = `UPDATE bytesdata SET bytes = ${row.bytes - wipenum} WHERE id = ${personid}`;
					con.query(sql, function (err, result) {
						if(err) { ErrorHandler(err); console.log(err); return; }
						message.channel.send({embed:{title:"TCG Bot | Bytes | Force Wipe", color:colors[0], description:`Wiped ${wipenum} Bytes from <@!${personid}>.tcgbank.`,footer:{text:footertxt} }}); 
					});
				} else { ErrorHandler("This user does not have a account yet. Run ``/bytes-create`` to make one."); return; }
			});
		}else{ ErrorHandler("You do not have permission to do this."); }
	}else
	if(command == "bytes-bal"){
		var balargs = message.content.split(' ');
		if(!balargs[2] || balargs[2] == null || balargs[2] == "" || balargs[2] == " "){
				con.query('SELECT * FROM bytesdata WHERE id = "'+message.author.id+'"', (err,rows) => {
					rows.forEach( (row) => {
						if (!row) {
							ErrorHandler("You do not have a account yet. Run ``/bytes-create`` to make one.");
							return;
						}else{
							message.channel.send({embed:{title:"TCG Bot | Bytes | Current", color:colors[1], description:`You have ${row.bytes} Bytes.`,footer:{text:footertxt} }});
							return;
						}
					});
				});
		}else{
			var person = balargs[2];
			var personid = person.replace(/[<@!>]/g, '');
			con.query('SELECT * FROM bytesdata WHERE id = "'+personid+'"', (err,row) => {
				if(!row){ ErrorHandler("This user does not have a account yet. Run ``/bytes-create`` to make one."); return; }
				message.channel.send({embed:{title:"TCG Bot | Bytes | Current", color:colors[0], description:`<@!${personid}> has `+row.bytes+` Bytes.`,footer:{text:footertxt} }}); 
			});
		}
	}else if(command == "bytes-create") {
		try {
			con.query('SELECT * FROM bytesdata WHERE id = "'+message.author.id+'"', (err,row) => {
				if (!row) {
					//Check if user has TheCodingBytes -- if not, create the data:
					var sql = "INSERT INTO bytesdata(id, user, bytes) VALUES(message.author.id, 'NULL', '0')";
					con.query(sql, function (err, result) {
						if(err) { ErrorHandler(err); console.log(err); return; }
						message.channel.send({embed:{title:"TCG Bot | Bytes | Create", color:colors[0], description:`__**Welcome!**__\nBalance: \`\`${prefix} bytes-bal\`\`\n`,footer:{text:footertxt} }});
					});
				} else {
					ErrorHandler("You already have an account.");
					return;
				}
			});
		} catch (err) { ErrorHandler(err); }
	}
};