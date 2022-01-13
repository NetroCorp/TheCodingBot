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
	console.log("[INFO] Connecting to the database...");
	if(err) { ErrorHandler(err); console.log(err); return; }
	console.log("[INFO] Connected to the database!");
});
let collectable = false;
let counter = 0;
var num = 0;
var maxnum = Math.floor(Math.random() * 19 + 1);
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
		message.channel.send({embed:{title:"TCG Bot | Bytes | Help", color:colors[0], description:"**CURRENCY (in TheCodingBytes [TCB]**\n"+prefix+" bytes-create\n"+prefix+" bytes-bal\n"+prefix+" write",footer:{text:footertxt} }}); 
	}

	// Counting stuff

	if (!collectable) counter++;
	console.log(`[BYTES] Counter: ${counter} | Max Counter: ${maxnum}`);


	// Now loading the Bytes stuff from MySQL

	con.query('SELECT * FROM bytesdata WHERE id = "'+message.author.id+'"', (err,rows) => {
		if(err) ErrorHandler(err);
		rows.forEach( (row) => {
			// TCG Bytes -- Balance
			if(command == "bytes-bal") {
				try {
					if (!row) {
						//Check if user has TheCodingBytes -- if not, create the data:
						var sql = "";
						con.query('INSERT INTO bytesdata(id, user, bytes) VALUES(message.author.id, "NULL", "0"'), (err) => {
							if(err) { ErrorHandler(err); console.log(err); return; }
							message.channel.send({embed:{title:"TCG Bot | Bytes | Create", color:colors[0], description:`__**Welcome!**__\nBalance: \`\`${prefix} bytes-bal\`\`\n`,footer:{text:footertxt} }});
						});
					} else {
						ErrorHandler("You already have an account.");
						return;
					}
			// TCG Bytes -- Create
			if(command == "bytes-create") {
				try {
					if (!row) {
						//Check if user has TheCodingBytes -- if not, create the data:
						var sql = "";
						con.query('INSERT INTO bytesdata(id, user, bytes) VALUES(message.author.id, "NULL", "0"'), (err) => {
							if(err) { ErrorHandler(err); console.log(err); return; }
							message.channel.send({embed:{title:"TCG Bot | Bytes | Create", color:colors[0], description:`__**Welcome!**__\nBalance: \`\`${prefix} bytes-bal\`\`\n`,footer:{text:footertxt} }});
						});
					} else {
						ErrorHandler("You already have an account.");
						return;
					}
				} catch (err) { ErrorHandler(err); }
			}
		}	
	});


};