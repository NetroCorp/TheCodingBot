/*
 * TheCodingBot v6
 * codingbot.gg
 * (c) 2023 Netro Corporation
*/

const meta = () => {
	return {
		name: "Language",
		description: "Language handler."
	};
};

const fs = require("fs");
const path = require("path");

class Lang {

    constructor (bot) {
		this.bot = bot;
		this.langList = {};
    };

	async init() {
		// Initialization

		this.bot.logger.debug("BOOTSTRAP", `Loading language handler...`);

		const langDir = path.join(this.bot.baseDir, "lang");
		const langFiles = fs.readdirSync(langDir)
			.filter(langFiles => langFiles.endsWith("json"));

		for (const langFile of langFiles) {
			const startImport = new Date().getTime(),
				fileLocation = path.join(langDir, langFile),
				fileName = langFile.replace(path.extname(langFile), "");

			try {
				const lang = require(fileLocation);
				const meta = lang.meta;

				this.langList[fileName] = lang;

				this.bot.logger.debug("BOOTSTRAP", `Load language ${fileName}: OK in ${new Date().getTime() - startImport}ms.`);
			} catch (Ex) {
				this.bot.logger.error("BOOTSTRAP", `Load language ${fileName}: NOT OK - ${Ex.message}.`);
				console.log(Ex.stack);
			};
		};

		// this.bot.logger.debug("BOOTSTRAP", `Languages loaded, creating handler...`);
		this.bot.logger.info("BOOTSTRAP", `Languages handler ready.`);


		return true;
	}

	get(key, lang, placeholders = {}) {
		let theLang = this.langList[lang];
		if (!theLang) theLang = this.langList["en_US"];
		if (!theLang) return key;

		let transString = theLang.translation;

		// Find nested string (ex. 'hello_world.title' -> 'hello_world: { title: "Hello world!" }')
		const keys = key.split(".");
		for (const nKeys of keys) {
			if (!transString[nKeys]) return key;
			transString = transString[nKeys];
		};

		// Handle placeholders
		for (const placeholder in placeholders) {
			const plValue = placeholders[placeholder];
			const plPattern = new RegExp(`%${placeholder.toUpperCase()}%`, "g");
			transString = transString.replace(plPattern, plValue);
		};

		return transString;
	}
}

module.exports = (bot) => {
	return {
		meta,
		execute: Lang
	}
};