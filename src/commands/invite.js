//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];

exports.run = (client, message, footertxt) => {
	message.channel.send({embed:{title:"TCG Bot | Add Me",color:colors[0], description:"Add me into your server today!\nhttps://discordapp.com/oauth2/authorize?client_id=438532019924893707&scope=bot&permissions=54000704",footer:{text:footertxt} }});
}