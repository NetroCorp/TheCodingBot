/*
 * TheCodingBot v6
 * codingbot.gg
 * (c) 2023 Netro Corporation
*/

const meta = () => {
	return {
		name: "Functions",
		description: "Common functions helper."
	};
};

const crypto = require("crypto");

class Functions {

    constructor (bot) {
		this.bot = bot;
    };

	sleep = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)); };
	clearCache = (mod) => {
		if (!mod) Object.keys(require.cache).forEach(function(key) { delete require.cache[key] });
		else delete require.cache[mod];
	};

	getID = (string) => { return string.replace(/[<#@&!>]/g, ""); };
	getTicks = () => { return ((new Date().getTime() * 10000) + 621355968000000000); };

	removeFromArr = (arr, value) => { return arr.filter(e => e !== value); };
	isAnimated = (str) => { return str.substring(0, 2) === "a_"; };

	checkIfEmpty = (str) => { return (!str || str.length === 0 || /^\s*$/.test(str)) };
	capitalizeFirstWord = (s) => { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; };

	attachmentGrabber = (attachment) => {
		const imageLink = attachment.split(".");
		const typeOfImage = imageLink[imageLink.length - 1];
		const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage); // ew regex, but its ok
		return (image) ? attachment : "";
	};

	fetchFromAPI = (endpointURL, options, extras) => {
		if (!endpointURL) return "Missing argument endpointURL!";
		return new Promise(async(resolve, reject) => {
			let response = null;
			if (!options) options = {};
			if (!options.headers) options.headers = {
				"User-Agent": `${this.bot.config.discord.clientName} DiscordBot/${this.bot.version.getFull().replaceAll(" ", "_")}`
			};
			try {
				response = await this.bot.utils.fetch(`${this.bot.config.apis.base}/${endpointURL}`, options);
				if (response.status != 200) throw new Error("Server returned HTTP Status " + response.status);
				resolve({
					status: "OK",
					data: await response.json(),
					response
				});
			} catch (err) {
				reject({
					status: "NOT OK",
					message: err.message,
					response
				});
			};
		});
	};

	convertTimestamp = (unix_timestamp, getDate, bigHour = false) => {
		const date = new Date(unix_timestamp * 1);
		const hours = date.getHours();
		const minutes = date.getMinutes().toString().padStart(2, '0');
		const seconds = date.getSeconds().toString().padStart(2, '0');

		let formattedTime = `${bigHour ? (hours > 12 ? hours - 12 : hours === 0 ? 12 : hours) : hours}:${minutes}:${seconds}${bigHour ? (hours < 12 ? ' AM' : ' PM') : ''}`;

		if (getDate) {
			const dd = String(date.getDate()).padStart(2, '0');
			const mm = String(date.getMonth() + 1).padStart(2, '0');
			const yyyy = date.getFullYear();
			formattedTime = `${mm}/${dd}/${yyyy} ${formattedTime}`;
		}

		return formattedTime;
	};

	genError = async(interaction, Ex) => {
		
		Ex.rawData = {
			interactionCommand: interaction.commandName,
			interactionOptions: interaction.options,
			interactionUser: {
				id: interaction.user.id,
				guildId: interaction.guild ? interaction.guild.id : undefined,
				channelId: interaction.channel ? interaction.channel.id : undefined,
			}
		};
		// Log error.
		this.bot.logger.error("SYSTEM", `Unexpected error during execution of ${interaction.commandName} for ${interaction.user.id}`);

		const errEmbed = {
			title: `${this.bot.config.emojis.error} An error occurred during execution of ${interaction.commandName}.`,
			color: this.bot.config.colors.red,
			fields: [
				{ name: "Error", value: Ex.message || "Unknown Error" }
			]
		};

		const moreDetails = "...\n(Check CONSOLE for more.)";
		const MAX_STACK_DETAILS = 256;
		if (Ex.stack && this.bot.config.debug) errEmbed.fields.push({
			name: "Stacktrace", value: (Ex.stack.length >= MAX_STACK_DETAILS ? (Ex.stack.substring(0, MAX_STACK_DETAILS) + moreDetails) : Ex.stack)
		});

		// RefID
		const refID = await new this.bot.utils.error(this.bot).log(Ex);
		if (refID) errEmbed.fields.push({
			name: "RefID", value: `\`${refID}\``, inline: true
		});

		// Support server
		errEmbed.fields.push({
			name: "Support", value: this.bot.config.discord.supportInviteBase, inline: (refID != null)
		});

		console.log(Ex);

		return errEmbed;
	}
};

module.exports = (bot) => {
	return {
		meta,
		execute: Functions
	}
};