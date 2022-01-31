#!/bin/bash

while : ; do
	if [ ! -f ./bot.js ]; then
		echo "[i] [SYS] bot.js NOT detected."
		echo "--------------------------------------------------"
		touch shutdwn.tmp
		break
	fi

	node bot.js --no-deprecation
	echo "--------------------------------------------------"
	if [ -f ./shutdwn.tmp ]; then
		rm shutdwn.tmp
		break
	fi
done
