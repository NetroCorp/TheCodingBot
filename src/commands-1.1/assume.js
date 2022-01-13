//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];
var cmdtitle = "TCG Bot | Assume the Position v1.0";
const TCG = "222073294419918848";
const ZarvoxNad = "357645434354794497";
const megaMan = "391417866244718593";
const ROFL = "271086062976237569";
const nkrs200 = "201602260126400512";
const DoubleT = "353287289021005827";

exports.run = (client, message, footertxt, prefix) => {
	let cont = message.content.slice(prefix.length).split(" ");
	let args = cont.slice(2);
	if(!args || args == null || args == "" || args == " ") {message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:** You did input who should assume the position.", footer:{text:footertxt} }}); return;}else
	//if(args == "TheCodingGuy" || args.join(" ").includes("TCG") || args.join(" ").includes("tcg") || args.join(" ").includes("Matt") || args == "<@!"+TCG+">") {message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:** :b: You cannot make my bot owner assume the position.", footer:{text:footertxt} }}); return;}else
	if(args == "Nadeko" || args == "Zarvox" || args == "<@!"+ZarvoxNad+">") {message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:** You cannot make my good bot friend assume the position.", footer:{text:footertxt} }}); return;}else
	if(args.join(" ").includes("bacon") || args.join(" ").includes("Bacon")) {message.channel.send({embed:{title:cmdtitle, color:colors[0], description: args.join(" ")+", please assume the bacon position. Bacon bacon. Needs more bacon. Assume the position for Bacon.", footer:{text:footertxt} }}); return; }else
	if(args.join(" ").includes("DoubleT") || args.join(" ").includes("Double-T") || args.join(" ").includes("RealTT") || args.join(" ").includes("mega") || args.join(" ").includes("ROFL") || args.join(" ").includes("nkrs") || args.join(" ").includes("<@!"+ROFL+">") || args.join(" ").includes("<@!"+nkrs200+">") || args.join(" ").includes("<@!"+megaMan+">") || args.join(" ").includes("<@!"+DoubleT+">")) {message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:** You cannot make my good friend assume the position.", footer:{text:footertxt} }}); return;}else
	if(args.join(" ") == "TCG Bot" || args.join(" ").includes("<@!438532019924893707>")) {message.channel.send({embed:{title:cmdtitle, color:colors[3], description:"**ERROR:** You cannot make me assume the position.", footer:{text:footertxt} }}); return;}else
	if(args.join(" ").includes(message.author) || args.join(" ").includes(message.author.id)) { message.channel.send({embed:{title:cmdtitle, color:colors[2], description:"Now, why make yourself assume the positon? Try someone else.",footer:{text:footertxt} }}); return; };
	message.channel.send({embed:{title:cmdtitle, color:colors[0], description: args.join(" ")+", please assume the position.", footer:{text:footertxt} }}); 
}