//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];

exports.run = (client, message, footertxt) => {

	if(message.guild == null) return message.channel.send({embed:{title:"TCG Bot | Error", color:colors[3], description:"You cannot use this command in DMs.", footer:{text:footertxt} }});

	var usercount = message.guild.members.filter(member => !member.user.bot).size;
	var botcount = message.guild.memberCount - usercount;

	message.channel.send({embed:{
		title:`TCG Bot | Server Info > Information for ${message.guild.name}`,
		color: colors[0],
		description:`**Guld name:** ${message.guild.name}\n**Guild ID:** ${message.guild.id}\n**Server icon:** ${message.guild.iconURL}\n**Owner:** ${message.guild.owner}\n**Role count:** ${message.guild.roles.size}\n**Channel count:** ${message.guild.channels.size}\n**Member count:** ${message.guild.memberCount} [**Bots:** ${botcount} **Users:** ${usercount}]\n**Large Server? (more than 250 members):** ${message.guild.large}\n**Region:** ${message.guild.region}\n**Verification Level:** ${message.guild.verificationLevel}\n**Server Created At:** ${message.guild.createdAt}\n**TCG Bot joined at:** ${message.guild.joinedAt}`,
		footer:{text:footertxt}
	}});
};