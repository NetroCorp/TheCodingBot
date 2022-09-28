module.exports = {
    name: "kiss",
    description: "Smooooch! Awh, what wholesomeness!",
    guildOnly: false,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["DEFAULT"],
    cooldown: 3,
    aliases: [],
    syntax: [" <@MentionOrUserID>"],
    execute: async(app, message, args) => {
        var target = message.mentions.users.first() || args[0],
            sender = message.author;
        if (!target) return app.functions.msgHandler(message, { content: "You need to tag someone to kiss!" }, 0, true);
        else if (target == sender) return app.functions.msgHandler(message, { content: "There there, here's a personal kiss. :)" }, 0, true);

        var embed = {
                color: app.config.system.embedColors.purple,
                description: `**${sender} **kisses** ${target}**!`
            },
            url = (app.config.system.imgAPI + "kiss");

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