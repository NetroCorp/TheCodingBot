module.exports = {
    name: "yttogether",
    description: "Generate a YouTube Together [BETA] link!",
    guildOnly: true,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["STREAM"],
    cooldown: 30,
    aliases: ["ytnchill", "watchyt"],
    syntax: [],
    execute: async(app, message, args) => {
        function title(emoji) { var response = app.config.system.emotes[emoji] + " **YouTube Together**"; return response; };

        if (!message.guild) { app.functions.msgHandler(message, { content: `${title("error")}\nYou cannot execute this in DMs!` }, 0, true); return; }
        var channel = message.member.voice.channel;
        if (!channel) { app.functions.msgHandler(message, { content: `${title("error")}\nPlease join a voice channel first!!` }, 0, true); return; }

        app.functions.msgHandler(message, { content: title("wait") + "\nGenerating link, please wait." }, 0, true, (m => {
            app.modules["node-fetch"](`https://discord.com/api/v9/channels/${channel.id}/invites`, {
                method: "POST",
                body: JSON.stringify({ max_age: 86400, max_uses: 0, target_application_id: "755600276941176913", target_type: 2, temporary: false, validate: null }),
                headers: {
                    "Authorization": `Bot ${app.client.token}`,
                    "Content-Type": "application/json"
                }
            }).then(res => res.json()).then(invite => {
                if (!invite.code) {
                    m.edit(`${title("error")}\nSorry, something went wrong and I could create the link.`);
                } else if (invite.code == 10003) {
                    m.edit(`${title("error")}\nSorry, I could not find the channel.`);
                } else m.edit(`${title("success")}\nLink generated!\nhttps://discord.com/invite/${invite.code}`);
                return;
            });
        }));
    }
};