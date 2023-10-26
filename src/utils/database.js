/*
 * TheCodingBot v6
 * codingbot.gg
 * (c) 2023 Netro Corporation
*/

const meta = () => {
	return {
		name: "Database",
		description: "Database handler."
	};
};

const fs = require("fs");
const { Sequelize } = require("sequelize");

class Database  {

    constructor (bot) {
		this.bot = bot;
		this.bot.db = {
			connection: null,
			models: {}
		};
    };

	async init(dbCfg) {
		// Initialization

		this.bot.logger.debug("DATABASE", `Connecting to database ${dbCfg.database}...`);

		this.bot.db.connection = new Sequelize(dbCfg.database, dbCfg.username, dbCfg.password, dbCfg.dbCfg);

		await this.bot.db.connection.authenticate()
			.then(async() => {
				this.bot.logger.info("DATABASE", `DB Connect ${dbCfg.database}: OK`);

				this.bot.logger.debug("DATABASE", `Syncing the database ${dbCfg.database}...`);
				await this.bot.db.connection.sync()
					.then(() => {
						this.bot.logger.info("DATABASE", `DB Sync ${dbCfg.database}: OK`);
					})
					.catch((err) => {
						this.bot.logger.error("DATABASE", `DB Sync ${dbCfg.database}: NOT OK - ${err.message}`);
						console.log(err.stack);
					});
			})
			.catch((err) => {
				this.bot.logger.error("DATABASE", `DB Connect ${dbCfg.database}: NOT OK - ${err.message}`);
				console.log(err.stack);
			})

		const serversModel = this.bot.db.connection.define("serverSettings", {
			id: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
				primaryKey: true
			}
		});

		const usersModel = this.bot.db.connection.define("userSettings", {
			id: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
				primaryKey: true
			}
		});

		const errorsModel = this.bot.db.connection.define("errors", {
			refID: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
				primaryKey: true
			},
			error: {
				type: Sequelize.STRING,
				allowNull: false
			},
			affectedUserID: {
				type: Sequelize.STRING,
				allowNull: false
			},
			rawData: {
				type: Sequelize.STRING,
				allowNull: false
			}
		});

		this.bot.db.models = {
			Servers: serversModel,
			Users: usersModel,
			Errors: errorsModel
		};
	}
}

module.exports = (bot) => {
	return {
		meta,
		execute: Database 
	}
};