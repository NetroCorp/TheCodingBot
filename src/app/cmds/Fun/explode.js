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
        var target = message.mentions.users.first() || args.slice(0).join(" "),
            sender = message.author;
        if (!target) return app.functions.msgHandler(message, { content: "You need to add something to explode!!" }, 0, true);
        else if (target == sender) return app.functions.msgHandler(message, { content: "Why would you want to send a bomb to yourself???" }, 0, true);


        var embed = {
                author: { name: `Bomb sent by ${app.functions.pomeloHandler(sender)}`, icon_url: sender.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) },
                color: app.config.system.embedColors.blue,
                fields: [
                    { name: "BOOM!", value: `${target} has been kaboom'd!` },
                    { name: "But, uh...", value: "That explosion made a huge mess..." }
                ]
            },
            url = (app.config.system.imgAPI + "explosion");

        const res = await app.modules["node-fetch"](url);
        try {
            if (res.status != 200) {
                throw new Error(res.status);
            } else {
                const body = await res.json();
                if (body["url"] != null)
                    embed["image"] = { url: body["url"] };
            };
        } catch (Ex) {
            app.logger.error("SYS", `Failed fetch of image: ${(url)} | ${Ex.message}`);
        };
        return app.functions.msgHandler(message, {
            embeds: [embed]
        });
    }
}