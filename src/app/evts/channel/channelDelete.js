/*
	TheCodingBot v6
	https://tcb.nekos.tech
*/

module.exports = {
	name: "channelDelete",
	description: "Emits when a channel is deleted.",
	author: ["Aisuruneko"],

	execute: async(app, oChannel) => {
		const guild = oChannel.guild;
		const serverInfo = await app.DBs[app.name].serverSettings.findOne({ where: { serverID: guild.id } });
		const logging = await app.DBs[app.name].logging.findOne({ where: { serverID: guild.id } });
		if (!serverInfo || !logging) return;

		const logChannel = logging.get("guildLog") ? guild.channels.cache.get(logging.get("guildLog")) : null;
		if (!logChannel) return;

		var embed = {
			author: { name: `${guild.name} (${guild.id})`, iconURL: guild.iconURL({ format: "png", size: 1024 }) },
			title: "Channel Deleted",
			color: app.config.system.embedColors.red,
			description: `There are now ${guild.channels.cache.size} channels.`,
			fields: [
				{ name: "Name", value: oChannel.name, inline: true },
				{ name: "ID", value: oChannel.id, inline: true },
				{ name: "Deleted At", value: new Date(oChannel.createdTimestamp).toString() }
			],
			footer: { text: app.config.system.footerText }
		};

		const { AuditLogEvent } = app.modules["discord.js"];
		const fetchedLogs = await guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.ChannelDelete,
		});
		const auditLog = fetchedLogs.entries.first();
		if (!auditLog) return logChannel.send({ embeds: [ embed ] });
		const { executor, target } = auditLog;

		embed.fields.push({ name: "Deleted by", value: `${executor.tag} (${executor.id})` });
		embed.thumbnail = { url: executor.displayAvatarURL({ format: "png", size: 1024 }) };
		logChannel.send({ embeds: [ embed ] });
	}
}