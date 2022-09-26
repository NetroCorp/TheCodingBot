/*
	TheCodingBot v6
	https://tcb.nekos.tech
*/

module.exports = {
    metadata: {
        name: "Japanese",
        full_name: "Japanese (ja_JP)",
        description: "日本語 - 日本",
        langCode: "ja_JP",
        translator: "Aisuruneko",
        version: "1.0.0.0"
    },
    translations: {


        // Success
        "success.generic": "成功！",


        // Errors
        "errors.generic": "エラーが発生しました！",
        "errors.commands.generic": "そのコマンドは存在しないか、使用できなくなりました。",
        "error.commands.kick.fail_generic": "%ERRMSG% のため、%USERTAG% をキックできませんでした。",
        "error.commands.ban.fail_generic": "%ERRMSG% のため、%USERTAG% をスナイプ (禁止) できませんでした。",


        // Commands
        "commands.test.test": "こんにちは、世界！",

        "commands.ping.title": "APPNAMEステータス",
        "commands.ping.status": "ステータス",
        "commands.ping.statusTypes": [
            "準備完了",
            "接続する",
            "再接続しています",
            "遊休",
            "ほぼ",
            "切断されました",
            "ギルドを待っています",
            "識別",
            "再開"
        ],
        "commands.ping.ping": "Ping",
        "commands.ping.servers": "サーバー",
        "commands.ping.latency": "レイテンシー",

        "commands.hug.title": "抱擁",
        "commands.hug.hugs": "抱きしめる",
        "commands.hug.personal": "ここにあなたへのハグがあります、",

        "commands.pat.title": "パット",
        "commands.pat.pats": "パット ",
        "commands.pat.personal": "ここにあなたへのpatがあります、",

        "commands.kiss.title": "キス",
        "commands.kiss.kisses": "キスします",
        "commands.kiss.personal": "ここにあなたへのキスがあります、",

        "commands.nom.title": "ノム",
        "commands.nom.noms": "ノム",
        "commands.nom.personal": "ノムあなた、",

        "commands.cuddle.title": "寄り添う",
        "commands.cuddle.cuddles": "はと寄り添います",
        "commands.cuddle.personal": "私は意思あなたを寄り添います、",

        "commands.eval.title": "評価",
        "commands.eval.result": "評価結果",

        "commands.source.title": "源",
        "commands.source.description": "あなたはソースコードを見つけることができます[ここ](%SOURCELINK%)",

        "commands.kick.title": "キック",
        "errors.commands.kick.invalid_target": "ユーザーがサーバーに存在しません。",
        "errors.commands.kick.user_is_target": "なぜ自分を蹴りたいのですか？",
        "errors.commands.kick.target_is_higher": "そのユーザーは、あなたよりも立場が上なのです。",
        "errors.commands.kick.target_is_higher_bot": "そのユーザーは私よりも立場が上なのです。",
        "errors.commands.kick.failed_dm": "ユーザーに DM を送信中に問題が発生しました。",
        "commands.kick.complete": "やったー! %USERTAG%はブートされました。",
        "commands.kick.user_complete": "あなたは %SERVERNAME% からキックされました。",

        "commands.slap.title": "ひらてうち",
        "commands.slap.slaps": "すらっぷす",
        "commands.slap.personal": "どしてもというなら、",

        "commands.ban.title": "禁止",
        "errors.commands.ban.invalid_target": "ユーザーがサーバーに存在しません。",
        "errors.commands.ban.user_is_target": "なぜあなたは自分自身を禁止したいのですか？",
        "errors.commands.ban.target_is_higher": "そのユーザーは、あなたよりも立場が上なのです。",
        "errors.commands.ban.target_is_higher_bot": "そのユーザーは私よりも立場が上なのです。",
        "errors.commands.ban.failed_dm": "ユーザーに DM を送信中に問題が発生しました。",
        "commands.ban.complete": "Yeet! %USERTAG% がサーバーから狙撃されました。",
        "commands.ban.user_complete": "あなたは%SERVERNAME%から追放されました。",

        "commands.8ball.title": "8ボール",
        "errors.commands.8ball.no_question": "質問が入力されていません。",
        "commands.8ball.question": "質問",
        "commands.8ball.answer": "回答",
        "commands.8ball.responses": {
            "はい！": "lime",
            "確かに": "lime",
            "星に手を伸ばせ！": "lime",
            "間違いなく！": "lime",
            "いいえ。": "red",
            "それについて考えさえしないでください。": "red",
            "なんでそんなことするの！？": "red",
            "しないでください。": "red",
            "実はわからない…": "purple",
            "考えさせて": "purple",
            "うーん...": "purple",
            "未来と同じように、私は何に答えるべきかわからない。": "purple"
        },
    }
}