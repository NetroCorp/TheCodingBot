# TheCodingBot
Welcome to TheCodingBot. The hobby Discord bot created by TheCodingGuy#6697.
Packed with moderation, fun, and craziness. The only bot you'll ever need.
~~..until Discord updates their API and breaks the bot. :^)~~


## Version 5 is in ACTIVE (and somewhat) HEAVY DEVELOPMENT
Do not expect anything to work as intended. As if, anything ever worked anyways. :P
Expect some changes to explode :^)


## Get this version goin'!
:warning: **Everything you need to change is in the `src` folder. Please try not to bother anything you don't have to.**
This guide will assume you've left `app` in `src` (the way it should be).
- First, you'll need to ensure you have [NodeJS](https://nodejs.org/) installed.
- Then, download this branch.
  - You can download easily by `git clone TMC-Software/TheCodingBot`.
  - If you don't know how to obtain this......... there's tutorials. This guide assumes you know how.
- Afterwards, fire up a terminal/command prompt and run `npm install` in the newly created directory, wait for packages to install. Kill some time by completing the next few steps.
  - :information_source: **Wherever `package-lock.json` is, just run that command there.**
- Make the following changes to the `app/cfg/tokendata.json` file.
  - You'll need to obtain a Discord token from [here](https://discord.com/developers/applications/).
  - If you wish to have support for osu! stats and stuff, you'll need to obtain a API key from [here](https://osu.ppy.sh/p/api/).
  - Save the file with your tokens in their proper place.
  - :warning: **You'll need to rename the file from `tokendata.json.example` to `tokendata.json`.**
- Modify the `app/cfg/system.json`.
  - Place your ID where the placeholder `yourUserIDHere` is.
  - :warning: **Do not worry about changing emotes at this time.**
  - :warning: **Do not worry about changing the `logURL` or `imgAPI` until a release regarding those items are publicly available.**
- Run `npm start` after changing everything that is stated above.
  - :information_source: **You can also use `npm start true` to enable debug logging, however this is a mess and really spammy.**
- Boom, you have a v5 clone. Kinda, I guess.


## Version 5 Releases

| Version | Release Date |
| ------- | ------------ |
| 5.0.0   | 3/10/2022    |
| 5.0.1   | 3/15/2022    |
| 5.0.2   | 3/28/2022    |
| 5.1.0   | 4/2/2022     |
| 5.1.1   | 1/4/2023     |

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
I'm not gonna hold your hand the entire way through. If you are genuinely confused on something I wrote, I'll assist.
And no, I'm not gonna merge anything and everything into the branch. I'll most likely make small changes to fit the code (if needed) and then merge it.
 - :warning: **If the code is fully unable to merge, the idea is stolen, doesn't make sense, etc. I will *not* accept your request.**
And before you say anything, no I'm not strict, I'm just trying to set some order around here. kthx.


## History
TheCodingBot started off as a small hobby project back in 2018. To date - as of 2022 - TheCodingBot has seen so much happen with Discord. The bot currently has 75+ servers and for some reason will not verify with Discord.

## Disclaimer
This bot is licensed under MIT, meaning that this bot is provided "AS IS". For the best experience, always keep your fork up-to-date or utilize the [current bot](https://discord.com/oauth2/authorize?client_id=438532019924893707&permissions=8&scope=applications.commands%20bot).
For further support, join the [Discord Server](https://discord.gg/HdKeWtV)!
