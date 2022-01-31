module.exports = {
	name: "uwu",
	description: "UwUify some messages so you can sound like you want a senpai or something... uwu",
	guildOnly: false,
	authorizedGuilds: [],
	hidden: false,
	permissions: ["DEFAULT"],
	cooldown: 2,
	aliases: ["uwuify"],
	syntax: [" <content>"],
	execute: async(client, message, args) => {

		function UwUify(message) {
			message = message.toLowerCase(); // Convert the message to lowercase for now

			const flipList = "ay:ey,ck:cc,ing:in,or:aw,ou:ow,ro:wo,tha:da,the:de,thi:di,wh:w,wr:w,you:yu,mn:m,mb:m,l:w,r:w".split(",").map(i => i.split(":"))

			for (let pair of flipList) {
				message = message.split(pair[0]).join(pair[1])
			}
			if (!message.endsWith("uwu")) message = message + " uwu";
			return message;
		};

		// message.channel.send("**DEBUG:** " + args.join(" "));
		if (args[0] == null)
			message.channel.send("uwu");
		else {
			var msgContent = args;
			for (var i= 0; i < msgContent.length; i++) {
				if (msgContent[i].includes("<@&") && msgContent[i].includes(">"))
					msgContent[i] = message.guild.roles.cache.get(msgContent[i].replace(/[<@&>]/g, '')).name;
			};

			message.channel.send(UwUify(msgContent.join(" ")));
		};
	},
};