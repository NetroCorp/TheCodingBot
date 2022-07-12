/*
	TheCodingBot v6
	https://tcb.nekos.tech
*/

class main {
    constructor() {
        this.app = null;
    }

    setContext(app) {
        this.app = app;
    }

   load = async function(langs, init = true) {
        if (!this.app) return "NO APP, NO LANG";
        if (init)
            this.app.config.langs = {};
		
        for (let i = 0; i < langs.length; i++) {
            const lang = langs[i].split(".lang.js")[0],
				startTime = new Date();
            let err = false;
            try {
                this.app.logger.debug("SYS", `Loading language: ${lang}...`);

                const theLanguage = require(process.cwd() + "/app/lang/" + langs[i]);
                this.app.logger.debug("SYS", `[${theLanguage.metadata.langCode}] ${lang} (${theLanguage.metadata.full_name}) v${theLanguage.metadata.version} by ${theLanguage.metadata.translator} loaded.`);

                this.app.config.langs[lang] = theLanguage;
            } catch (error) {
                err = error;
            } finally {
                const endTime = new Date().getTime();
                if (err === false) {
                    this.app.logger.success("SYS", `Loaded language: ${lang} in ${(endTime - startTime)}ms.`);
                } else {
                    this.app.logger.error("SYS", `Could not load language: ${lang}.\n\tError Details:\n\t${err}`);
                    console.log(err.stack);
                };

            };
        };
    }

    get = function(lang, line) {
        if (!this.app) return "NO APP, NO LANG";

		function returnLine(app) {
			if (!app.config.langs[lang]) {
				for (let i = 0; i < Object.keys(app.config.langs).length; i++) {
					const l = app.config.langs[Object.keys(app.config.langs)[i]];
					if (lang == l.metadata.name || lang == l.metadata.full_name)
						return l.translations[line] || // Try the language first
							app.config.langs["English"].translations[line] || // Then try English
							line || // If all fails, return the line
							"TRANSLATION_FAIL_1"; // and somehow if this executes, that's the world ending.
				};
				return app.config.langs["English"].translations[line] || // Then try English
					line || // If all fails, return the line
					"TRANSLATION_FAIL_2"; // and somehow if this executes, that's the world ending.
			};

			// Return line
			return app.config.langs[lang].translations[line] || // Try the language first
				app.config.langs["English"].translations[line] || // Then try English
				line || // If all fails, return the line
				"TRANSLATION_FAIL_3"; // and somehow if this executes, that's the world ending.
		};

		let translation = returnLine(this.app);
		if (typeof translation === "string")
			return translation.replace("APPNAME", this.app.name).replace("FOOTER", this.app.config.system.footerText);
		else
			return translation;
    }
}

// module.exports = main;
module.exports = function() { return new main() };