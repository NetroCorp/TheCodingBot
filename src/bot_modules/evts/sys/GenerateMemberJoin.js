module.exports = async (client, member, channelToSend, messageToSend, inviteInfo) => {
	const fs = require("fs"), Canvas = require("canvas"), snekfetch = require("snekfetch"), Discord = require("discord.js"); // Require all this jazz

	var guild = member.guild, cache = "./bot_modules/imgs/cache", msg1 = `Welcome to the server,`, msg2 = `${member.displayName}!`; // Setup all this extra jazz

	const applyText = (canvas, text) => {
		const ctx = canvas.getContext('2d');
		let fontSize = 70; // Base size for font

		do {
			// Assign the font to the context and decrement it so it can be measured again
			// ctx.font = `${fontSize -= 10}px sans-serif`;
			Canvas.registerFont(cache + "/fonts/NotoSans-Black.ttf", { family: "NotoSans Black" });
			ctx.font = `${fontSize -=10}px "NotoSans Black"`;
		} while (ctx.measureText(text).width > canvas.width - 300); // Compare pixel width of the text to the canvas minus the approximate avatar size

		return ctx.font; // Return the result to use in the actual canvas
	};

	const templateFiles = fs.readdirSync(cache + "/welcome/").filter(file => file.startsWith('Welcome_TEMPLATE') && file.endsWith('.png'));
	var templateFile = "";
	if (templateFiles.length == 0) {
		log("X", "SYS", `Load welcome templates failed!`);
		return channelToSend.send(client.config.system.emotes.error + " **Oop!**\nNo welcome templates found! wtf?!\nError has been reported.");
	} else {
		var templateName = templateFiles[Math.floor(Math.random() * templateFiles.length)];
		// log("i", "SYS", `Load: ${templateName} ...`);
		templateName = templateName.split(".png")[0];
	};
	templateFile = cache + "/welcome/" + templateName + ".png";

	const canvas = Canvas.createCanvas(700, 250), ctx = canvas.getContext('2d'), background = await Canvas.loadImage(templateFile); // Canvas jazz crap

	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#000000'; // Default to black if the image breaks
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	ctx.font = "28px mono";
	ctx.fillStyle = "#cccccc";
	ctx.fillText(msg1, canvas.width / 2.5, canvas.height / 2.4); // "Welcome to the server,"

	ctx.font = applyText(canvas, msg2);
	ctx.fillStyle = "#cccccc";
	ctx.fillText(msg2, canvas.width / 2.5, canvas.height / 1.6); // Username

	// Add in the avatar:
	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const { body: buffer } = await snekfetch.get(member.user.displayAvatarURL({ format: 'png', dynamic: false, size: 1024 }));
	const avatar = await Canvas.loadImage(buffer);
	ctx.drawImage(avatar, 25, 25, 200, 200);

	// We're done! Attachment is ready to go!

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "tcbwhalecome.png");


	messageToSend = messageToSend.replace("%id%", member.user.id); // 001
	messageToSend = messageToSend.replace("%username%", member.user.username); // User
	messageToSend = messageToSend.replace("%userdisc%", member.user.discriminator); // Disc
	messageToSend = messageToSend.replace("%usertag%", member.user.tag); // User#Disc
	messageToSend = messageToSend.replace("%user%", "<@"+member.user.id+">"); // @User
	messageToSend = messageToSend.replace("%server%", member.guild.name); // Server name
	messageToSend = messageToSend.replace("%invitecode%", (inviteInfo["code"] != null ? inviteInfo["code"] : "Unknown")); // Invite code i.e. XXfaFh
	messageToSend = messageToSend.replace("%inviteuses%", (inviteInfo["uses"] != null ? inviteInfo["uses"] : "")); // Invite uses
	messageToSend = messageToSend.replace("%inviter%", (inviteInfo["inviter"]["tag"] != null ? inviteInfo["inviter"]["tag"] : "")); // Inviter person owo
	messageToSend = messageToSend.replace("%inviterid%", (inviteInfo["inviter"]["id"] != null ? inviteInfo["inviter"]["id"] : "")); // Inviter person [ID] owo

	channelToSend.send(messageToSend, { files: [ attachment ]});
};