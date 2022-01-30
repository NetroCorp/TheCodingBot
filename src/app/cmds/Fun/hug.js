module.exports = {
    name: "hug",
    description: "Hug someone and show wholesomeness!",
    category: "Fun",
    guildOnly: false,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["DEFAULT"],
    cooldown: 2,
    aliases: [],
    syntax: [""],
    execute: async(app, message, args) => {
        var target = message.mentions.users.first() || args[0],
            sender = message.author;
        if (!target) return app.functions.msgHandler(message, { content: "You need to tag someone to hug!" }, 0, true);
        else if (target == sender) return app.functions.msgHandler(message, { content: "There there, here's a personal hug. :)" }, 0, true);

        var img = "error";
        const res = await app.modules["node-fetch"](app.config.system.imgAPI + "hug");

        if (res.status != 200) {
            // In the future, we'll use a "fallback" instance
            // where it will send a local image or maybe just the message
            // w/o an image.
            throw new Error(res.status);
        } else {
            const body = await res.json();
            if (body["url"] != null)
                img = body["url"];
            else
                img = "error";
        };
        return app.functions.msgHandler(message, {
            embeds: [{
                color: app.config.system.embedColors.blue,
                description: `**${sender}** gave **${target}**, a hug!`,
                image: { url: img },
                footer: app.config.system.footerText
            }]
        });

        // TODO:
        // write better image detection or something. Yeah. That.
    }
}