module.exports = {
    name: "test",
    description: "Testing testing, is this thing on?",
    guildOnly: false,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["DEFAULT"],
    cooldown: 2,
    aliases: [],
    syntax: [],
    execute: async(app, message, args) => {
        app.functions.msgHandler(message, { content: "Hello!" }, 0, true);
    }
};