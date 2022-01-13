//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];

exports.run = (client, message, footertxt, prefix) => {

	var num = Math.floor(Math.random() * 6) + 1;
	message.channel.send({embed:{
		title:"TCG Bot | Roll-A-Dice",
		color:colors[0],
		description:"You rolled a "+num+"/6",
		footer:{text:footertxt}
	}});
}