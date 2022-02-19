module.exports = async(app, newMember) => {
    if (newMember.partial) await newMember.fetch().catch(err => {});

    if (newMember.guild == null) return; // Stop if we not in a guild? (Just safety)
    var guild = newMember.guild;

    var serverSettings = await app.DBs.serverSettings.findOne({ where: { serverID: guild.id } });
    if (!serverSettings) return;

    var logChannelID = serverSettings.get("loggingMemberChannel");
    var logChannel = app.client.channels.cache.get(logChannelID);
    if (!logChannel) return; // Something's wrong here?


    var GetInviteInfo = async() => {
        try {
            if (newMember.user.bot) return { "msg": "OAuth" };

            const newInvites = await guild.invites.fetch();
            const oldInvites = await app.client.guildInvites.get(guild.id);
            const usedInvite = await newInvites.find(i => i.uses > oldInvites.get(i.code));
            if (!usedInvite) return { "msg": "I do not know how they joined" };
            const inviter = app.client.users.cache.get(usedInvite.inviter.id);

            return { "inviter": { "tag": inviter.tag, "id": inviter.id }, "code": usedInvite.code, "uses": usedInvite.uses };

        } catch (Ex) {
            app.logger.error("DISCORD", `[guildMemberAdd] [GetInviteInfo] ${Ex.message}\n${Ex.stack}`);
            return { msg: "Sorry, something went wrong while fetching this information." };
        };
    };

    var inviteInfo = await GetInviteInfo(); // shush ik im using the old system from v4.
    if (inviteInfo)
        if (inviteInfo["msg"] == null) {
            if (inviteInfo["code"] == null)
                inviteInfo["code"] = "I do not know how they joined.";
            if (inviteInfo["inviter"] == null)
                inviteInfo["inviter"] = { "tag": "Unknown#0000", "id": "0" };
            if (inviteInfo["uses"] == null)
                inviteInfo["uses"] = 0;

        };


    function nth(n) { return n + (["st", "nd", "rd"][((n + 90) % 100 - 10) % 10 - 1] || "th") };
    const newMemberNth = nth(guild.members.cache.size);
    var logMemberJoin = async() => {
        // -- LOG THAT USER JOINED

        var embed = {
            author: { name: `${guild.name} (${guild.id})`, icon_url: guild.iconURL({ format: 'png', dynamic: true, size: 1024 }) },
            title: `${(newMember.user.bot) ? "Bot Added" : "User Joined"}`,
            color: app.config.system.embedColors.green,
            description: `They are the ${newMemberNth} member.`,
            fields: [
                { name: "Full Tag", value: newMember.user.tag, inline: true },
                { name: "ID", value: newMember.user.id, inline: true },
                { name: "Created", value: new Date(newMember.user.createdTimestamp).toString() },
            ],
            thumbnail: newMember.user
        };
        if (inviteInfo)
            embed.fields.push({ name: "Invited by", value: (inviteInfo["msg"] != null ? inviteInfo["msg"] : "**" + inviteInfo["inviter"]["tag"] + "** (" + inviteInfo["inviter"]["id"] + ") using code **" + inviteInfo["code"] + "**. It now has **" + inviteInfo["uses"] + "** uses.") });

        await app.functions.msgHandler(logChannel, {
            embeds: [embed]
        });
    };

    var announceMemberJoin = async() => {
        // -- GENERATE MEMBER JOIN MESSAGES
        if (newMember.user.bot) return; // cough, i said member, not bot.

        var otherSettings = serverSettings.get("other");
        if (!otherSettings) return;
        try { otherSettings = JSON.parse(otherSettings); } catch (Ex) { return; };

        joinSettings = otherSettings["join"];
        if (!joinSettings) return;

        var announceChannelID = joinSettings["channel"];
        var announceMessageTemplate = joinSettings["msg"];
        var announceChannel = app.client.channels.cache.get(announceChannelID);
        if (!announceChannel || !announceMessageTemplate) return; // Something's wrong here?

        // -- ANNOUNCE MESSAGE
        var announceMessage = null,
            placeholders = announceMessageTemplate.match(/%\w+%/g) || null;
        var safePlaceholders = app.functions.getTypes.replaceWith("join");
        if (placeholders.length > 0) {
            for (var i = 0; i < placeholders.length; i++) {
                if (Object.keys(safePlaceholders).includes(placeholders[i])) {
                    if (placeholders[i].startsWith("%invite")) {
                        var whatWeLookingFor = placeholders[i].replaceAll("%", "");

                        if (whatWeLookingFor.startsWith("inviter")) {
                            if (!inviteInfo || !inviteInfo["inviter"]) announceMessageTemplate = announceMessageTemplate.replaceAll(placeholders[i], "Unknown");
                            else {
                                var inviter = app.client.users.cache.get(inviteInfo["inviter"]["id"]) || null;
                                if (inviteInfo["msg"] == null && inviter == null) announceMessageTemplate = announceMessageTemplate.replaceAll(placeholders[i], "Unknown");
                                else {

                                    switch (whatWeLookingFor.split("inviter")[0]) {
                                        case "name":
                                            announceMessageTemplate = announceMessageTemplate.replaceAll(placeholders[i], (inviter.username) ? inviter.username : "");
                                        case "ID":
                                            announceMessageTemplate = announceMessageTemplate.replaceAll(placeholders[i], (inviter.id) ? inviter.id : "");
                                        case "tag":
                                            announceMessageTemplate = announceMessageTemplate.replaceAll(placeholders[i], (inviter.tag) ? inviter.tag : "");
                                        default:
                                            announceMessageTemplate = announceMessageTemplate.replaceAll(placeholders[i], (inviter) ? inviter.toString() : "");
                                    };
                                };
                            };
                        } else if (!whatWeLookingFor.startsWith("inviter")) {
                            switch (whatWeLookingFor.split("invite")[1]) {
                                case "code":
                                    announceMessageTemplate = announceMessageTemplate.replaceAll(placeholders[i], (inviteInfo["code"] != null) ? inviteInfo["code"] : "Unknown");
                                case "uses":
                                    announceMessageTemplate = announceMessageTemplate.replaceAll(placeholders[i], (inviteInfo["uses"] != null) ? inviteInfo["uses"] : "");
                                default:
                                    announceMessageTemplate = announceMessageTemplate.replaceAll(placeholders[i], "Unknown");
                            };
                        }
                    } else // -- WARNING :: THIS IS DANGEROUS | DO NOT SEND ANYTHING OTHER THAN newMember AND PLACEHOLDERS.
                        announceMessageTemplate = announceMessageTemplate.replaceAll(placeholders[i], new Function('newMember, safePlaceholders, placeholders',
                        'return newMember.' + safePlaceholders[placeholders[i]].replaceAll("|", ".")
                    )(newMember, safePlaceholders, placeholders));
                };
            };
            announceMessage = announceMessageTemplate;
        };

        // -- WELCOME IMAGE GENERATION
        var attachment = null,
            location = process.cwd() + "/app/imgs/welcome/";
        const templateFiles = app.modules["fs"].readdirSync(location).filter(file => file.startsWith('welimg') && file.endsWith('.png'));
        if (templateFiles.length == 0) app.logger.error("SYS", "Load welcome templates failed!");
        else {
            var templateName = templateFiles[Math.floor(Math.random() * templateFiles.length)];
            var templateFile = location + templateName;

            function containsSpecialCharacters(s) {
                return /[^\u0000-\u00ff]/.test(s);
            };

            // Canvas jazz crap
            const Canvas = app.modules["canvas"];
            const canvas = Canvas.createCanvas(1772, 633),
                ctx = canvas.getContext('2d');

            // Register custom font
            Canvas.registerFont(location + "/fonts/segoeuib.ttf", { family: "Segoe UI" });
            // Draw the background
            const background = await Canvas.loadImage(templateFile);
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#f2f2f2';
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            // Draw welcome text
            var welcomeText = `Welcome to the server,`;
            ctx.font = '69px Genta';
            ctx.fillStyle = '#f2f2f2';
            ctx.fillText(welcomeText, 700, canvas.height / 2 - 150);

            // Draw username (make it small if necessary)
            const userText = `${newMember.user.username}`;
            const tSize = (userText.length >= 14) ? (150 - (userText.length * 3.59)) : "150"
            ctx.font = tSize + 'px "Segoe UI"';
            ctx.fillStyle = '#f2f2f2';
            ctx.fillText(userText, 700, canvas.height / 2 + 20);


            // Draw Nth member count
            var memCountText = `You're the ${newMemberNth} member!`;
            ctx.font = '36px Genta';
            ctx.fillStyle = '#f2f2f2';
            ctx.fillText(memCountText, 705, canvas.height / 2 + 125);

            // Draw avatar circle
            ctx.beginPath();
            ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true); //position of img
            ctx.closePath();
            ctx.clip();
            // Draw avatar now
            const avatar = await Canvas.loadImage(newMember.user.displayAvatarURL({ format: 'png', dynamic: true, size: 512 }));
            ctx.drawImage(avatar, 65, canvas.height / 2 - 250, 500, 500);

            attachment = new app.modules["discord.js"].MessageAttachment(canvas.toBuffer(), 'tcbwelcome.png');

        };


        var data = {
            content: (announceMessage != null) ? announceMessage : "** **",
            files: (attachment) ? [attachment] : [],
        };


        if (announceMessage != null)
            await app.functions.msgHandler(announceChannel, data);
    };




    await logMemberJoin();
    await announceMemberJoin();
};