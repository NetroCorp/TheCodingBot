@echo off
mode con: cols=120 lines=40
title TheCodingBot Version 4
REM TheCodingBot Version 4 Starter - Windows
REM Copyright (c) TMC Software 2020
REM ----------------------------------------

:begin
if NOT EXIST bot.js goto nobot
goto yesbot

:nobot
echo [i] [SYS] bot.js NOT detected.
echo --------------------------------------------------
goto shutdown

:yesbot
node bot.js --no-deprecation
echo --------------------------------------------------
IF EXIST shutdwn.tmp goto shutdown
goto begin

:shutdown
cd.>shutdwn.tmp
exit /b 0

