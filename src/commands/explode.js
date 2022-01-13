//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];
var cmdtitle = "TCG Bot | Exploder v1.0";
const TCG = "222073294419918848";

exports.run = (client, message, footertxt, prefix) => {
	let cont = message.content.split(' ');
	let args = cont.slice(1);
	if(!args || args == null || args == "" || args == " ") {message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:** You did not input what or who should go boom.", footer:{text:footertxt} }}); return;}else
	if(args.join(" ").includes("TheCodingGuy") || args.join(" ").includes("TCG") && !args.join(" ").includes("Bot") || args.join(" ").includes("tcg") || args.join(" ").includes("Matt") || args.join(" ").includes(TCG)) {message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:** :b: You cannot make my bot owner go boom.", footer:{text:footertxt} }}); return;}else
	if(args.join(" ").includes("TCG Bot") || args.join(" ") == "<@!438532019924893707>") {message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:** You cannot make me go kaboom.", footer:{text:footertxt} }}); return;}else
	if(args.join(" ").includes(message.author) || args.join(" ").includes(message.author.id)) { message.channel.send({embed:{title:cmdtitle, color:colors[2], description:"Now, why make yourself go kaboom? Try someone or something  else.",footer:{text:footertxt} }}); return; };
	message.channel.send({embed:{title:cmdtitle, color:colors[0], description: "**BOOM**\n"+args.join(" ")+" has exploded into a million pieces.\n:thinking: **|** What a mess.", footer:{text:footertxt} }}); 
}