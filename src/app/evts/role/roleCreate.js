/*
	TheCodingBot v6
	https://tcb.nekos.tech
*/

module.exports = {
	name: "roleCreate",
	description: "Emits when a role is created.",
	author: ["Aisuruneko"],

	execute: async(app, nRole) => {
		const guild = nRole.guild;
		const serverInfo = await app.DBs[app.name].serverSettings.findOne({ where: { serverID: guild.id } });
		const logging = await app.DBs[app.name].logging.findOne({ where: { serverID: guild.id } });
		if (!serverInfo || !logging) return;

		const logChannel = logging.get("guildLog") ? guild.channels.cache.get(logging.get("guildLog")) : null;
		if (!logChannel) return;

		var embed = {
			author: { name: `${guild.name} (${guild.id})`, iconURL: guild.iconURL({ format: "png", size: 1024 }) },
			title: "Role Created",
			color: app.config.system.embedColors.lime,
			description: `There are now ${guild.roles.cache.size} roles.`,
			fields: [
				{ name: "Name", value: nRole.name, inline: true },
				{ name: "ID", value: nRole.id, inline: true },
				{ name: "Created At", value: new Date(nRole.createdTimestamp).toString() }
			],
			footer: { text: app.config.system.footerText }
		};

		const { AuditLogEvent } = app.modules["discord.js"];
		const fetchedLogs = await guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.RoleCreate,
		});
		const auditLog = fetchedLogs.entries.first();
		if (!auditLog) return logChannel.send({ embeds: [ embed ] });
		const { executor, target } = auditLog;

		embed.fields.push({ name: "Created by", value: `${executor.tag} (${executor.id})` });
		embed.thumbnail = { url: executor.displayAvatarURL({ format: "png", size: 1024 }) };
		logChannel.send({ embeds: [ embed ] });
	}
}