module.exports = {
    name: "explode",
    description: "MAKE THAT THING GO KABOOM!",
    guildOnly: false,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["DEFAULT"],
    cooldown: 3,
    aliases: [],
    syntax: [],
    execute: async(app, message, args) => {
        var target = message.mentions.users.first() || args[0],
            sender = message.author;
        if (!target) return app.functions.msgHandler(message, { content: "You need to add something to explode!!" }, 0, true);
        else if (target == sender) return app.functions.msgHandler(message, { content: "Why would you want to send a bomb to yourself???" }, 0, true);

        var img = "error";
        const res = await app.modules["node-fetch"](app.config.system.imgAPI + "explosion");

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
                author: { name: `Bomb sent by ${sender.tag}`, icon_url: sender.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) },
                color: app.config.system.embedColors.blue,
                fields: [
                    { name: "BOOM!", value: `${target} has been kaboom'd!` },
                    { name: "But, uh...", value: "That explosion made a huge mess..." }
                ],
                image: { url: img },
                footer: app.config.system.footerText
            }]
        });

        // TODO:
        // write better image detection or something. Yeah. That.
    }
}