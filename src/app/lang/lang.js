/*
	THECODINGBOT v5
	Language
	3/29/2022

	https://tcb.nekos.tech/source
	https://themattchannel.com
*/

class Language {
    constructor(app, defaultLang) {
        this.app = app;
        this.defaultLang = defaultLang;
    }
    loadLang = async function(langs, init = true) {
        if (!this.app) return "NO APP, NO LANG";
        if (init)
            this.app.config.langs = {};

        var results = { success: [], fail: [] };

        for (var i = 0; i < langs.length; i++) {
            var lang = langs[i].split(".json")[0];
            try {
                var startTime = new Date(),
                    err = false;

                this.app.logger.debug("SYS", `Loading language: ${lang}...`);

                var theLanguage = require(process.cwd() + "/app/lang/" + lang);
                this.app.logger.debug("SYS", `${lang} (${theLanguage.metadata.full_name}) Language by ${theLanguage.metadata.translator} (v${theLanguage.metadata.version})...`);

                this.app.config.langs[lang] = theLanguage;

            } catch (error) {
                err = error;
            } finally {
                var endTime = new Date();
                var elapsedMS = (endTime - startTime) / 1000;
                if (err === false) {
                    this.app.logger.success("SYS", `Loaded & enabled ${lang} language in ${elapsedMS}ms.`);
                    results["success"].push(lang);
                } else {
                    results["fail"].push(lang);

                    this.app.logger.error("SYS", `Could not load ${lang} language.\n\tError Details:\n\t${err}`);
                    console.log(err.stack);
                };

            };
        };
        // 1. Load in language files
    }

    getLine = function(lang, line) {
        if (!this.app) return "NO APP, NO LANG";

        if (!this.app.config.langs[lang]) {
            for (var i = 0; i < Object.keys(this.app.config.langs).length; i++) {
                var l = this.app.config.langs[Object.keys(this.app.config.langs)[i]];
                if (lang == l.metadata.name || lang == l.metadata.full_name)
                    return l.translations[line] || // Try the language first
                        this.app.config.langs["English"].translations[line] || // Then try English
                        line || // If all fails, return the line
                        "TRANSLATION_FAIL"; // and somehow if this executes, that's the world ending.
            };
            return this.app.config.langs["English"].translations[line] || // Then try English
                line || // If all fails, return the line
                "TRANSLATION_FAIL"; // and somehow if this executes, that's the world ending.
        };

        // Return line
        return this.app.config.langs[lang].translations[line] || // Try the language first
            this.app.config.langs["English"].translations[line] || // Then try English
            line || // If all fails, return the line
            "TRANSLATION_FAIL"; // and somehow if this executes, that's the world ending.
    }
};

module.exports = Language;
module.exports = Language;