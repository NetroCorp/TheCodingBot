/*
 * TheCodingBot v6
 * codingbot.gg
 * (c) 2023 Netro Corporation
*/

const meta = () => {
	return {
		name: "Error Handler",
		description: "Handles error things."
	};
};

const fs = require("fs");
const crypto = require("crypto");

class ErrorLog {

    constructor (bot) {
		this.bot = bot;
		this.logLocation = `${__dirname}/../../errors`;
    };

	log = (error) => {
		// This is where we want to create a reference number so that support can find
		//  the error once provided and someone can fix it :)
		let refID;

		const { message, stack, rawData } = error;

		const errData = {
			message,
			stack,
			rawData,
			generated: new Date().getTime()
		};
		
		const Errors = this.bot.db.models.Errors;

		let exists = 0;
		const genRefID = () => { return [8,6,8].map(n => crypto.randomBytes(n/2).toString("hex")).join("-"); };

		let thereWasError = false;

		(async() => {
			while (true) {

				refID = genRefID();
				if (this.bot.db) {
					let dataExist = null;
					try { dataExist = await Errors.findOne({ where: { refID } }); } catch (Ex) { this.bot.logger.error("SYSTEM", `Failed loading database: ${Ex.message}`); thereWasError = true; break; };
					if (!dataExist) {
						exists = false;
						try {
							await Errors.create({
								refID,
								error: JSON.stringify({
									message: errData.message,
									stack: errData.stack
								}),
								affectedUserID: rawData.interactionUser.id,
								rawData: JSON.stringify(rawData)
							});
						} catch (Ex) {
							this.bot.logger.error("SYSTEM", `Failed saving to database: ${Ex.message}`);
							thereWasError = true;
						};
						break;
					};
				} else { thereWasError = true; break; }
			};
			if (thereWasError) {
				if (!fs.existsSync(this.logLocation)) fs.mkdirSync(this.logLocation);
				fs.writeFileSync(`${this.logLocation}/${refID || errData.generated}-error.log`, JSON.stringify(errData, null, "\t"));
			};
		})();
		return refID;
	};
}

module.exports = (bot) => {
	return {
		meta,
		execute: ErrorLog
	}
};