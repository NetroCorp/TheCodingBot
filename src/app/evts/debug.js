module.exports = (app, data) => {
    if (app.debugMode) {
        if (app.logger)
            app.logger.debug("DISCORD", data);
        else
            console.log(data);
    };
};