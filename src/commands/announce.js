//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];

const TCG = "222073294419918848";

exports.run = (client, message, footertxt, prefix) => {
	if(message.author.id == TCG) {

		if(message.content == prefix+"announce sample-update") {
				message.channel.send("**:x::warning::x: SAMPLE :x::warning::x:**");
				message.channel.send("**---------------------**\n**TCG Bot | Update**\n**---------------------**\nWhy hello there, TCG Bot just updated to version 1.2-u2.\n\nThis update includes:\n**! Re-did TCG Bot's 8ball command**\n**+ Added `/format`** *(currently supports from A: to N:)*\n**+ Added `/serverinfo`** *Accurate and quick*\n**+ Added `/userinfo`** *Also accurate and quick*\n**+ Added `/uptime`** *Useful to know how long the bot's been on.*\n**! RE-ADDED THE ALMOST FORGOTTEN `/quote`**\n**! Re-did ``/help``, you can do** ``/help`` **``command`` now to see more information on a command!**");
				message.channel.send("**:x::warning::x: SAMPLE :x::warning::x:**");
		} else
		if(message.content == prefix+"announce update") {
			let guild = message.guild;
			var guildList = client.guilds.array();
			try {
				guildList.forEach(guild => {

					let defaultChannel = "";
					guild.channels.forEach((channel) => {
						if(channel.type == "text" && defaultChannel == "") {
							if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) { defaultChannel = channel; }
						}
					});
					//defaultChannel will be the channel object that it first finds the bot has permissions for
					defaultChannel.send("**---------------------**\n**TCG Bot | Update**\n**---------------------**\nWhy hello there, TCG Bot just updated to version 1.2-u2.\n\nThis update includes:\n**! Re-did TCG Bot's 8ball command**\n**+ Added `/format`** *(currently supports from A: to N:)*\n**+ Added `/serverinfo`** *Accurate and quick*\n**+ Added `/userinfo`** *Also accurate and quick*\n**+ Added `/uptime`** *Useful to know how long the bot's been on.*\n**! RE-ADDED THE ALMOST FORGOTTEN `/quote`**\n**! Re-did ``/help``, you can do** ``/help`` **``command`` now to see more information on a command!**");
					message.channel.send(`:white_check_mark: **|** Sent message update message to ${guild.name}`);
				}).catch(err,guild => {
					console.log("Could not send message to " + guild.name);
					console.error(err);
					message.channel.send({embed: {
						title: "TCG Bot | Error while sending your message to "+guild.name,
						color: colors[3],
						description: "**ERROR:\n**"+err,
						footer: { text: footertxt }
					}});
				});
			} catch (err) { message.channel.send("ERROR: "+err); console.error(err); }
        	} else
		if(message.content.startsWith(prefix+"announce")) {
			let cont = message.content.split(' ');
			let colornum = cont[1];
			if(isNaN(colornum)) return message.channel.send({embed: { title: "TCG Bot | Error while sending your message", color: colors[3], description: "**ERROR:\n**Please use the colors for embeds:\n**COLORS:**\n0 = Blue\n1 = Lime\n2 = Yellow\n3 = Red", footer: { text: footertxt } }});
			let msg = cont.slice(2).join(" ");
			if(!msg) return message.channel.send({embed: { title: "TCG Bot | Error while sending your message", color: colors[3], description: "**ERROR:\n**Please supply the message.", footer: { text: footertxt } }});
			let guild = message.guild;
			var guildList = client.guilds.array();
			try {
				guildList.forEach(guild => {

					let defaultChannel = "";
					guild.channels.forEach((channel) => {
						if(channel.type == "text" && defaultChannel == "") {
							if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) { defaultChannel = channel; }
						}
					});
					//defaultChannel will be the channel object that it first finds the bot has permissions for
					defaultChannel.send({embed: {
						title: "TCG Bot | Announcement",
						color: colors[colornum],
						description: msg,
						footer: { text: footertxt }	

					}});
					message.channel.send(`:white_check_mark: **|** Sent message "${msg}" to ${guild.name}`);
				});
			} catch (err) {
				console.log("Could not send message to " + guild.name);
				console.error(err);
				message.channel.send({embed: {
					title: "TCG Bot | Error while sending your message to "+guild.name,
					color: colors[3],
					description: "**ERROR:\n**"+err,
					footer: { text: footertxt }
				}});
			}
        	}
	} else { message.channel.send({embed: { title: "TCG Bot | Error while sending your message", color: colors[3], description: "**ERROR:\n**You do not have permission to do this.", footer: { text: footertxt } }}); }

}