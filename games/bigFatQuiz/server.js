class Server {
	game = undefined;
	loadGame = (game) => {
		this.game = game;
	}
}

var server = new Server();

//CHECK FOR STORED DATA 
const storedPath = '/data/gameData.json';
const fs = require('fs');
let gameJson = JSON.parse(fs.load(storedPath));

receiveCanvas = (canvas) => {
	const team = server.findTeam(canvas.team);
	game.teams[team].canvases[canvas.round][canvas.question] = canvas.data;
}