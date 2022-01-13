//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];

exports.run = (client, message, footertxt, prefix) => {

	if(message.content == prefix+"help") {
		var responses = [
		"**Commands:**\n",
		prefix+"help\n",
		prefix+"ping\n",
		prefix+"quote\n",
		prefix+"8ball\n",
		prefix+"explode\n",
		prefix+"numgen\n",
		prefix+"roll\n",
		prefix+"serverinfo\n",
		prefix+"userinfo\n",
		prefix+"format\n",
		prefix+"uptime\n",
		prefix+"say\n",
		prefix+"invite\n\n",
		"**CURRENCY (in TheCodingBytes [TCB]):**\nThis is getting rewritten, standby.\n\n",
		"**ADMINISTRATION:**\n",
		prefix+"prune\n",
		prefix+"kick\n",
		prefix+"ban\n",
		prefix+"unban\n",
		prefix+"lockdown\n\n",
		"**BOT OWNER ONLY:**\n",
		prefix+"shutdown\n",
		prefix+"reboot\n",
		prefix+"test"];

		message.channel.send({embed: {
			title: "TCG Bot | Help > Command List",
			color: colors[0],
			description: `__**Welcome to the TCG Bot Command Help.**__\n**NEW:** You can do ${prefix}help **command** to show more information on a command.\n\n${responses.join("")}\n`,
			footer:{text:footertxt}
		}});
		return;
	}
	if(message.content.startsWith(prefix+"help")) {
		var cont = message.content.split(" ");
		var command = cont[1];
		var helpmsg = "";

		if(command == "help") { helpmsg = "Generates help screen\nUsage: "+prefix+"help\n**Additional:** You can get indiviual command help & info by using: "+prefix+"help **command**"; }
		else if(command == "ping") { helpmsg = "Ping-Pong! (Checks Latency & API Latency)\nUsage: "+prefix+"ping"; }
		else if(command == "quote") { helpmsg = "Generates a random quote\nUsage: "+prefix+"quote\n**Additional:** You can get a quote you love by using: "+prefix+"quote **number**"; }
		else if(command == "8ball") { helpmsg = "Generates a random answer to a question\nUsage: "+prefix+"8ball question"; }
		else if(command == "explode") { helpmsg = "Explodes something or someone\nUsage: "+prefix+"explode object\n**Additional:** You cannot blow up the bot, the bot creator, or yourself."; }
		else if(command == "numgen") { helpmsg = "Generates a random number from 1-10\nUsage: "+prefix+"numgen\n**Additional:** You can generate a random number from 1 to your own number by using: "+prefix+"numgen **number**"; }
		else if(command == "roll") { helpmsg = "Rolls a dice from 1-6\nUsage: "+prefix+"roll"; }
		else if(command == "serverinfo") { helpmsg = "Gets info on the server\nUsage: "+prefix+"serverinfo"; }
		else if(command == "userinfo") { helpmsg = "Gets info on a user\nUsage: "+prefix+"userinfo\n**Additional:** Not supplying or putting a invalid user ID or a mention (By using: "+prefix+"userinfo **userID or mention**) will return info on yourself."; }
		else if(command == "format") { helpmsg = "Formats a drive\nUsage: "+prefix+"format **drive**\n**Additional:** Only supports A: to N:"; }
		else if(command == "uptime") { helpmsg = "Returns how long bot has been online\nUsage: "+prefix+"uptime"; }
		else if(command == "say") { helpmsg = "Makes bot say something\nUsage: "+prefix+"say **message**\n**Additional:** It does output who said requested to say the message."; }
		else if(command == "invite") { helpmsg = "Returns invite of bot\nUsage: "+prefix+"invite"; }
		//Administration:
		else if(command == "prune") { helpmsg = "Deletes x number of messages\nUsage: "+prefix+"prune **number**\n**Additional:** Not supplying a number will delete 1 message by default.\n**Requires:** bot & user to have ``MANAGE MESSAGES`` permission."; }
		else if(command == "kick") { helpmsg = "Kicks a user from server\nUsage: "+prefix+"kick **mention** **reason**\n**Additional:** You can still kick a user if no reason provided.\n**Requires:** bot & user to have ``KICK MEMBERS`` permission."; }
		else if(command == "ban") { helpmsg = "Bans a user from server\nUsage: "+prefix+"ban **mention** **reason**\n**Additional:** You can still ban a user if no reason provided.\n**Requires:** bot & user to have ``BAN MEMBERS`` permission."; }
		else if(command == "unban") { helpmsg = "Unbans a user from server\nUsage: "+prefix+"unban **userID**\n**Additional:** You can cannot use a mention for this.\n**Requires:** bot & user to have ``BAN MEMBERS`` permission."; }
		else if(command == "lockdown") { helpmsg = "Locks a channel for a specific time\nUsage: "+prefix+"lockdown **time**\n**Additional:** You can put `30s`, `5m`, or `1d` (Supports miliseconds, minutes, hours, and days).\n**Requires:** bot & user to have ``MANAGE ROLES`` permission."; }
		else { message.channel.send({embed:{ title:"TCG Bot | Help > Command Help",color:colors[3],description:"**ERROR:** Cannot find that command in the help section.\nTry doing ``/help``",footer:{text:footertxt} }}); return; };
		message.channel.send({embed:{
			title:"TCG Bot | Help > Command help",
			color: colors[0],
			description: `__Command help for \`\`${prefix}${command}\`\`__\n\n${helpmsg}`,
			footer:{text:footertxt}
		}});
		return;
	}
};