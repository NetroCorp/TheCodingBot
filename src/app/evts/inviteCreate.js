module.exports = async(app, invite) => {
    if (app.client.guilds.cache.size < 100) // To prevent spam, we'll cap it at 100 to log.
        app.logger.debug("DISCORD", `Invite ${invite.code} with ${invite.uses} uses was created in ${invite.guild.id}. The new invite will be cached.`);
    app.client.guildInvites.get(invite.guild.id).set(invite.code, invite.uses);
};