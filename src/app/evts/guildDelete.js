module.exports = async(app, oldGuild) => {
    app.logger.debug("DISCORD", `Removed from the server ${oldGuild.name} (${oldGuild.id}).`);
    app.client.guildInvites.delete(guild.id);
};