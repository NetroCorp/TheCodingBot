// ADDITIONAL LIBRARIES:
const fs = require('fs');

//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];
var cmdtitle = "TCG Bot | Quote";
const TCG = "222073294419918848";

exports.run = (client, message, footertxt, prefix) => {

	if(message.content == prefix+"quote") {
		QuoteGenNormal();
	} else {
		var cont = message.content.split(" ");
		let number = cont[1];
		if(!number || isNaN(number)) return message.channel.send({embed:{ title: cmdtitle, color: colors[3], description: "An error has occurred while generating a quote.\nNot a vaild number to get a quote be number", footer:{text:footertxt} }});
		QuoteGen(number);
	}

	function randomInt (low, high) {
		return Math.floor(Math.random() * (high - low) + low);
	}
	function QuoteGenNormal() {
		if (message.guild === null) {
			console.log(`User ${message.author.username} in DMs is running Quote Generator command.`);
		} else {
			console.log(`User ${message.author.username} in ${message.guild.name} is running Quote Generator command.`);
		}
		fs.readFile('quotes.txt', 'utf8', function (err,rawData) {
			if (err) {
				message.channel.send({embed:{
					title: cmdtitle,
					color: colors[3],
					description: "An error has occurred while generating a quote.\nPlease contact **TheCodingGuy#6697** and give him:"+err,
					footer:{text:footertxt}
				}});
				throw err;
				return;
			}
			data = rawData.split('\n');
			var quote = data[randomInt(0,data.length)];
			message.channel.send({embed: {
				title: "TCG Bot | Quote Generator",
				color: colors[0],
				description: ""+quote+"",
				footer: {
					text: footertxt
				}
			}});
			console.log("Returned: "+quote);
		});
	}

	function QuoteGen(num) {
		if (message.guild === null) {
			console.log(`User ${message.author.username} in DMs is running Quote Generator command.`);
		} else {
			console.log(`User ${message.author.username} in ${message.guild.name} is running Quote Generator command.`);
		}
		fs.readFile('quotes.txt', 'utf8', function (err,rawData) {
			if (err) {
				message.channel.send({embed:{
					title: cmdtitle,
					color: colors[3],
					description: "An error has occurred while generating a quote.\nPlease contact **TheCodingGuy#6697** and give him:"+err,
					footer:{text:footertxt}
				}});
				throw err;
				return;
			}
			data = rawData.split('\n');
			var quote = data[Math.floor(num - 1)];
			if(!quote) return message.channel.send({embed:{ title: cmdtitle, color: colors[3], description: "An error has occurred while generating a quote.\nThat quote number was not found. Current number of quotes: "+Math.floor(data.length)+".", footer:{text:footertxt} }});
			message.channel.send({embed: {
				title: "TCG Bot | Quote Generator",
				color: colors[0],
				description: ""+quote+"",
				footer: {
					text: footertxt
				}
			}});
			console.log("Returned: "+quote);
		});
	}

}