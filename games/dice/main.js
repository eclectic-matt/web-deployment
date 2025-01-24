let diceGame;
let ui;
let scoreMgr;

function init(){
	ui = new UiManager();
	scoreMgr = new ScoreManager();
	diceGame = new Game();
	
	//TESTING HERE
	test(diceGame);
}

function test(game){
	//Get the evens joker and add to the game for free
	let evensJoker = new EvensJoker();
	game.addJoker(evensJoker);
	let ChipButtyJoker = new ChipButty();
	game.addJoker(ChipButtyJoker);
}