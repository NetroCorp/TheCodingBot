/*
	THECODINGBOT v5 WEB SERVER
	Created 12/4/2021
*/



class Web {
    init = function(app, port) {
        try {
            const http = app.modules["http"];

            const requestListener = function(req, res) {
                const requestStart = Date.now();

                res.on("finish", () => {
                    if (app.debugMode) app.logger.log("i", "WEB", `[${req.socket.remoteAddress} => ${req.method}] ${req.url} (${res.statusCode} ${res.statusMessage}) in ${Date.now() - requestStart}ms.`);
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
                        res.write(`${((app.client) ? JSON.stringify(json) : "{ 'error': 'no client?' }")}`);
                        res.end()
                        break
                    default:
                        try {

                            app.modules["fs"].readFile("./modules/web/files/index.html", function(error, pgResp) {
                                if (error) {
                                    resp.writeHead(404);
                                    resp.write("Eep! I can't find that! :(");
                                } else {
                                    resp.writeHead(200, { 'Content-Type': 'text/html' });
                                    resp.write(pgResp);
                                }

                                resp.end();
                            });

                        } catch (Ex) {
                            res.writeHead(500);
                            res.end("Internal Server Error");
                        };
                        res.end();
                }


            }
            let messages = ["You are great!", "You can accomplish anything!", "Success is in your future!"];

            const server = http.createServer(requestListener);

            server.listen(port || 8069);

            return "ok";
        } catch (Ex) {
            throw Ex;
        }
    }
}

module.exports = Web;