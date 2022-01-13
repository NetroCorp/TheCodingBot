//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];

exports.run = (client, message, footertxt) => {
	var responses = ["I love Ping-Pong. Let's keep going.", "I missed the ball. You win.", "What did I say again?", "A fun-pack inside every ping.", "Oh... uh... My paddle is getting red." ]
	var APIPing = Math.round(client.ping);
	// var APIPing = "0"; // Testing
	if (APIPing == "0") { msg = "YA... right..."; } else
	if (APIPing < 0) { msg = "OK, what? Not a positive number! Ahhh!"; } else
	if (APIPing > 2000 || APIPing == 2000) { msg = "Discord or the hoster's machine is slow or unstable."; } else
	if (APIPing > 500 || APIPing == 500) { msg = "Whoa. Getting slow there..."; } else
	if (APIPing < 500) { msg = "Fast, I suppose."; } else
	if (APIPing < 50 || APIPing == 50) { msg = "WHOA! LIGHTNING FAST... almost.";
	} else { msg = "Hmm... unable to create message based on ping."; }
	message.channel.send(":ping_pong: Waiting for the ball...!").then(m => {
	m.edit({embed: {
			title: "TCG Bot | Ping-Pong",
			color: colors[0],
			description: `:ping_pong: Pong! ${responses[Math.floor(Math.random() * responses.length)]}\nLatency: ${m.createdTimestamp - message.createdTimestamp}ms.\nAPI Latency: ${APIPing}ms.\n${msg}`,
			footer:{text:footertxt}
		}});
	});
};