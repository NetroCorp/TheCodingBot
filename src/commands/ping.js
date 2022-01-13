//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];

exports.run = (client, message, footertxt) => {
	var responses = ["Well darn, you got me.","Alright. I wanna do that again.","I loooove Ping-Pong!","Try again?","My paddle is getting a bit red. Is that good?","Let me take a break *sips on water* OK, ready again."];
	var APIPing = Math.round(client.ping);
	//var APIPing = "15000"; // Testing
	if (APIPing == "0") { msg = "YA... right..."; } else
	if (APIPing < 0) { msg = "OK, what? Not a positive number! Ahhh!"; } else
	if (APIPing > 2000 || APIPing == 2000) { msg = "<a:aero_busy:437003746447458304> :snail: Am I even running? Wait, I'm not running now, I'm like snails. Told ya snails-a coming."; } else
	if (APIPing > 500 || APIPing == 500) { msg = ":snail: Snails are incoming."; } else
	if (APIPing < 500) { msg = ""; } else
	if (APIPing < 50 || APIPing == 50) { msg = "WHOA! LIGHTNING FAST... almost.";
	} else { msg = "Hmm... unable to create message based on ping."; }
	message.channel.send("<a:aero_busy:437003746447458304> :ping_pong: **|** Please hold, I'm trying to position myself for the incoming ball!").then(m => {
	m.edit({embed: {
			title: "TCG Bot | Ping-Pong",
			color: colors[0],
			description: `:ping_pong: Pong! ${responses[Math.floor(Math.random() * responses.length)]}\nLatency: ${m.createdTimestamp - message.createdTimestamp}ms.\nAPI Latency: ${APIPing}ms.\n${msg}`,
			footer:{text:footertxt}
		}});
	});
};