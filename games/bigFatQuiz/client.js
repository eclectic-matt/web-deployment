class Client {
	game = undefined;
	register = (game) => {
		this.game = game;
	}
}

const gameClient = new Client();

//SERVER 
class Game 
{
	name = 'Big Fat Quiz';
	rounds = [];
	teams = [];

	//SETUP THIS GAME USING A DATA OBJECT CONTAINING name/rounds/teams
	setup = (data) => {
		this.name = data.name | 'Big Fat Quiz';
		this.rounds = data.rounds | [];
		this.teams = data.teams | [];
	}

	//ADD A TEAM TO THIS GAME
	addTeam = (data) => {
		//IF checkTeam() RETURNS TRUE
		if(!this.checkTeam(data)){
			this.teams.push(data);
		}
	}

	//CHECK IF THIS TEAM IS ALREADY STORED (MATCHED BY NAME AND ID)
	checkTeam = (data) => {
		const teamFound = this.teams.find( (team) => {
			//EXTRACT THE TEAM NAME
			const teamName = team.name; 
			const teamId = team.id;
			//RETURN TRUE IF BOTH NAME AND ID MATCH
			return (teamName === data.name && teamId === data.id);
		});
		//arr.find() RETURNS UNDEFINED IF NOT FOUND
		return (teamFound === undefined ? false : true); 
	}
}
var game = new Game();
const initData = {
	name: 'Big Fat Quiz 2024',
	rounds: [

	]
}
game.setup(initData);
gameClient.register(game);

//ADMIN 
const loadGameData = (data) => {
	
}
