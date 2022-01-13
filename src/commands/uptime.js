exports.run = (client, message, footertxt) => {

	let totalSeconds = (client.uptime / 1000);
	let hours = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600;
	let minutes = Math.floor(totalSeconds / 60);
	let seconds = totalSeconds % 60;

	let uptime = `${hours} hours, ${minutes} minutes and ${Math.round(seconds)} seconds`;
	message.channel.send({embed:{
		title: "TCG Bot | Uptime",
		color: 65280,
		description: "I have online for: "+uptime,
		footer:{text:footertxt}
	}});
	return;

}