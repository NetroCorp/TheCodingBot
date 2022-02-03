module.exports = {
    name: "softclear",
    description: "Soft clears a chat - by sending several lines of emptiness.",
    guildOnly: true,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["MANAGE_MESSAGES"],
    cooldown: 30,
    aliases: [],
    syntax: [],
    execute: async(app, message, args) => {
        times = args[0] || 1;
        for (var t = 0; t < times; t++) {
            var emptyThing = "** **\n";
            for (var i = 0; i < 332; i++) emptyThing = emptyThing + "** **\n";
            app.functions.msgHandler(message, emptyThing, 0, false);
        };
    }
};