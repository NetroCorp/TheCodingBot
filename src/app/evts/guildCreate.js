module.exports = async(app, newGuild) => {
    app.logger.debug("DISCORD", `Added to the server ${newGuild.name} (${newGuild.id}).`);
    newGuild.invites.fetch().then(guildInvites => {
        app.client.guildInvites.set(newGuild.id, new Map(guildInvites.map((invite) => [invite.code, invite.uses])));
    })
};