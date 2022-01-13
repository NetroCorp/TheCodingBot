//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];

exports.run = (client, message, footertxt, prefix) => {
	message.channel.send({embed:{title:"TCG Bot | 8ball",colors:colors[2],description:"<a:aero_busy:437003746447458304> Thinking of a 8ball answer, hang tight.",footer:{text:footertxt} }})
	.then(msg => {
		msg.delete(); // Delete the wait message
		let cont = message.content.slice(prefix.length).split(" ");
		let args = cont.slice(1).join(" ");
		if(!args || args == null || args == "" || args == " ") {message.channel.send({embed:{title:"TCG Bot | 8ball", color:colors[3], description:"**ERROR:** You did not ask a question.", footer:{text:footertxt} }}); return;}
		var responses = [
		"Honestly, I don't know. For real.",
		"I'm unsure, try asking again?",
		"I suppose.","Oops. I forgot what the answer was.",

		"Totally. You should know that!",
		"Green light. Yup!",
		"Let me think about th-Yes.",
		"Oh yeah!",
		"Yup!",
		"Sure.",
		"Yes.",
		"YES OF FREAKING COURSE!",
		"mmhmm.",
		":100:% YES!",
		"The way I see it, I say yes.",

		"No. You should know that!",
		"Red light. No.",
		"Let me think about th-No.",
		"Uh... no.",
		"Nope!",
		"Nah.",
		"No.",
		"NO OF FREAKING COURSE!",
		"Uh-huh.",
		":100:% NO!",
		"The way I see it, I say no."
		];

		var things = [
		"OK",
		"Alright",
		"Sure",
		"Cool",
		"Well",
		"Okay",
		"Hmm",
		"Here it is"
		];

		var thing = things[Math.floor(Math.random() * things.length)];
		var ballmsg = responses[Math.floor(Math.random() * responses.length)];
		var question = "";


		if(args.includes("?")) { question = `"**${args}**"`; } else { question = `"**${args}**?"`; }
		//message.channel.send({embed:{title:"TCG Bot | 8ball", color:colors[0], description:":question: **Your Question:** "+args+"\n:8ball: **Answer:** "+ballmsg+"\n:busts_in_silhouette: **Asker:** "+message.author.username+"#"+message.author.discriminator, footer:{text:footertxt} }}); 
		message.channel.send({embed:{title:"TCG Bot | 8ball", color:colors[0], description: `So, **${message.author.username}#${message.author.discriminator}**, you want to know my response to ${question}\n${thing}, my response is, "**${ballmsg}**"`, footer:{text:footertxt} }}); 
	});

}