/*
	TheCodingBot v6
	https://tcb.nekos.tech
*/

class interactions {
	constructor() {
		this.app = null;
		this.fetch = null;
	}

	setContext(app) {
		this.app = app;
		this.fetch = app.modules["node-fetch"];
	}

	getAPI() {
		if (this.app.config == undefined || this.app.config == null) return "NO_CONFIG";
		if (this.app.config.system == undefined || this.app.config.system == null) return "NO_SYS_CONFIG";
		if (this.app.config.system.APIs == undefined || this.app.config.system.APIs == null) return "NO_API_CONFIG";
		if (this.app.config.system.APIs.img == undefined || this.app.config.system.APIs.img == null) return "NO_API_IMG_CONFIG";
		return this.app.config.system.APIs.img;
	}

	getImg(type) {
		return new Promise(async(resolve, reject) => {
			let response = null;
			try {
				response = await this.fetch(this.getAPI() + "/" + type);
				if (response.status != 200) throw new Error("Server returned HTTP Status " + response.status);

				resolve({
					status: "OK",
					data: await response.json(),
					response
				});
			} catch (err) {
				reject({
					status: "NOT OK",
					error: err.message,
					response
				});
			};
		});
	}

	hasPermissions(interaction, command) {
		return (
			command.permissions == "DEFAULT" ||
			interaction.channel.guild != null && command.guildOnly ||
			command.permissions == "BOT_OWNER" && this.app.config.system.owners.includes(interaction.user.id) ||
			this.app.config.system.owners.includes(interaction.user.id) && this.app.client.bypassEnabled ||
			command.permissions != "BOT_OWNER" && interaction.member.permissions.has(command.permissions)
		);
	}
}

// module.exports = interactions;
module.exports = function() { return new interactions() };