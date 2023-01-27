//
// TheCodingBot
// Netro Corporation
//
// https://codingbot.gg

class updateChecker {
	constructor(app) {
		this.app = app;
		this.timer = null;
	}

	checkUpdates = () => {
		this.app.log.info("SYSTEM", "Checking for updates...");
		try {
			this.app.log.debug("SYSTEM", "Pulling from GitHub API...");

			let repo = process.env.UPDATER_CHECK_REPO;
			// let ghURL = `/repos/${repo}/${(this.app.debugMode) ? "commits/v6" : "releases/latest" }`;
			let ghURL = `/repos/${repo}/releases/latest`;
			this.app.functions.fetchFromAPI(2, ghURL).then((response) => {
				let data = response.data;
				if (!data) throw new Error("Failed to JSON data!!");
				else if (!data.name) throw new Error("Failed to get the release data!!");

				let latestVer = data.name.replace("v", "");
				let yourVer = this.app.version.toString();

				const verString = `New version: ${latestVer}\nYour version: ${yourVer}\nDownload at: https://github.com/${repo}/releases/${data.name}`;

				let isUpdate = 0; // 0 = latest, 1 = new update

				if (yourVer.replaceAll(".", "") < latestVer.replaceAll(".", "")) isUpdate = 1;

				if (isUpdate == 1) this.app.log.info("SYSTEM", `There is a new update!\n${verString}`)
				else return this.app.log.info("SYSTEM", `No updates! You're running the latest version!`);
			}).catch((response) => { this.app.log.error("SYSTEM", `Something went wrong while checking for updates! ${(response.message) ? response.message : response.error}`); });
		} catch (Ex) {
			this.app.log.error("SYSTEM", `Something went wrong while checking for updates! ${Ex.message}`);
		};
	}

	init = async(checkNow = true) => {
		if (process.env.UPDATER_CHECK_ENABLED != "true") return;
		this.timer = setInterval(() => this.checkUpdates(), ((process.env.UPDATER_CHECK_FREQ) * 1000));
		if (checkNow) await this.checkUpdates(); // Go ahead and check now!
	}

	stop = () => clearInterval(this.timer);

}

module.exports = function(app) { return new updateChecker(app) }