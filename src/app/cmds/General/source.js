module.exports = {
    name: "source",
    description: "A link to the source for the bot!",
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
            title: app.config.system.emotes.information + " Source",
            color: app.config.system.embedColors.green,
            fields: [
                { name: "OwO? Source Code?!?", value: `The source code for TheCodingBot can be found [here](https://codingbot.gg/source)!` }
        ]}]
    })
}}
