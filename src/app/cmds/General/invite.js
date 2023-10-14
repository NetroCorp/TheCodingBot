module.exports = {
    name: "invite",
    description: "Add me to yo server!",
    guildOnly: false,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["DEFAULT"],
    cooldown: 2,
    aliases: [],
    syntax: [],
    execute: async(app, message, args) => {
        return app.functions.msgHandler(message, {
        embeds: [{
            title: app.config.system.emotes.information + " Invite",
            color: app.config.system.embedColors.green,
            fields: [
                { name: "OwO? New server?!?", value: `Aw heck yeah!! Add me and become one of the ${app.client.guilds.cache.size} servers using TheCodingBot!` },
                { name: "Add me to dat server!", value: `Add me via [Discord](https://discord.com/oauth2/authorize?scope=bot&client_id=${app.client.user.id}&permissions=1644971945207)` },
                { name: "...is something wrong..?", value: "Join the [Netro Corp Discord](https://discord.gg/HdKeWtV) for support, and much more!" },
        ]}]
    })
}}
