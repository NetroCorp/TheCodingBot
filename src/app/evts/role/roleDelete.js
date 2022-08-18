/*
	TheCodingBot v6
	https://tcb.nekos.tech
*/

module.exports = {
	name: "roleDelete",
	description: "Emits when a role is deleted.",
	author: ["Aisuruneko"],

	execute: async(app, oRole) => {
		const guild = oRole.guild;
		const serverInfo = await app.DBs.TheCodingBot.serverSettings.findOne({ where: { serverID: guild.id } });
		const logging = await app.DBs.TheCodingBot.logging.findOne({ where: { serverID: guild.id } });
		if (!serverInfo || !logging) return;

		const logChannel = logging.get("guildLog") ? guild.channels.cache.get(logging.get("guildLog")) : null;
		if (!logChannel) return;

		var embed = {
			author: { name: `${guild.name} (${guild.id})`, iconURL: guild.iconURL({ format: "png", size: 1024 }) },
			title: "Role Deleted",
			color: app.config.system.embedColors.red,
			description: `There are now ${guild.roles.cache.size} roles.`,
			fields: [
				{ name: "Name", value: oRole.name, inline: true },
				{ name: "ID", value: oRole.id, inline: true },
				{ name: "Deleted At", value: new Date(oRole.createdTimestamp).toString() }
			],
			footer: { text: app.config.system.footerText }
		};

		const { AuditLogEvent } = app.modules["discord.js"];
		const fetchedLogs = await guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.RoleDelete,
		});
		const auditLog = fetchedLogs.entries.first();
		if (!auditLog) return logChannel.send({ embeds: [ embed ] });
		const { executor, target } = auditLog;

		embed.fields.push({ name: "Deleted by", value: `${executor.tag} (${executor.id})` });
		embed.thumbnail = { url: executor.displayAvatarURL({ format: "png", size: 1024 }) };
		logChannel.send({ embeds: [ embed ] });
	}
}