/*
	TheCodingBot v6
	https://tcb.nekos.tech
*/

class database {
    constructor() {
        this.app = null;
    }

    setContext(app) {
        this.app = app;
    }

	init(databases) {
		const startTime = new Date().getTime();
		const Sequelize = this.app.modules["sequelize"];
		if (!Sequelize) return this.app.logger.error("SYS", `Failed to databases! Sequelize package does not exist.`);

		Object.keys(databases).forEach(db => {
			db = databases[db];
			const dbName = db.database;
			try {
				this.app.logger.info("SYS", `Loading database: ${dbName}...`);
				const dbCfg = db.cfg;
				dbCfg["logging"] = data => { if (this.app.debugMode) this.app.logger.debug("DB", data); };

				this.app.db = new Sequelize(dbName, db.username, db.password, dbCfg);
				Object.keys(db.tables).forEach(async table => {
					if (!this.app.DBs[dbName])
						this.app.DBs[dbName] = {
							[table]: {}
						};

					Object.keys(db.tables[table]).forEach(entry => {
						db.tables[table][entry]["type"] = Sequelize[db.tables[table][entry]["type"]];
					});
					this.app.DBs[dbName][table] = await this.app.db.define(table, db.tables[table]);


                    if (this.app.DBs[dbName][table]) {
                        this.app.logger.debug("DB", `Syncing database ${dbName} table: ${table}...`);
                        await this.app.DBs[dbName][table].sync();
                    }; // Sync go brrr (Make sure the tables and stuff are created)
                });

				this.app.logger.info("SYS", `Loaded database: ${dbName} in ${new Date().getTime() - startTime}ms.`);
			} catch (Ex) {
				this.app.logger.error("SYS", `Failed to database: ${dbName}. ${Ex.message}\n${Ex.stack}`);
            };
		});
	}
}

// module.exports = database;
module.exports = function() { return new database() };