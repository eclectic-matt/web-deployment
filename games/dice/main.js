import { Die } from 'Die';
import { Joker } from 'Joker';
import { ChipButty } from 'ChipButty';
import { EvensSteven } from 'EvensSteven';
import { ExtraInterest } from 'ExtraInterest';
import { Voucher } from 'Voucher';
import { Freeroll } from 'Freeroll';
import { MoreHandy } from 'MoreHandy';
import { Game } from 'Game';
import { UiManager } from 'UiManager';
import { ScoreManager } from 'ScoreManager';

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

export { diceGame, ui, scoreMgr, init, test };