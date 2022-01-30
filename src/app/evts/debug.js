module.exports = (app, data) => {
	if (/(Sending a heartbeat|Latency of)/i.test(data)) return null;
	if (app.debugMode) {
		if (app.logger)
			app.logger.debug("DISCORD", data);
		else
			console.log(data);
	};
};