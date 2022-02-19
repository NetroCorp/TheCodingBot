module.exports = async(app, invite) => {
    if (app.client.guilds.cache.size < 100) // To prevent spam, we'll cap it at 100 to log.
        app.logger.debug("DISCORD", `Invite ${invite.code} with ${invite.uses} uses was deleted from ${invite.guild.id}. Removing from cache...`);
    app.client.guildInvites.get(invite.guild.id).delete(invite.code);
};