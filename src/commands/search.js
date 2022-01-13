// Additional libraries:
const Google = require('google');

Google.resultsPerPage = 5;



//colors     ===BLUE=======LIME=====YELLOW======RED========
var colors = [ "3447003", "65280", "16312092", "15158332" ];

exports.run = (client, message, footertxt) => {

	var args = message.content.split(" ");
	var object = args.slice(1).join(" ");

	// Google stuff

	message.channel.send({embed:{title:"<a:aero_busy:437003746447458304>",color:colors[0],description:"Please wait, searching Google for \""+object+"\"...\nIf the search result doesn't appear, an error has occurred." }}).then(msg => {
		Google(object, function (err, res) {
			msg.delete();
			if(err) console.log(err);

			var fresult = "";
			for (var i = 0; i < res.links.length; ++i) {
				var results = res.links[i];
				fresult += results.title+"\n**"+results.href+"**\n"+results.description;
			}
			if(!fresult || fresult == null) {
				message.channel.send({embed:{
					title:"TCG Bot | Google > Results for " + object,
					color:colors[3],
					description:"No search result found.",
					footer:{text:footertxt}
				}});
				return;
			}
			message.channel.send({embed:{
				title:"TCG Bot | Google > Results for "+object,
				color:colors[0],
				description:`**OK, I found this on the web for ${object}. Take a look:**\n\n${fresult}`,
				footer:{text:footertxt}
			}});
		});
	});
}