module.exports = {
    name: "emocreate",
    description: "Adds one of your amazing emojis",
    guildOnly: true,
    authorizedGuilds: [],
    hidden: false,
    permissions: ["MANAGE_EMOJIS"],
    cooldown: 2,
    aliases: ["addemo", "addemote"],
    syntax: [
        "[UploadImage] [EmojiName]"
    ],
}