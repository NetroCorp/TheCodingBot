//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];

exports.run = (client, message, footertxt, prefix) => {
	let cont = message.content.slice(prefix.length).split(" ");
	let args = cont.slice(2);
	if(!args || args == null || args == "" || args == " ") {message.channel.send({embed:{title:"TCG Bot | 8ball", color:colors[3], description:"**ERROR:** You did not ask a question.", footer:{text:footertxt} }}); return;}
	var responses = ["Totally. You should know that!","Some guy said yes.","Some other guy said no.","TheCodingGuy said no.","TheROFL98 said no.","SnakeSpiderScorpion said no.","megaMan9521 said no.","TheCodingGuy said yes.","TheROFL98 said yes.","SnakeSpiderScorpion said yes.","megaMan9521 said yes.","Yup!","Sure","Nah.","I'm unsure, try asking again?","No.","Yes.","I suppose.","Oops. I forgot what the answer was.","Bacon ate this answer because it contained bacon bacon bacon.","YES OF FREAKING COURSE!","mmhmm.","Uh... no.",":100:% YES",":100:% NO!"]
	var ballmsg = responses[Math.floor(Math.random() * responses.length)];
	message.channel.send({embed:{title:"TCG Bot | 8ball", color:colors[0], description:":question: **Your Question:** "+args.join(" ")+"\n:8ball: **Answer:** "+ballmsg, footer:{text:footertxt} }}); 
}