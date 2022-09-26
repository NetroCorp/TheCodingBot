/*
	TheCodingBot v6
	https://tcb.nekos.tech
*/

module.exports = {
	name: "guildMemberUpdate",
	description: "Emits when a guild member is updated.",
	author: ["Aisuruneko"],

	execute: async(app, oMember, nMember) => {
		const guild = oMember.guild;
		const serverInfo = await app.DBs[app.name].serverSettings.findOne({ where: { serverID: guild.id } });
		const logging = await app.DBs[app.name].logging.findOne({ where: { serverID: guild.id } });
		if (!serverInfo || !logging) return;

		const logChannel = logging.get("guildLog") ? guild.channels.cache.get(logging.get("guildLog")) : null;
		if (!logChannel) return;
	}
}