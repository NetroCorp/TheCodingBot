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
	var paramsOne = message.content.split(' ');
	if(paramsOne[2] == '1m' || paramsOne[2] == '2m' || paramsOne[2] == '3m' || paramsOne[2] == '4m' || paramsOne[2] == '5m' || paramsOne[2] == '6m' || paramsOne[1] == '7m' || paramsOne[1] == '8m' || paramsOne[1] == '9m' || paramsOne[1] == '1h' || paramsOne[1] == '2h' || paramsOne[1] == '3h' || paramsOne[1] == '4h' || paramsOne[1] == '5h' || paramsOne[1] == '6h' || paramsOne[1] == '7h' || paramsOne[1] == '8h' || paramsOne[1] == '9h') {
            var choice = paramsTwo[0].substr(9)
        } else {
            var choice = paramsTwo[0].substr(10)
        }
        if(!paramsTwo[1]) {
            message.channel.send(":error: - You need to specify 2 options!")
            return
        }
        if(!paramsTwo[2]) {
            message.channel.send(":error: - You need to specify 2 options!")
            return
        }
	let msg = await message.channel.send("**__Poll has started!__**\n__" + choice + "__\n`Time: " + paramsOne[1] + "`\n\n:one: - **" + paramsTwo[1] + "**\n:two: - **" + paramsTwo[2] + "**")
        await msg.react(one)
        await msg.react(two)
        const reactions = await msg.awaitReactions(reaction => reaction.emoji.name === one || reaction.emoji.name === two, {time: time});
        var resultone = reactions.get(one).count-1
        var resulttwo = reactions.get(two).count-1
        if(isNaN(reactions.get(one).count-1)){
            resultone = 0
        }
        if(isNaN(reactions.get(two).count-1)){
            resulttwo = 0
        }
        message.channel.send(`__**Poll Results:**__\n\n:one:: ${reactions.get(one).count-1}\n:two:: ${reactions.get(two).count-1}`)
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