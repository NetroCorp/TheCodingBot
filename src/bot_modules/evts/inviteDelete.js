module.exports = async (client, invite) => {

	// Delete old invite :(
	let invites = await invite.guild.fetchInvites();
	if(invite.guild.vanityURLCode) invites.set(invite.guild.vanityURLCode, await invite.guild.fetchVanityData());
	client.guildInvites.set(invite.guild.id, invite);
};