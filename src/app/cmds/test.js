/*
	TheCodingBot v6
	https://tcb.nekos.tech
*/

module.exports = {
    name: "test",
    description: "Test command.",
    author: ["Aisuruneko"],

    execute: async(app, interaction) => {
        interaction.followUp({ content: "Hello world!" });
    }
}