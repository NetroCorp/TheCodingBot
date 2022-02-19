module.exports = async(app, oldGuild) => {
    app.logger.info("DISCORD", `Removed from the server: ${oldGuild.name} (${oldGuild.id}).`);
};