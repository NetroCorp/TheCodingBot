module.exports = {
    name: "uwu",
    description: "UwUify some messages... for some reason..?",
    guildOnly: false,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["DEFAULT"],
    cooldown: 10,
    aliases: ["uwuify"],
    syntax: [],
    execute: async(app, message, args) => {
        if (!args[0]) return app.functions.msgHandler(message, "uwu");

        function UwUify(msg) {
            msg = msg.toLowerCase(); // Convert the message to lowercase for now
            const flipList = "ay:ey,ck:cc,ing:in,or:aw,ou:ow,ro:wo,tha:da,the:de,thi:di,wh:w,wr:w,you:yu,mn:m,mb:m,l:w,r:w".split(",").map(i => i.split(":"))
            for (let pair of flipList)
                msg = msg.split(pair[0]).join(pair[1]);
            return msg + ((!msg.endsWith("uwu")) ? " uwu" : "");
        };

        for (var i = 0; i < args.length; i++) {
            if (args[i].includes("<@&") && args[i].includes(">"))
                args[i] = message.guild.roles.cache.get(args[i].replace(/[<@&>]/g, '')).name;
        };
        app.functions.msgHandler(message, UwUify(args.join(" ")) || "Something went wrong :(");
    }
};