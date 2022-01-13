
	}else if(message.content == "mk!fight") {
		if(playerID.length == 2 && ready == "yes") { //Ensures the game is ACTUALLY started
			var damage = Math.floor(Math.random() * 10) + 1;
			if(playerID[playerActive] != message.author.id){
				message.channel.send({embed: { title: "TCG Bot | Mortal Kombat", color: red, description: "You can't fight yet; it's <@!" + playerID[playerActive] + ">'s turn.." }});
			}else if(playerActive == 0){
				player2HP = player2HP - damage;
				message.channel.send({ embed: { title: "TCG Bot | Mortal Kombat", color: yellow, description: "Player 1 has dealt " + damage + " damage to Player 2.\nPlayer 2 now has " + player2HP + " HP left!\n", footer: { text: ""+footertxt+"" } }});
				console.log("Player 1 has dealt " + damage + " damage to Player 2.\nPlayer 2 now has " + player2HP + " HP left!\n");
				if (player2HP < 0 || player2HP == 0) {
					message.channel.send({embed: { title: "TCG Bot | Mortal Kombat", color: red, description: "Uh-oh. Game over:\nPlayer 2 (<@!"+playerID[1]+">) has died. Player 1 (<@!"+playerID[0]+">) has won." }});
					console.log("Uh-oh. Player 2 ("+playerID[1]+") has died. Game is over. Player 1 ("+playerID[0]+") has won!");
					GameOver();
			 	}
				else {
					playerActive = 1;
					message.channel.send({embed: { title: "TCG Bot | Mortal Kombat", color: lime, description: "Player 2 (<@!"+playerID[1]+">)'s turn." }});
				}
			}else if(playerActive == 1){
				player1HP = player1HP - damage;
				message.channel.send({ embed: { title: "TCG Bot | Mortal Kombat", color: yellow, description: "Player 2 has dealt " + damage + " damage to Player 1.\nPlayer 1 now has " + player1HP + " HP left!\n", footer: { text: ""+footertxt+"" } }});
				console.log("Player 2 has dealt " + damage + " damage to Player 1.\nPlayer 1 now has " + player1HP + " HP left!\n");
				if (player1HP < 0 || player1HP == 0) {
					message.channel.send({embed: { title: "TCG Bot | Mortal Kombat", color: red, description: "Uh-oh. Game over:\nPlayer 1 <@!"+playerID[0]+"> has died. Player 2 (<@!"+playerID[1]+">) has won." }});
					console.log("Uh-oh. Player 1 ("+playerID[0]+") has died. Game is over. Player 2 ("+playerID[1]+") has won!");
					GameOver();
				}
				else {
					playerActive = 0;
					message.channel.send({embed: { title: "TCG Bot | Mortal Kombat", color: lime, description: "Player 1 (<@!"+playerID[0]+">)'s turn." }});
				}
			}
		}else{
			message.channel.send({embed: { title: "TCG Bot | Mortal Kombat", color: red, description: "Game has not been started. Please verify all players are in the game and the game was started by \`mk!start\`" }});
		}
	}else if(message.content == "mk!fight punch") {
		if(playerID.length == 2 && ready == "yes") { //Ensures the game is ACTUALLY started
			var damage = Math.floor(Math.random() * 20) + 1;
			if(playerID[playerActive] != message.author.id){
				message.channel.send({embed: { title: "TCG Bot | Mortal Kombat", color: red, description: "You can't fight yet; it's <@!" + playerID[playerActive] + ">'s turn.." }});
			}else if(playerActive == 0 && player2HP < 20) {
				message.channel.send({embed: { title: "TCG Bot | Mortal Kombat", color: red, description: "To avoid a instant kill, you cannot punch this player, since their HP is below 20.\nPlease run \`mk!fight\` instead.\nIt is still your turn.\nTheir HP: "+player2HP, footer: { text: ""+footertxt+"" } }});
			}else if(playerActive == 0){
				player2HP = player2HP - damage;
				message.channel.send({ embed: { title: "TCG Bot | Mortal Kombat", color: yellow, description: "Player 1 has dealt " + damage + " damage to Player 2 with punch.\nPlayer 2 now has " + player2HP + " HP left!\n", footer: { text: ""+footertxt+"" } }});
				console.log("Player 1 has dealt " + damage + " damage to Player 2 with punch.\nPlayer 2 now has " + player2HP + " HP left!\n");
				if (player2HP < 0 || player2HP == 0) {
					message.channel.send({embed: { title: "TCG Bot | Mortal Kombat", color: red, description: "Uh-oh. Game over:\nPlayer 2 (<@!"+playerID[1]+">) has died. Player 1 (<@!"+playerID[0]+">) has won." }});
					console.log("Uh-oh. Player 2 ("+playerID[1]+") has died. Game is over. Player 1 ("+playerID[0]+") has won!");
					GameOver();
			 	}
				else {
					playerActive = 1;
					message.channel.send({embed: { title: "TCG Bot | Mortal Kombat", color: lime, description: "Player 2 (<@!"+playerID[1]+">)'s turn." }});
				}
			}else if(playerActive == 1 && player1HP < 20) {
				message.channel.send({embed: { title: "TCG Bot | Mortal Kombat", color: red, description: "To avoid a instant kill, you cannot punch this player, since their HP is below 20.\nPlease run \`mk!fight\` instead.\nIt is still your turn.\nTheir HP: "+player1HP, footer: { text: ""+footertxt+"" } }});
			}else if(playerActive == 1){
				player1HP = player1HP - damage;
				message.channel.send({ embed: { title: "TCG Bot | Mortal Kombat", color: yellow, description: "Player 2 has dealt " + damage + " damage to Player 1 with punch.\nPlayer 1 now has " + player1HP + " HP left!\n", footer: { text: ""+footertxt+"" } }});
				console.log("Player 2 has dealt " + damage + " damage to Player 1 with punch.\nPlayer 1 now has " + player1HP + " HP left!\n");
				if (player1HP < 0 || player1HP == 0) {
					message.channel.send({embed: { title: "TCG Bot | Mortal Kombat", color: red, description: "Uh-oh. Game over:\nPlayer 1 <@!"+playerID[0]+"> has died. Player 2 (<@!"+playerID[1]+">) has won." }});
					console.log("Uh-oh. Player 1 ("+playerID[0]+") has died. Game is over. Player 2 ("+playerID[1]+") has won!");
					GameOver();
				}
				else {
					playerActive = 0;
					message.channel.send({embed: { title: "TCG Bot | Mortal Kombat", color: lime, description: "Player 1 (<@!"+playerID[0]+">)'s turn." }});
				}
			}
		}else{
			message.channel.send({embed: { title: "TCG Bot | Mortal Kombat", color: red, description: "Game has not been started. Please verify all players are in the game and the game was started by \`mk!start\`" }});
		}
	}else if(message.content == "mk!fight kick") {
		if(playerID.length == 2 && ready == "yes") { //Ensures the game is ACTUALLY started
			var damage = Math.floor(Math.random() * 30) + 1;
			if(playerID[playerActive] != message.author.id){
				message.channel.send({embed: { title: "TCG Bot | Mortal Kombat", color: red, description: "You can't fight yet; it's <@!" + playerID[playerActive] + ">'s turn.." }});
			}else if(playerActive == 0 && player2HP < 30) {
				message.channel.send({embed: { title: "TCG Bot | Mortal Kombat", color: red, description: "To avoid a instant kill, you cannot kick this player, since their HP is below 30.\nPlease run \`mk!fight\` instead.\nIt is still your turn.\nTheir HP: "+player2HP, footer: { text: ""+footertxt+"" } }});
			}else if(playerActive == 0){
				player2HP = player2HP - damage;
				message.channel.send({ embed: { title: "TCG Bot | Mortal Kombat", color: yellow, description: "Player 1 has dealt " + damage + " damage to Player 2 with kick.\nPlayer 2 now has " + player2HP + " HP left!\n", footer: { text: ""+footertxt+"" } }});
				console.log("Player 1 has dealt " + damage + " damage to Player 2 with kick.\nPlayer 2 now has " + player2HP + " HP left!\n");
				if (player2HP < 0 || player2HP == 0) {
					message.channel.send({embed: { title: "TCG Bot | Mortal Kombat", color: red, description: "Uh-oh. Game over:\nPlayer 2 (<@!"+playerID[1]+">) has died. Player 1 (<@!"+playerID[0]+">) has won." }});
					console.log("Uh-oh. Player 2 ("+playerID[1]+") has died. Game is over. Player 1 ("+playerID[0]+") has won!");
					GameOver();
			 	}
				else {
					playerActive = 1;
					message.channel.send({embed: { title: "TCG Bot | Mortal Kombat", color: lime, description: "Player 2 (<@!"+playerID[1]+">)'s turn." }});
				}
			}else if(playerActive == 1 && player1HP < 30) {
				message.channel.send({embed: { title: "TCG Bot | Mortal Kombat", color: red, description: "To avoid a instant kill, you cannot kick this player, since their HP is below 30.\nPlease run \`mk!fight\` instead.\nIt is still your turn.\nTheir HP: "+player1HP, footer: { text: ""+footertxt+"" } }});
			}else if(playerActive == 1){
				player1HP = player1HP - damage;
				message.channel.send({ embed: { title: "TCG Bot | Mortal Kombat", color: yellow, description: "Player 2 has dealt " + damage + " damage to Player 1 with kick.\nPlayer 1 now has " + player1HP + " HP left!\n", footer: { text: ""+footertxt+"" } }});
				console.log("Player 2 has dealt " + damage + " damage to Player 1 with kick.\nPlayer 1 now has " + player1HP + " HP left!\n");
				if (player1HP < 0 || player1HP == 0) {
					message.channel.send({embed: { title: "TCG Bot | Mortal Kombat", color: red, description: "Uh-oh. Game over:\nPlayer 1 <@!"+playerID[0]+"> has died. Player 2 (<@!"+playerID[1]+">) has won." }});
					console.log("Uh-oh. Player 1 ("+playerID[0]+") has died. Game is over. Player 2 ("+playerID[1]+") has won!");
					GameOver();
				}
				else {
					playerActive = 0;
					message.channel.send({embed: { title: "TCG Bot | Mortal Kombat", color: lime, description: "Player 1 (<@!"+playerID[0]+">)'s turn." }});
				}
			}
		}else{
			message.channel.send({embed: { title: "TCG Bot | Mortal Kombat", color: red, description: "Game has not been started. Please verify all players are in the game and the game was started by \`mk!start\`" }});
		}
	}