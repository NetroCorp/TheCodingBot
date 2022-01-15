/*
	THECODINGBOT v5 WEB SERVER
	Created 12/4/2021
*/



class Web {
    init = function(app, settings) {
        try {
            const http = app.modules["http"];
            const baseDir = process.cwd() + "/app/extras/web/files/";

            const requestListener = function(req, res) {
                const requestStart = Date.now();

                res.on("finish", () => {
                    if (app.debugMode) app.logger.info("WEB", `[${req.socket.remoteAddress} => ${req.method}] ${req.url} (${res.statusCode} ${res.statusMessage}) in ${Date.now() - requestStart}ms.`);
                });

                switch (req.url) {
                    case "/info":
                        res.writeHead(200, { "Content-Type": "application/json" });
                        const json = {
                            shard_count: 0,
                            statuses: [{
                                ready: app.client.isReady(),
                                ping: app.client.ws.ping || 0,
                                guilds: app.client.guilds.cache.size,
                                users: app.client.users.cache.size,
                                uptime: app.client.uptimeTimestamp || 0
                            }]
                        }
                        res.write(JSON.stringify(((app.client) ? json : { error: "No client." })));
                        res.end()
                        break
                    default:
                        try {
                            if (!app.client.isReady()) {
                                res.writeHead(200, { "Content-Type": "application/json" });
                                res.write(JSON.stringify({ error: "Gateway not connected or destroyed." }));
                                res.end();
                                break
                            }
                            if (req.url.startsWith("/assets")) {
                                try {
                                    var path = baseDir + req.url.split(/\/(.+)/)[1];
                                    if (app.modules["fs"].existsSync(path)) {
                                        var file = app.modules["fs"].createReadStream(path);
                                        file.pipe(res);
                                    } else {
                                        throw new Error("file not found.");
                                    }
                                } catch (Ex) {
                                    res.writeHead(404, { "Content-Type": "application/json" });
                                    res.write(JSON.stringify({ error: "file not found." }));
                                    res.end();
                                    app.logger.error("WEB", `[${req.socket.remoteAddress} => ${req.method}] ${Ex.message} ${((app.debugMode) ? "\n"+Ex.stack : "")}`);

                                };
                                break
                            } else {
                                app.modules["fs"].readFile(baseDir + "/index.html", async function(err, data) {
                                    if (err) {
                                        res.writeHead(500, { "Content-Type": "application/json" });
                                        res.write(JSON.stringify({ error: "Internal Server Error." }));
                                        res.end();
                                        app.logger.error("WEB", `[${req.socket.remoteAddress} => ${req.method}] ${err.message} ${((app.debugMode) ? "\n"+err.stack : "")}`);
                                        return;
                                    };
                                    data = data.toString(); // Convert to string

                                    async function getDomColor(img) {
                                        try {
                                            var vib = require("node-vibrant");
                                            var img = await vib.from(img).getPalette();
                                            return ((img["DarkMuted"]) ? img["DarkMuted"].hex : img["Vibrant"].hex);
                                        } catch (Ex) {
                                            return Ex.message;
                                        };
                                    };

                                    // Placeholders.
                                    // The simple way would to wrap what the placeholder
                                    // text contain into a eval(). However, due to security,
                                    // that is a very bad idea.
                                    // Instead, I've taken the route of making "safe placeholders."
                                    // ..which will get updated as TCBv5 continues.

                                    var safePlaceholders = {
                                        "{appName}": app.name || "",
                                        "{appUserName}": app.client.user.username || "",
                                        "{appUserDiscriminator}": app.client.user.discriminator || 0,
                                        "{appUserID}": app.client.user.id || 0,
                                        "{appUserTag}": app.client.user.tag || 0,
                                        "{appGuilds}": app.client.guilds.cache.size || 0,
                                        "{appUsers}": app.client.users.cache.size || 0,
                                        "{appChannels}": app.client.channels.cache.size || 0,
                                        "{appActivity}": ((app.client.user.presence.activities.length > 0) ? app.client.user.presence.activities[0].type + " " + app.client.user.presence.activities[0].name : "") || "",
                                        "{appStatus}": app.client.user.presence.status || "",
                                        "{appAvatar}": app.client.user.displayAvatarURL({ format: 'png', dynamic: true }) || "",
                                        "{currentYear}": new Date().getFullYear() || "2022",
                                        "{uptimeTimestamp}": app.client.uptimeTimestamp || 0,
                                        "{humanUptime}": new Date(app.client.uptimeTimestamp).toString() || "unknown"
                                    }
                                    var placeholders = data.match(/{\w+}/g);
                                    if (placeholders.length > 0) {
                                        // var placeholderArr = placeholders.map(s=>s.slice(1,-1));
                                        // var placeholderArr = placeholders.filter((item, index, self) => index === self.indexOf(item));
                                        // for (var i = 0; i < placeholderArr.length; i++) {
                                        //     if (Object.keys(safePlaceholders).includes(placeholderArr[i])) {
                                        //         data = data.replaceAll(placeholders[i], safePlaceholders[placeholderArr[i]]);
                                        //     };
                                        // };

                                        // var placeholderArr = placeholders.filter((item, index, self) => index === self.indexOf(item));
                                        for (var i = 0; i < placeholders.length; i++) {
                                            if (placeholders[i] == "{appUserStatusIndic}") { // Custom one here.
                                                if (app.client.user.presence.status == "online")
                                                    data = data.replaceAll(placeholders[i], '<rect width="24" height="24" x="88" y="88" fill="hsl(139, calc(var(--saturation-factor, 1) * 47.3%), 43.9%)" mask="url(#svg-mask-status-online)" class="pointerEvents-9SZWKj"></rect>');
                                                else if (app.client.user.presence.status == "idle")
                                                    data = data.replaceAll(placeholders[i], '<rect width="24" height="24" x="88" y="88" fill="hsl(38, calc(var(--saturation-factor, 1) * 95.7%), 54.1%)" mask="url(#svg-mask-status-idle)" class="pointerEvents-9SZWKj"></rect>');
                                                else if (app.client.user.presence.status == "dnd")
                                                    data = data.replaceAll(placeholders[i], '<rect width="24" height="24" x="88" y="88" fill="hsl(359, calc(var(--saturation-factor, 1) * 82.6%), 59.4%)" mask="url(#svg-mask-status-dnd)" class="pointerEvents-9SZWKj"></rect>');
                                                else if (app.client.user.presence.status == "offline")
                                                    data = data.replaceAll(placeholders[i], '<rect width="24" height="24" x="88" y="88" fill="hsl(214, calc(var(--saturation-factor, 1) * 9.9%), 50.4%)" mask="url(#svg-mask-status-offline)" class="pointerEvents-9SZWKj"></rect>');
                                            } else if (placeholders[i] == "{domColorFromAvatar}") {
                                                var hex = await getDomColor(safePlaceholders["{appAvatar}"]) || "#000000";
                                                data = data.replaceAll(placeholders[i], hex);
                                            } else if (Object.keys(safePlaceholders).includes(placeholders[i])) {
                                                data = data.replaceAll(placeholders[i], safePlaceholders[placeholders[i]]);
                                            };
                                        };

                                    }
                                    // Write the data :)
                                    res.writeHead(200, { "Content-Type": "text/html" });
                                    res.write(data);
                                    res.end();
                                });

                                break
                            };


                        } catch (Ex) {
                            res.writeHead(500, { "Content-Type": "application/json" });
                            res.write(JSON.stringify({ error: "Internal Server Error." }));
                            res.end();
                            app.logger.error("WEB", `[${req.socket.remoteAddress} => ${req.method}] ${Ex.message} ${((app.debugMode) ? "\n"+Ex.stack : "")}`);
                        };
                }


            }
            let messages = ["You are great!", "You can accomplish anything!", "Success is in your future!"];

            const server = http.createServer(requestListener);

            server.listen(settings.port || 8069);
            if (app.debugMode) app.logger.success("WEB", `Listening on ${((settings.port) ? settings.port : 8069)}.`);

            return "ok";
        } catch (Ex) {
            throw Ex;
        }
    }
}

module.exports = Web;