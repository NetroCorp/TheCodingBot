//Additional libraries:
const ms = require('ms');

//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];
var cmdtitle = "TCG Bot | Administration > Channel Lockdown";
const TCG = "222073294419918848";

exports.run = (client, message, footertxt, prefix) => {
	if (message.guild === null) return message.channel.send({embed:{ title:cmdtitle, color: colors[3], description: "**ERROR:**\n<@!"+message.author.id+">, this command cannot be ran in DMs.", footer:{text:footertxt} }});

	if (!message.channel.permissionsFor(message.author).has("MANAGE_ROLES")) return message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:**\n<@!"+message.author.id+">, you do not have permission ``MANAGE ROLES``.",footertext:{text:footertxt} }});
	if (!message.channel.permissionsFor(client.user).has("MANAGE_ROLES")) return message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:**\n<@!"+message.author.id+">, I do not have permission ``MANAGE ROLES``.",footertext:{text:footertxt} }});

	let cont = message.content.split(' ');
	if (!client.lockit) client.lockit = [];
	let time = cont.slice(1).join(" ");
	if(cont[1] == "current") {
		if(!client.lockit[message.channel.id]) return message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:**\n<@!"+message.author.id+">, no lockdown started on this channel (#"+message.channel.name+").",footertext:{text:footertxt} }});
		message.channel.send({embed:{title:cmdtitle, color:colors[0], description:"<@!"+message.author.id+">, time left on #"+message.channel.name+"'s lockdown: "+client.lockit[message.channel.id]+".", footertext:{text:footertxt} }});
		return;
	}
	let validUnlocks = ['release', 'unlock', 'lift'];
	if (!time) return message.channel.send({embed:{ title:cmdtitle, color: colors[3], description: `**ERROR:**\n<@!${message.author.id}>, you must set a duration for the lockdown in either hours, minutes or seconds.`, footer:{text:footertxt} }});

	if (validUnlocks.includes(time)) {
		if(!client.lockit[message.channel.id]) return message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:**\n<@!"+message.author.id+">, no lockdown started on this channel (#"+message.channel.name+").",footertext:{text:footertxt} }});
		message.channel.overwritePermissions(message.guild.id, { SEND_MESSAGES: null }).then(() => {
			message.channel.send({embed:{ title:cmdtitle, color: colors[1], description: `<@!${message.author.id}>,\n:unlock: **|** The lockdown on #${message.channel.name} was lifted.`, footer:{text:footertxt} }});
			clearTimeout(client.lockit[message.channel.id]);
			delete client.lockit[message.channel.id];
		}).catch(error => {
			message.channel.send({embed:{ title:cmdtitle, color: colors[3], description: "**ERROR:**\n<@!"+message.author.id+">, "+error, footer:{text:footertxt} }});
			console.log(error);
		});
		return;
	} else {
		message.channel.overwritePermissions(message.guild.id, {
			SEND_MESSAGES: false
		}).then(() => {
			message.channel.send({embed:{ title:cmdtitle, color: colors[1], description: `<@!${message.author.id}>,\n:lock: **|** Lockdown has successfully started on #${message.channel.name} for ${ms(ms(time), { long:true })}.`, footer:{text:footertxt} }}).then(() => {
				client.lockit[message.channel.id] = setTimeout(() => {
					message.channel.overwritePermissions(message.guild.id, {
						SEND_MESSAGES: null
					}).then(message.channel.send({embed:{ title:cmdtitle, color: colors[1], description: `:unlock: **|** The lockdown on #${message.channel.name} expired and was automatically lifted.`, footer:{text:footertxt} }})).catch(console.error);
						delete client.lockit[message.channel.id];
				}, ms(time));

			}).catch(error => {
				message.channel.send({embed:{ title:cmdtitle, color: colors[3], description: "**ERROR:**\n<@!"+message.author.id+">, "+error, footer:{text:footertxt} }});
				console.log(error);
			});
		});
		return;
	}
}