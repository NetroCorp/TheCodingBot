module.exports = {
    name: "answer",
    description: "The true meaning of life.",
    guildOnly: false,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["DEFAULT"],
    cooldown: 2,
    aliases: [],
    syntax: [],
    execute: async(app, message, args) => {
        // SHAME ON YOU FOR LOOKING INTO THIS CODE!!! REVEALS SPOILERS AAAAAAAA!

        var rnd = Math.random(), // Math.random() isn't exactly true random but it works ig. 
            answer = "42"; // Normal response.

        if (rnd < 0.01) // 0.1%  chance of sending this >:)
            answer = "Nekos"; // I swear I'm going to get hate for this. Just accept it.
        else if (rnd < 0.05) // 0.5% chance of sending this >:)
            answer = "Niko"; // OneShot joke ig, because why not.
        app.functions.msgHandler(message, answer); // Return response

    }
};