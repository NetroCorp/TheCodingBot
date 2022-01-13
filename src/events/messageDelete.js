//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];

function GetTime() {
	var today=new Date();
	var h=today.getHours();
	var m=today.getMinutes();
	var s=today.getSeconds();
	var ampm = "";
	m = checkTime(m);
	s = checkTime(s);

	if (h > 12) { h = h - 12; ampm = " PM"; }
	else if (h == 12){ h = 12; ampm = " PM"; }
	else if (h < 12){ ampm = " AM"; }
	else { ampm = "PM"; };
	if(h==0) { h=12; }
	time = h+":"+m+":"+s+ampm;
}
function GetDate(){
	var d = new Date();
	var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	var month = [d.getMonth()+1];
	var day = d.getDate();
	var year = d.getFullYear();
	date = days[d.getDay()]+" "+month+"/"+day+"/"+year;
}
function checkTime(i) {
	if (i<10) {i = "0" + i};  // add zero in front of numbers < 10
	return i;
}

var messagelog = "";

exports.run = (client, msgdel, footertxt) => {

	GetTime();
	GetDate();
	var message = ``;
	if(msgdel.guild == null) { message = `User: @${msgdel.author.username}#${msgdel.author.discriminator}\nMessage: ${msgdel.content}\nDeleted from: DMs to TCG Bot\nTime deleted: ${time} on ${date}`;
	} else { message = `User: @${msgdel.author.username}#${msgdel.author.discriminator}\nMessage: ${msgdel.content}\nDeleted from: #${msgdel.channel.name} on ${msgdel.guild}\nTime deleted: ${time} on ${date}`; }
	client.channels.get(messagelog).send({embed:{
		title: "TCG Bot | Message Deleted",
		color: colors[3],
		description: `${message}`,
		footer:{text:footertxt}
	}});
	//Created by TCG

}