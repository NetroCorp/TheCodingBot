//Additional libraries:
const ms = require('ms');

//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];
var cmdtitle = "TCG Bot | Timer";

exports.run = (client, message, footertxt, prefix) => {

	let cont = message.content.split(' ');
	if (!client.timeit) client.timeit = [];
	let time = cont.slice(1).join(" ");
	if(cont[1] == "current") {
		if(!client.timeit[message.author.id]) return message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:**\n<@!"+message.author.id+">, no timer started.",footertext:{text:footertxt} }});
		message.channel.send({embed:{title:cmdtitle, color:colors[0], description:"<@!"+message.author.id+">, time left on "+message.author.username+"'s timer: "+ms(ms(client.timeit[message.author.id]), { long:true })+".", footertext:{text:footertxt} }});
		return;
	}
	let validStopping = ['stop', 'end'];
	if (!time) return message.channel.send({embed:{ title:cmdtitle, color: colors[3], description: `**ERROR:**\n<@!${message.author.id}>, you must set a duration for the timer in either hours, minutes or seconds.`, footer:{text:footertxt} }});

	if (validStopping.includes(time)) {
		if(!client.timeit[message.author.id]) return message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:**\n<@!"+message.author.id+">, no timer started for you.",footertext:{text:footertxt} }});
		try {
			message.channel.send({embed:{ title:cmdtitle, color: colors[1], description: `<@!${message.author.id}>,\n:alarm_clock: **|** The timer has ended.`, footer:{text:footertxt} }});
			clearTimeout(client.timeit[message.author.id]);
			delete client.timeit[message.author.id];
		} catch(error) {
			message.channel.send({embed:{ title:cmdtitle, color: colors[3], description: "**ERROR:**\n<@!"+message.author.id+">, "+error, footer:{text:footertxt} }});
			console.log(error);
		};
		return;
	} else {
		try {
			message.channel.send({embed:{ title:cmdtitle, color: colors[1], description: `<@!${message.author.id}>,\n:clock1: **|** Timer has successfully started for ${ms(ms(time), { long:true })}.`, footer:{text:footertxt} }}).then(() => {
				client.timeit[message.author.id] = setTimeout(() => {
					message.channel.send(`<@!${message.author.id}>,`);
					message.channel.send({embed:{ title:cmdtitle, color: colors[1], description: `:alarm_clock: **|** The timer expired.`, footer:{text:footertxt} }});
					delete client.timeit[message.author.id];
				}, ms(time));
			});

		} catch(error) {
			message.channel.send({embed:{ title:cmdtitle, color: colors[3], description: "**ERROR:**\n<@!"+message.author.id+">, "+error, footer:{text:footertxt} }});
			console.log(error);
		};
		return;
	}
}