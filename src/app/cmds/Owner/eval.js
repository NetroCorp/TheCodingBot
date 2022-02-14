module.exports = {
    name: "eval",
    description: "JavaScript executor.",
    guildOnly: false,
    authorizedGuilds: [],
    hidden: true,
    permissions: ["BOT_OWNER"],
    cooldown: 0,
    aliases: [],
    syntax: [" <JSCode>"],
    execute: async(app, message, args) => {
        function clean(text) { // gotta sweep sweep sweep
            if (typeof(text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else return text;
        };
        try {
            const code = message.content.split(" ").slice(1).join(" ");

            if (message.author.id != app.config.system.owners[0] && code.includes("client.token") || code.includes("tokendata.json")) {
                throw new Error("`Loading tokens/api keys are disallowed on this bot. Please see the true BOT_OWNER for more information.`");
            };

            let evaled = eval(code);

            if (typeof evaled !== "string") evaled = app.modules.util.inspect(evaled);
            if (evaled !== "Promise { <pending> }") {
                var result = [];
                if (evaled == "")
                    result.push({ name: "Execution Result", value: "```js\n\"\"```" });
                else
                    result.push({ name: "Execution Result", value: "```js\n" + clean(evaled) + "```" });
                app.functions.msgHandler(message, {
                    embeds: [{
                        color: app.config.system.embedColors.aqua,
                        fields: result
                    }]
                }, 0, true);
            };
        } catch (err) {
            app.functions.msgHandler(message, {
                embeds: [{
                    color: app.config.system.embedColors.red,
                    fields: [
                        { name: "Execution Failure!", value: "```js\n" + err.message + "```" }
                    ]
                }]
            }, 0, true);
            app.logger.warn("SYS", `[EVAL] ${err.message}\n${err.stack}`);
        };
    }
};