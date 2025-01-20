class Game 
{
	data = undefined;
	initTypes = [ 4, 6, 8, 10, 12 ];
	allTypes = [ 100, 50, 20, 12, 10, 8, 6, 4 ];
	hands = [
		'Max Values',	//The max value on all 5 dice (6 on a D6)
		'Five of a Kind',
		'Full House',	//Three of a Kind + One Pair
		'Four of a Kind',
		'Straight',
		'Three of a Kind',
		'Two Pair',
		'One Pair',
		'High Value', //A single die, highest value die used
	];
	faceUpgrades = [
		'Platinum', //5X
		'Gold',		//4X
		'Silver',	//3X
		'Bronze',	//2X
		'Standard'	//1X
	];
	shopUpgrades = {
		//SHOP UPGRADES COME IN FOUR FORMS - AND EACH ROUND YOU CAN ONLY BUY ONE OF EACH UPGRADE TYPE:
		// - FACE = UPGRADE ONE FACE OF A SELECTED DIE
		// - UPGRADE = INCREASE THE VALUE (D6->D8)  OF A SELECTED DIE
		// - MODIFIER = GET A NEW MODIFIER
		// - DICE = BUY A NEW (ADDITIONAL) DIE
		face: {
			description: 'Upgrade the multiplier on one face of a selected die (Max: Platinum= 5x)',
			cost: 'Value x 2'
		},
		upgrade: {
			description: 'Increase the type of one dice',
			cost: 'Type x 2'
		},
		modifier: {
			description: 'Modifies the game in some way',
			cost: 20
		},
		dice: {
			description: 'Buy an additional die',
			cost: 50
		}
	};
	shopModifiers = [
		'Highest Die Twice', //Count the highest die twice
		'Level Up',	//
		'Rerolls +3',
		'Hands +2',
		'Value +1'
	];
	//STAKE - DIFFICULTIES (Effects stack)
	stakes = [
		'Level 10 - No rerolls',
		'Level 9 - One Hand'
	]
	//GAME FLOW - 8 LEVELS OF SMALL / BIG / BOSS
	roundScores = [
		[ 100, 125, 150 ], 		//Round 1
		[ 200, 250, 300 ],		//Round 2
		[ 400, 500, 600 ],		//Round 3
		[ 700, 850, 1000 ], 	//Round 4
		[ 1200, 1500, 1800 ],	//Round 5
		[ 2000, 2500, 3000 ],	//Round 6
		[ 3750, 4500, 5500 ],	//Round 7
		[ 7000, 8500, 10000 ]	//Round 8
	]
	//Boss effects (for each round, randomly select one)
	bossEffects = [
		[ 'No 1s', '-1 reroll' ], 					//Round 1
		[ 'No 2s', '-1 hand' ],						//Round 2
		[ 'No repeats', 'One Hand' ],				//Round 3
		[ 'No 3s', '-2 reroll' ],					//Round 4
		[ 'No repeats', 'One Hand' ],				//Round 5
		[ 'Ignore Lowest Die', '-2 reroll' ],		//Round 6
		[ 'Ignore Lowest Die', 'No repeats' ],		//Round 7
		[ 'Ignore Highest Die', 'No Max Values' ]	//Round 8
	]

	constructor(data=false)
	{
		if(data){
			this.data = data;
		}else{
			this.initData();
			this.rollAllDice();
			this.updateUi();
		}
	}
	initData()
	{
		this.data = {};
		this.initDice();
		this.initState();
	}
	initDice()
	{
		this.data.dice = {};
		this.data.dice.count = 5;
		this.data.dice.types = this.initTypes;
		this.data.dice.dice = [];
		for(let i = 0; i < this.data.dice.count; i++){
			let die = new Die(this.data.dice.types[i]);
			this.data.dice.dice.push(die);
		}
		console.log('initDice', this.data.dice.dice);
	}
	initState()
	{
		this.data.state = {};
		this.data.state.level = 0;
		this.data.state.cash = 0;
		this.data.state.hands = 3;
		this.data.state.rerolls = 3;
		this.data.state.history = [];
	}
	
	getCurrentBestHand(hand)
	{
		//NO DICE SELECTED?
		if (hand.length == 0) return false;
		for (let i = 0; i < this.hands.length; i++) {
			switch (this.hands[i]) {
				case 'Max Values':
					let validMax = true;
					for(let i = 0; i < hand.length; i++){
						//IS THE DIE VALUE NOT THE MAX VALUE?
						if(hand[i].value !== hand[i].sides){
							validMax = false;
							break;
						}
					}
					if(validMax){
						return this.hands[i];
					}
				break;
				case 'Five of a Kind':
					let validFive = this.checkXOfAKind(hand, 5);
					if(validFive !== false){
						return this.hands[i] + ' - ' + validFive;
					}
				break;
				case 'Four of a Kind':
					let validFour = this.checkXOfAKind(hand, 4);
					if (validFour !== false) {
						//MATCH - RETURN THIS HAND 
						return this.hands[i] + ' - ' + validFour;
					}
					break;
				case 'Full House':
					let validFull = this.checkFullHouse(hand);
					if (validFull !== false) {
						//Matched Full House, split return array
						return this.hands[i] + ' - ' + validFull[0] + ' and ' + validFull[1];
					}
				break;
				case 'Straight':
					let straightOk = this.checkStraight(hand);
					if (straightOk !== false) {
						return this.hands[i] + ' - ' + straightOk;
					}
				break;
				case 'Three of a Kind':
					let threeOk = this.checkXOfAKind(hand, 3);
					if (threeOk !== false) {
						return this.hands[i] + ' - ' + threeOk;
					}
				break;
				case 'Two Pair':
					let firstPair = this.checkXOfAKind(hand, 2);
					if (firstPair !== false) {
						let remaining = hand.filter(d => { return d.value !== firstPair });
						let twoPair = this.checkXOfAKind(remaining, 2);
						//console.log('twoPair', firstPair, remaining, twoPair);
						if (twoPair !== false) {
							return this.hands[i] + ' - ' + twoPair + ' and ' + firstPair;
						}
					}
				break;
				case 'One Pair':
					let onePair = this.checkXOfAKind(hand, 2);
					if (onePair !== false) {
						return this.hands[i] + ' - ' + onePair;
					}
				break;
				case 'High Value':
				default:
					let dVals = hand.map(d => { return parseInt(d.value) });
					let highVal = Math.max(...dVals);
					return this.hands[i] + ' - ' + highVal;
				break;
			}
		}
	}

	checkStraight(origHand)
	{
		let hand = origHand.slice();
		//SORT IN PLACE
		hand.sort((a, b) => { return (a.value - b.value); });
		//console.log(cards);
		let index = hand[0].value;
		let valid = true;
		for (let i = 1; i < hand.length; i++) {
			//Sorted on value, aces high
			//console.log(i, cards[i].value, index,valid);
			if (hand[i].value - index != i) {
				valid = false;
				break;
			}
		}
		//console.log('straightAceHigh', valid);
		if (!valid) {
			//Check Ace low
			hand.sort((a, b) => { return (a - b); });
			//console.log(aceLow);
			valid = true;
			let index = hand[0];
			for (let i = 1; i < hand.length; i++) {
				if (hand[i] - index != i) {
					valid = false;
					break;
				}
			}
			//console.log('straightAceLow', valid, Math.max(...aceLow));
			if (valid) {
				//Return highest value of aces low values array
				return Math.max(...hand);
			}
		} else {
			// USE TOP VALUE AS RETURN
			return hand[hand.length - 1].value;
		}
		return valid;
	}

	/**
	 * Checks for X of a Kind and returns the matched value, or false if not matched.
	 * @param {array} cards The array of cards to search.
	 * @return {int|boolean} The value of a matching X of a Kind, or false if no valid match found.
	 */
	checkXOfAKind(hand, checkValue=4)
	{
		let values = hand.map(d => { return d.value; });
		let mostCommon = this.mode(values.slice());
		let commonCount = values.filter(val => { return val === mostCommon }).length;
		let returnVal = false;
		//Is the count of the most common value = the check value
		if (commonCount === checkValue) {
			returnVal = mostCommon;
		}
		return returnVal;
	}

	/**
	 * 
	 * @param {array} hand The array of dice.
	 * @returns {array|false} An array of values relating if a valid full house (three of a kind and pair as [THREE_OF_A_KIND_VALUE, PAIR_VALUE]) or false if not a valid full house.
	 */
	checkFullHouse(hand)
	{
		let returnVal = false;
		let threeMatch = this.checkXOfAKind(hand, 3);
		if (threeMatch) {
			//CHECK REMAINING TWO FORM A PAIR
			let values = hand.map(d => { return d.value; });
			values = values.filter(d => { return d !== threeMatch });
			if (values[0] == values[1]) {
				returnVal = [threeMatch, values[0]];
			}
		}
		//console.log('fullHouse', threeMatch, returnVal);
		return returnVal;
	}
	
	/**
	 * 
	 * @param {array} hand The hand of selected dice.
	 * @returns {array} The score for this hand, split into the constituent parts (hand type, face value, multiplier, total).
	 */
	scoreHand(hand)
	{
		//GET THE CURRENT BEST HAND FOR THE SELECTED DICE
		let bestHand = this.getCurrentBestHand(hand);
		let handType = bestHand.split(' - ')[0];
		let handValue = bestHand.split(' - ')[1];
		let handMult = this.hands.length - this.hands.indexOf(handType);
		let faceScores = hand.map( (d) => { return d.value; });

		//HOW SHOULD THE DICE VALUES BE USED?
		let faceTotal = 0;
		switch(handType){
			case 'High Value':
				//HIGH VALUE = SINGLE DIE VALUE USED
				faceTotal = handValue;
			break;
			case 'One Pair':
				//PAIR = DIE VALUE * 2
				faceTotal = handValue * 2;
			break;
			case 'Two Pair':
				//TWO PAIR = (DIE VALUE * 2) + (OTHER DIE VALUE * 2)
				let first = handValue.split(' and ')[0];
				let second = handValue.split(' and ')[1];
				faceTotal = (first * 2)+(second * 2);
			break;
			case 'Three of a Kind':
				//THREE OF A KIND = DIE VALUE * 3
				faceTotal = handValue * 3;
			break;
			case 'Four of a Kind':
				//FOUR OF A KIND = DIE VALUE * 4
				faceTotal = handValue * 4;
			break;
			case 'Straight':
			default:
				//FOR ALL OTHER HANDS, WE ARE USING ALL DICE SO ADD UP ALL DICE VALUES
				faceTotal = faceScores.reduce((partialSum, a) => partialSum + a, 0);
			break;
		}

		//RETURN AS AN OBJECT? 
		let returnScore = {
			type: handType,
			mult: handMult,
			faceTotal: faceTotal,
			score: faceTotal * handMult
		};
		return returnScore;
		//return faceTotal * handMult;
	}

	/**
	 * Rolls the die at the specified die index.
	 * @param {integer} dieIndex 
	 */
	rollDie(dieIndex)
	{
		this.data.dice.dice[dieIndex].roll();
	}
	
	/**
	 * Rolls all dice (and then updates the UI).
	 */
	rollAllDice()
	{
		//ITERATE THROUGH DICE
		for(let i of this.data.dice.dice){
			i.roll();
		}
		//Then update the UI
		this.updateUi();
	}
	
	/**
	 * Updates the UI to display the 
	 */
	updateUi()
	{
		//GET THE MAIN ELEMENT FOR THE GAME
		//let gameEl = document.getElementById('game');
		//gameEl.innerHTML = null;

		//THE KEY PARTS OF THE UI 
		// - menu element
		const menuElId = 'menu';
		const menuEl = document.getElementById(menuElId);
		// - the dice tray
		const diceTrayElId = 'diceTray';
		const diceTrayEl = document.getElementById(diceTrayElId);
		// - score elements
		const chipsScoreElId = 'chips';
		const chipsScoreEl = document.getElementById(chipsScoreElId);
		const multiplierScoreElId = 'multiplier';
		const multiplierScoreEl = document.getElementById(multiplierScoreElId);
		const currentScoreElId = 'currentScore';
		const currentScoreEl = document.getElementById(currentScoreElId);

		//OUTPUT DICE TRAY
		//CLEAR TRAY FROM PREVIOUS ROLL
		diceTrayEl.innerHTML = null;
		for(let i of this.data.dice.dice){
			let diceEl = document.createElement('div');
			//APPLY ALL STYLES IN CSS
			diceEl.className = 'die';
			//EXCEPT FOR THE BACKGROUND IMAGE WHICH IS DYNAMIC
			diceEl.style.backgroundImage = "url('images/plain_d" + i.sides + ".png')";
			diceEl.innerHTML = i.value;
			//gameEl.appendChild(diceEl);
			diceTrayEl.appendChild(diceEl);
		}
		
		//BEST HAND CALCULATION
		//const bestHand = this.getCurrentBestHand(this.getDice());
		let handScore = this.scoreHand(this.getDice());
		//OUTPUT SEPARATELY AS faceTotal (chips) VS. mult (multiplier)
		chipsScoreEl.innerHTML = handScore.faceTotal;
		multiplierScoreEl.innerHTML = handScore.mult;
		currentScoreEl.innerHTML = handScore.score;

		/*
		//OUTPUT THE CURRENT DICE TO THE CONSOLE?
		let currentDice = '';
		for(let i of this.data.dice.dice){
			currentDice += 'D' + i.sides + '=' + i.value + '.';
		}
		console.log('BEST HAND:',currentDice, bestHand + ' (' + handScore.faceTotal + ' values x ' + handScore.mult + ' hand multiplier = ' + handScore.score + ' points)');
		*/
	}
	
	getDice(){
		return this.data.dice.dice;
	}
	
	mode(arr){
		return arr.sort((a,b) =>
			arr.filter(v => v===a).length
			- arr.filter(v => v===b).length
		).pop();
	}
}
