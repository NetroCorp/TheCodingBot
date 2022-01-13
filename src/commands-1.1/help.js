//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];

exports.run = (client, message, footertxt, prefix) => {
	var responses = [prefix+" help\n",
	prefix+" ping\n",
	prefix+" 8ball **question**\n",
	prefix+" assume **person**\n",
	prefix+" invite\n\n",
	"**CURRENCY (in TheCodingBytes [TCB]**\n",
	prefix+" bytes-create\n",
	prefix+" bytes-bal\n",
	prefix+" write\n\n",
	"**ADMINISTRATION**\n",
	prefix+" prune **number-to-delete**"];
	
	message.channel.send({embed: {
		title: "TCG Bot | Command Help",
		color: colors[0],
		description: `__**Welcome to the new TCG Bot Command Help.**__\nWe hope you enjoy your experience with TCG Bot.\n\n${responses.join("")}\n`,
		footer:{text:footertxt}
	}});
};