//
// TheCodingBot
// Netro Corporation
//
// https://codingbot.gg

class Database {
	constructor(app) {
		this.app = app;
	}

	init = async() => {
		const Sequelize = this.app.dependencies["sequelize"];
		if (!Sequelize) return this.app.log("DATABASE", "Missing Sequelize package.");
		try {
			if (!this.app.DBs) this.app.DBs = {};

			const dbSettings = {
				username: process.env.EXT_MYSQL_DATABASE ? process.env.EXT_MYSQL_USER : "TheCodingBot",
				password: process.env.EXT_MYSQL_DATABASE ? process.env.EXT_MYSQL_PASSWORD : process.env.DOCKER_MYSQL_PASSWORD,
				database:  process.env.EXT_MYSQL_DATABASE ?  process.env.EXT_MYSQL_DATABASE : "TheCodingBot",
				dbCfg: {
					dialect: "mysql",
					host: process.env.EXT_MYSQL_DATABASE ? process.env.EXT_MYSQL_HOST : "0.0.0.0"
				},
				tableCfg: {},
				tables: {
					servers: {
						serverID: {
							type: Sequelize.DataTypes.INTEGER,
							unique: true,
							primaryKey: true,
							autoIncrement: true
						},
						protection: {
							type: Sequelize.DataTypes.STRING,
							allowNull: false,
							// Have to create hacky function for JSON
							get: () => { return JSON.parse(this.getDataValue("protection")) },
							set: (value) => { return this.setDataValue("protection", JSON.stringify(value)) }
						},
						logChannels: {
							type: Sequelize.DataTypes.STRING,
							allowNull: false,
							// Have to create hacky function for JSON
							get: () => { return JSON.parse(this.getDataValue("logChannels")) },
							set: (value) => { return this.setDataValue("logChannels", JSON.stringify(value)) }
						},
						greeting: {
							type: Sequelize.DataTypes.STRING,
							allowNull: false,
							// Have to create hacky function for JSON
							get: () => { return JSON.parse(this.getDataValue("greeting")) },
							set: (value) => { return this.setDataValue("greeting", JSON.stringify(value)) }
						}
					},

					users: {
						userID: {
							type: Sequelize.DataTypes.INTEGER,
							unique: true,
							primaryKey: true,
							autoIncrement: true
						},
						AFKSettings: {
							type: Sequelize.DataTypes.STRING,
							allowNull: false,
							// Have to create hacky function for JSON
							get: () => { return JSON.parse(this.getDataValue("AFKSettings")) },
							set: (value) => { return this.setDataValue("AFKSettings", JSON.stringify(value)) }
						}
					},

					cases: {
						entryID: {
							type: Sequelize.DataTypes.INTEGER,
							unique: true,
							primaryKey: true,
							autoIncrement: true
						},
						serverID: {
							type: Sequelize.DataTypes.INTEGER,
							allowNull: false
						},
						caseID: {
							type: Sequelize.DataTypes.INTEGER,
							allowNull: false
						},
						targetID: {
							type: Sequelize.DataTypes.INTEGER,
							allowNull: false
						},
						modID: {
							type: Sequelize.DataTypes.INTEGER,
							allowNull: false
						},
						type: {
							type: Sequelize.DataTypes.INTEGER,
							allowNull: false
						},
						auditID: {
							type: Sequelize.DataTypes.INTEGER,
							allowNull: false
						}
					},

					caseNotes: {
						entryID: {
							type: Sequelize.DataTypes.INTEGER,
							unique: true,
							primaryKey: true,
							autoIncrement: true
						},
						caseID: {
							type: Sequelize.DataTypes.INTEGER,
							allowNull: false
						},
						modID: {
							type: Sequelize.DataTypes.INTEGER,
							allowNull: false
						},
						note: {
							type: Sequelize.DataTypes.STRING,
							allowNull: false
						}
					}
				}
			};

			const dbName = dbSettings.database;
			this.app.log.info("DATABASE", `Connecting to database ${dbName}...`);
			dbSettings.dbCfg["logging"] = data => { if (this.app.debugMode) this.app.log.debug("DATABASE", data); };
			this.app.db = new Sequelize(dbName, dbSettings.username, dbSettings.password, dbSettings.dbCfg);
			await Object.keys(dbSettings.tables).forEach(async table => {
				if (!this.app.DBs[dbName]) this.app.DBs[dbName] = { [table]: {} };
				const tbCfg = dbSettings.tableCfg[table] || {};
				this.app.DBs[dbName][table] = await this.app.db.define(table, dbSettings.tables[table], tbCfg);
				if (this.app.DBs[dbName][table]) {
					this.app.log.debug("DATABASE", `Syncing database ${dbName} table: ${table}...`);
					await this.app.DBs[dbName][table].sync();
				};
			});
		} catch (Ex) {
			this.app.log.error("DATABASE", `Something went wrong while loading the database! ${Ex.message}`);
		};
	}
}

module.exports = function(app) { return new Database(app) }