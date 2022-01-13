//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];

exports.run = (client, message, footertxt) => {

	function ErrorHandler(Error) {
		message.channel.send({embed:{
			title: "TCG Bot | ERROR",
			color: colors[3],
			description: `**Sorry, but an error has occurred.**\n**ERROR:** ${Error}\n\n**If you believe this is an error that restricts the bot functionality, please report it to TheCodingGuy#6697.**`,
			footer:{text: footertxt}
		}});
	}

	if (message.guild === null) {
		ErrorHandler("You cannot run this command in a DM.");
		return;
	}
	var pruarg = message.content.split(' ');
	var messages = "1";
	if(pruarg[2]) { messages = pruarg[2]; }
	console.log(`${message.author.username} wanting to delete ${messages} messages.`);
	if (!message.channel.permissionsFor(message.author).has("MANAGE_MESSAGES")) {
		ErrorHandler("User does not have permission: MANAGE MESSAGES.");
		console.log("Sorry, you don't have the permission to execute the command \""+message.content+"\"");
		return;
	} else if (!message.channel.permissionsFor(client.user).has("MANAGE_MESSAGES")) {
		ErrorHandler("Bot does not have permission: MANAGE MESSAGES.");
		console.log("Bot doesn't have the permission MANAGE MESSAGES to prune.");
		return;
	}
		message.delete();
		if (message.channel.type == 'text') {
			message.channel.fetchMessages()
		.then( () => {
			message.channel.bulkDelete(messages);
			messagesDeleted = messages; // number of messages deleted

			// Logging the number of messages deleted on both the channel and console.
			if(messages == "1"){ msgwithornots = "message" } else { var msgwithornots = "messages" }
			message.channel.send({embed:{title:"TCG Bot | Prune Successful",color:colors[1],description:`Deletion of messages successful.\nDeleted **${messages}** ${msgwithornots}.`,footer:{text:footertxt} }})
			.then(msg => { setTimeout(function() { msg.delete(0); }, 4000); });
			console.log('Deletion of messages successful. Total messages deleted: '+messagesDeleted);
		}).catch(err => {
			console.log('Error while doing Bulk Delete');
			console.log(err);
			ErrorHandler(err);
		});
	}
};