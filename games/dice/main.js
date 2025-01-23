let diceGame;

function init(){
	diceGame = new Game();
	
	//TESTING HERE
	test(diceGame);
}

function test(game){
	let evensJoker = new EvensJoker();
	game.addJoker(evensJoker);
}