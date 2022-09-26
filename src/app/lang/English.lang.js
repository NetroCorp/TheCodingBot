/*
	TheCodingBot v6
	https://tcb.nekos.tech
*/

module.exports = {
    metadata: {
        name: "English",
        full_name: "English (en_US)",
        description: "English - United States",
        langCode: "en_US",
        translator: "Aisuruneko",
        version: "1.0.0.0"
    },
    translations: {


        // Success
        "success.generic": "Success!",


        // Errors
        "errors.generic": "An error occurred!",
        "errors.commands.generic": "That command does not exist or is no longer available.",
        "error.commands.kick.fail_generic": "Could not kick %USERTAG% due to %ERRMSG%.",
        "error.commands.ban.fail_generic": "Could not ban %USERTAG% due to %ERRMSG%.",


        // Commands
        "commands.test.test": "Hello, world!",

        "commands.ping.title": "APPNAME Status",
        "commands.ping.status": "Status",
        "commands.ping.statusTypes": [
            "READY",
            "CONNECTING",
            "RECONNECTING",
            "IDLE",
            "NEARLY",
            "DISCONNECTED",
            "WAITING FOR GUILDS",
            "IDENTIFYING",
            "RESUMING"
        ],
        "commands.ping.ping": "Ping",
        "commands.ping.servers": "Servers",
        "commands.ping.latency": "Latency",

        "commands.hug.title": "Hug",
        "commands.hug.hugs": "hugs",
        "commands.hug.personal": "Here's a hug to you,",

        "commands.pat.title": "Pat",
        "commands.pat.pats": "pats",
        "commands.pat.personal": "Here's a pat to you,",

        "commands.kiss.title": "Kiss",
        "commands.kiss.kisses": "kisses",
        "commands.kiss.personal": "Here's a kiss to you,",

        "commands.nom.title": "Nom",
        "commands.nom.noms": "noms",
        "commands.nom.personal": "Nomming you,",

        "commands.cuddle.title": "Cuddle",
        "commands.cuddle.cuddles": "cuddles",
        "commands.cuddle.personal": "I will cuddle you,",

        "commands.eval.title": "Eval",
        "commands.eval.result": "Evaluation Result",

        "commands.source.title": "Source",
        "commands.source.description": "You can find the Source Code [here](%SOURCELINK%)",

        "commands.kick.title": "Kick",
        "errors.commands.kick.invalid_target": "The user does not exist in the server.",
        "errors.commands.kick.user_is_target": "Why do you want to kick yourself?",
        "errors.commands.kick.target_is_higher": "That user is in a higher position than you.",
        "errors.commands.kick.target_is_higher_bot": "That user is in a higher position than I am.",
        "errors.commands.kick.failed_dm": "Something went wrong while sending a DM to the user.",
        "commands.kick.complete": "Yeet! %USERTAG% just got the boot.",
        "commands.kick.user_complete": "You have been kicked from %SERVERNAME%.",

        "commands.slap.title": "Slap",
        "commands.slap.slaps": "slaps",
        "commands.slap.personal": "If you insist, ",

        "commands.ban.title": "Ban",
        "errors.commands.ban.invalid_target": "The user does not exist in the server.",
        "errors.commands.ban.user_is_target": "Why do you want to ban yourself?",
        "errors.commands.ban.target_is_higher": "That user is in a higher position than you.",
        "errors.commands.ban.target_is_higher_bot": "That user is in a higher position than I am.",
        "errors.commands.ban.failed_dm": "Something went wrong while sending a DM to the user.",
        "commands.ban.complete": "Yeet! %USERTAG% just got the sniped out of the server.",
        "commands.ban.user_complete": "You have been banned from %SERVERNAME%.",

        "commands.8ball.title": "8ball",
        "errors.commands.8ball.no_question": "No question has been entered.",
        "commands.8ball.question": "Question",
        "commands.8ball.answer": "Answer",
        "commands.8ball.responses": {
            "Yes!": "lime",
            "For sure": "lime",
            "Reach for the stars!": "lime",
            "Definitely!": "lime",
            "No.": "red",
            "Don't even think about it.": "red",
            "Why would you do that!?": "red",
            "Don't.": "red",
            "I actually don't know..": "purple",
            "Let me think about it": "purple",
            "Uhh...": "purple",
            "Just like the future, I'm uncertain on what to answer.": "purple"
        },
    }
}