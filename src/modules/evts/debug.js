module.exports = (app, data) => {
    if (app.debugMode) {
        if (app.logger)
            app.logger.log("i", "DISCORD", data);
        else
            console.log(data);
    };
};