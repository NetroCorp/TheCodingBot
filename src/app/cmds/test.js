module.exports = {
    name: "test",
    description: "Testing testing, is this thing on?",
    category: "General",
    guildOnly: false,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["DEFAULT"],
    cooldown: 2,
    aliases: [],
    syntax: [],
    execute: async(app, message, args) => {
        // message.channel.send(app.config.system.emotes.information + " **Ya, I'm alive.**");
        app.functions.msgHandler(message, { content: "Hello!" }, 0, true);
    }
};