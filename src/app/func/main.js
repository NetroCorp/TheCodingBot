//
// TheCodingBot
// Netro Corporation
//
// https://codingbot.gg

class main {
	constructor(app) {
		this.app = app;
	}
	sleep = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)); };
	clearCache = (mod) => {
		if (!mod) Object.keys(require.cache).forEach(function(key) { delete require.cache[key] });
		else delete require.cache[mod];
	};

	getID = (string) => { return string.replace(/[<#@&!>]/g, ''); };
	getTicks = () => { return ((new Date().getTime() * 10000) + 621355968000000000); };

	attachmentGrabber = (attachment) => {
		const imageLink = attachment.split(".");
		const typeOfImage = imageLink[imageLink.length - 1];
		const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage); // ew regex, but its ok
		return (image) ? attachment : "";
	};
	removeFromArr = (arr, value) => { return arr.filter(e => e !== value); };
	isAnimated = (str) => { return str.substring(0, 2) === 'a_'; };

	fetchFromAPI = (APIType, endpointURL) => {
		if (!APIType || !endpointURL) return "Missing argument " + (!APIType ? "APIType" : "endpointURL") + "!";
		let baseURL = "";

		if (APIType == 1) baseURL = "https://api.netrocorp.net/v1";
		else if (APIType == 2) baseURL = "https://api.github.com";
		else return "APIType unknown.";

		return new Promise(async(resolve, reject) => {
			let response = null;
			try {
				response = await this.app.dependencies["node-fetch"](baseURL + endpointURL);
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
};

module.exports = function(app) { return new main(app) }