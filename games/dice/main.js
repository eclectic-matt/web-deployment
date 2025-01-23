let diceGame;
let ui;

function init(){
	ui = new UiManager();
	diceGame = new Game();
	
	//TESTING HERE
	test(diceGame);
}

function test(game){
	//Get the evens joker and add to the game for free
	let evensJoker = new EvensJoker();
	game.addJoker(evensJoker);
}