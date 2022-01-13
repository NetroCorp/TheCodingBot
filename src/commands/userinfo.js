//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];


exports.run = (client, message, footertxt) => {


	if(message.content == "/userinfo") {
		userinfo(message.author);
		return;
	} else {
		var cont = message.content.split(" ");

		if(message.guild == null) return message.channel.send({embed:{title:"TCG Bot | User Info > Error",color:colors[3],description:"**ERROR:** You cannot get userinfo on other users in DMs yet.",footer:{text:footertxt} }});
		var member = message.mentions.members.first() || message.guild.members.get(cont[1]) || message.member;
		userinfo(member.user);
		return;
	}


	function userinfo(user) {

		// This function allows us to get the userinfo of a user without the repeated coding.

		var userisbot = false;
		var userstatus = "";
		var usergame = "";
		if(user.bot) { userisbot = true; } else { userisbot = false; }
		if(user.presence.status == "offline") { userstatus = "offline"; }
		else {
			if(!user.presence.game || user.presence.game == null) {
				usergame = "";
			} else {
				if(user.presence.game.type == 0) { usergametype = "playing" }
				if(user.presence.game.type == 1) { usergametype = "watching" }
				if(user.presence.game.type == 2) { usergametype = "listening to" }
				usergame = usergametype + " " + user.presence.game.name;
			}
			userstatus = user.presence.status+ " " + usergame;
		}


		message.channel.send({embed:{
			title:`TCG Bot | User Info > Information for ${user.username}`,
			color: colors[0],
			description: `**Username:** ${user.username}#${user.discriminator}\n**User ID:** ${user.id}\n**Avatar URL:** ${user.avatarURL}\n**Bot?:** ${userisbot}\n**Status:** ${userstatus}\n**User Created At:** ${user.createdAt}`,
			footer:{text:footertxt}
		}});
	}
}