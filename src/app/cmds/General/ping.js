//
// TheCodingBot
// Netro Corporation
//
// https://codingbot.gg

class command {
	constructor() {
	}

	meta = () => {
		return {
			name: "ping",
			description: "Bot Status",
			author: "Aisuruneko",
			version: "1.0.0",

			supportsPrefix: true,
			supportsSlash: true,

			options: [],
			permissions: {
				DEFAULT_MEMBER_PERMISSIONS: ["SendMessages"]
			}
		};
	}

	slashRun = async(app, interaction) => {
		await interaction.reply(this.execute(app));
	}

	messageRun = async(app, message) => {
		await message.reply(this.execute(app));
	}

	execute = (app) => {
		let eFields = [];
		let data = [((app.client.shard) ? app.client.shard.ids : 0), app.client.ws.status, app.client.guilds.cache.size, app.client.ws.ping],
			statusTypes = [
				"READY",
				"CONNECTING",
				"RECONNECTING",
				"IDLE",
				"NEARLY",
				"DISCONNECTED",
				"WAITING FOR GUILDS",
				"IDENTIFYING",
				"RESUMING"
			];
		eFields.push({
			name: app.client.shard ? `Shard ${data[0]}/${app.client.shard.count}` : "Current Status",
			value: `📶 **Status**: ${statusTypes[data[1]]}\n` +
				`🖥️ **Servers**: ${data[2]}\n` +
				`🏓 **Ping**: ${data[3]}ms`
		});
		
		return {
			embeds: [{
				title: "Bot Status",
				color: app.system.embedColors.blue,
				fields: eFields,
				footer: { text: app.footerText }
			}]
		};
	}
}

module.exports = function() { return new command() }