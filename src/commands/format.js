const Discord = require('discord.js');
//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];

exports.run = (client, message, footertxt) => {
	message.channel.send("<a:aero_busy:437003746447458304> **|** TCG Formatter is starting up...").then(msg => {
		let drive = message.content.split(" ");
		drive = drive[1];
		let avadrvs = ["A:", "B:", "C:", "D:", "E:", "F:", "G:", "H:", "I:", "J:", "K:", "L:", "M:", "N:" ];
		if(!drive) { msg.delete(); message.channel.send({embed:{title:"TCG Formatter",color:colors[3],description:"No drive to format inserted.\n__Available drives:__ \n"+avadrvs.join("\n"),footer:{text:footertxt} }}); return; }
		let length = avadrvs.length;
		let baddriv = true;
		while(length--) {
			if (drive.indexOf(avadrvs[length])!=-1) {
				msg.delete();
				baddriv = false;
				message.channel.send({embed:{title:"TCG Formatter",color:colors[3],description:"**WARNING:**\nFormatting "+drive+" will deleted __ALL__ data on this device.\nAre you sure? Y/n",footer:{text:"TCG Formatter. Copyright TCG. Licensed for use for TCG Bot.\n"+footertxt}  }});
				const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000000 });
				collector.on('collect', message => {
					if (message.content == "Yes" || message.content == "yes" || message.content == "Y" || message.content == "y") {
						message.channel.send("Formatting "+drive+"...");
						collector.cleanup();
						message.channel.send("<a:aero_busy:437003746447458304>:warning: **| Starting formatter, do not remove your device.**\n**0%** complete\n<:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422>")
						.then(msg => {
							let i = 1;
							let loaderthing = "";
							var FormatterTime = "";
							function Formatting() {
								let random = (Math.floor((Math.random()*9)+1));
								i = i + random;
								if(i > 100 || i == 100) {
									msg.edit(`:white_check_mark: **| Formatting ${drive} completed**\n**100%** complete\n<:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550>`);
									clearInterval(FormatterTime);
									return;
								}
								if(i > 0) { loaderthing = "<:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422>"; }
								if(i > 10 || i == 10) { loaderthing = "<:blurple:447395912474689550><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422>"; }
								if(i > 20 || i == 20) { loaderthing = "<:blurple:447395912474689550><:blurple:447395912474689550><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422>"; }
								if(i > 30 || i == 30) { loaderthing = "<:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422>"; }
								if(i > 40 || i == 40) { loaderthing = "<:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422>"; }
								if(i > 50 || i == 50) { loaderthing = "<:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422>"; }
								if(i > 60 || i == 60) { loaderthing = "<:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422>"; }
								if(i > 70 || i == 70) { loaderthing = "<:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:white:447395911425851422><:white:447395911425851422><:white:447395911425851422>"; }
								if(i > 80 || i == 80) { loaderthing = "<:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:white:447395911425851422><:white:447395911425851422>"; }
								if(i > 90 || i == 90) { loaderthing = "<:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:blurple:447395912474689550><:white:447395911425851422>"; }
								msg.edit(`<a:aero_busy:437003746447458304> **| Formatting ${drive}, do not remove your device.**\n**${i}%** complete\n${loaderthing}`);
							}
							FormatterTime = setInterval(function(){ Formatting(); }, Math.floor((Math.random()*1000)+1));

						});
						return;
					} else if (message.content == "No" || message.content == "no" || message.content == "N" || message.content == "n") {
						message.channel.send("Cancelling...");
						collector.cleanup();
						return;
					}
				});
			}
		}
		setTimeout(function(){if(baddriv) { msg.delete(); message.channel.send({embed:{title:"TCG Formatter",color:colors[3],description:"Invalid drive selected.\n__Available drives:__ \n"+avadrvs.join("\n"),footer:{text:footertxt} }}); return; } }, 2000);
	});
}