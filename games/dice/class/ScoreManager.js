class ScoreManager 
{
	hands = [
		'Max Values',   //The max value on all 5 dice (6 on a D6)
		'Five of a Kind',
		'Full House',   //Three of a Kind + One Pair
		'Four of a Kind',
		'Straight',
		'Three of a Kind',
		'Two Pair',
		'One Pair',
		'High Value', //A single die, highest value die used
	];
	//Logic moved out of scoreSelectedDice()
	scoreJokers(hand, jokers)
	{
		if(hand.length === 0) return false;
		let totalScore = 0;
		//Initialize handscore
		let handScore = this.scoreHand(hand);
		let totalChips = 0;//parseInt(handScore.value);
		let totalMult = parseInt(handScore.mult);
		//this.data.state.hands--;
		//Alert the base score 
		ui.alertHandScore(handScore.score);
		
		//JUST AWARE THAT I'M PLANNING TO INCLUDE A JOKER THAT IS "EVERY DIE COUNTS FOR SCORING" - INIT A FLAG HERE
		const specialScoringDieName = 'Score Everything';
		let specialScoringDieFlag = false;
		if(jokers.map( (j) => { return j.name; }).includes(specialScoringDieName)){
			specialScoringDieFlag = true;
		}
		
		//First, score each die
		for(let die of hand){
			//Skip if die NOT used in scoring, AND specialScoringFlag is false
			if(
				(!handScore.diceUsed.includes(die.name)) &&
				(!specialScoringDieFlag)
			){
				//console.log('Skipping ', die.name);
				continue;
			}
			
			//Add the die value to the total - jokers may add onto this
			totalChips += die.value;
			
			//Else, iterate jokers and score the die
			for(let joker of jokers){
				//Die scores are just 
				let dScore = joker.scoreDie(die);
				if(dScore){
					switch (dScore.type) {
						case 'chips':
							switch (dScore.effect) {
								case '+':
									totalChips += parseInt(dScore.value);
								break;
								case '*':
									totalChips *= parseInt(dScore.value);
								break;
								case '/':
									totalChips = Math.floor(totalChips / dScore.value);
								break;
								case '-':
									totalChips -= parseInt(dScore.value);
								break;
							}
						break;
						case 'mult':
							switch (dScore.effect) {
								case '+':
									totalMult += parseInt(dScore.value);
								break;
								case '*':
									totalMult *= parseInt(dScore.value);
								break;
								case '/':
									totalMult = Math.floor(totalMult / dScore.value);
								break;
								case '-':
									totalMult -= parseInt(dScore.value);
								break;
							}
						break;
					}
					//console.log('jDie', dScore);
					//Notify die score
					die.alertScore(dScore.type + ' ' + dScore.effect + '' + dScore.value);
				}
			}
		}
		
		//THEN ITERATE JOKERS AND SCORE THE HAND OVERALL
		for(let joker of jokers){
			let hEffect = undefined;
			let hValue = 0;
			let hScore = joker.scoreHand(hand);
			if(hScore){
				//SWITCH type
				switch(hScore.type){
					case 'chips':
						switch(hScore.effect){
							case '+':
								totalChips += hScore.value;
							break;
							case '*':
								totalChips *= hScore.value;
							break;
							case '/':
								totalChips = Math.floor(totalChips / hScore.value);
							break;
							case '-':
								totalChips -= hScore.value;
							break;
						}
					break;
					case 'mult':
						switch(hScore.effect){
							case '+':
								totalMult += hScore.value;
							break;
							case '*':
								totalMult *= hScore.value;
							break;
							case '/':
								totalMult = Math.floor(totalMult / hScore.value);
							break;
							case '-':
								totalMult -= hScore.value;
							break;
						}
					break;
				}
				//console.log('jHand', hScore);
				//Notify hand score
				ui.alertHandScore(hScore.type + ' ' + hScore.effect + '' + hScore.value);
			}
		}
		
		//Calculate Score
		totalScore = parseInt(totalChips * totalMult);
		//console.log('totalScore', totalScore, totalChips, totalMult);
		//Nofify Total Score
		ui.alertHandScore('Score: ' + totalScore);
		//Apply Score
		//this.data.state.score += totalScore;
		
		return {
			type: handScore.type,
			faceTotal: totalChips,
			mult: totalMult,
			value: handScore.value,
			score: totalScore
		}
	}

	//=====================
	// SCORING METHODS
	//=====================

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
					if(validMax && hand.length >= 5){
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
					//if straights with 4 valid, set as 2nd param
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
					if(firstPair !== false) {
						let remaining = hand.filter(d => { return d.value !== firstPair });
						let twoPair = this.checkXOfAKind(remaining, 2);
						//console.log('twoPair', firstPair, remaining, twoPair);
						if(twoPair !== false) {
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

	checkStraight(origHand, minLength=5)
	{
		if(origHand.length < minLength) return false;
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
	 * @returns {array|boolean} An array of values relating if a valid full house (three of a kind and pair as [THREE_OF_A_KIND_VALUE, PAIR_VALUE]) or false if not a valid full house.
	 */
	checkFullHouse(hand)
	{
		let returnVal = false;
		if(hand.length < 5) return false;
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
		//IF THIS IS FALSE (IF NO CARDS SELECTED) THEN RETURN false
		if(!bestHand) return false;

		let handType = bestHand.split(' - ')[0];
		let handValue = bestHand.split(' - ')[1];
		if(handValue == undefined) return false;
		
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
				//Overwrite handValue as an array 
				handValue = [ first, second ];
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

		//GET THE DICE USED TO MAKE THIS HAND
		let diceUsed = this.getDiceUsed(hand, handType, handValue);
		//console.log(hand, handType, diceUsed);

		//RETURN AS AN OBJECT? 
		let returnScore = {
				type: handType,
				value: handValue,
				mult: handMult,
				faceTotal: faceTotal,
				score: faceTotal * handMult,
				diceUsed: diceUsed
		};
		return returnScore;
		//return faceTotal * handMult;
	}

	getDiceUsed(hand, type, values)
	{
		//INIT AN ARRAY OF DIE NAMES TO RETURN
		let returnNames = [];
		switch(type){
			case 'High Value':
				for(let d of hand){
					//console.log('HIGH VALUE', d);
					if(
						(d.selected) && 
						(d.value == values)
					){
						returnNames.push(d.name);
						//ONLY ONE VALUE/DIE USED - EXIT NOW
						break;
					}
				}
			break;
			case 'One Pair':
				for(let d of hand){
					//IF THIS DIE IS SELECTED, THE VALUE IS PART OF THE PAIR, AND THIS WAS NOT ALREADY ADDED TO THE RETURN NAMES ARRAY (UNECESSARY LAST CHECK?)
					if(
						(d.selected) && 
						(d.value == values) && 
						(returnNames.includes(d.name) === false)
					){
						returnNames.push(d.name);
						//KEEP ITERATING TO FIND THE SECOND PAIRED DIE
					}
				}
			break;
			case 'Two Pair':
				//ITERATE OVER THE VALUES REQUIRED (TWO SEPARATE PAIR VALUES)
				for(let v of values){
					for(let d of hand){
						//IF THIS DIE IS SELECTED, THE VALUE MATCHES THE CURRENT PAIR VALUE, AND THIS DIE WAS NOT ALREADY ADDED TO THE RETURN NAMES ARRAY
						if(
							(d.selected) && 
							(d.value == v) && 
							(returnNames.includes(d.name) === false)
						){
							returnNames.push(d.name);
						}
					}
				}
			break;
			case 'Three of a Kind':
				for(let d of hand){
					//IF THIS DIE IS SELECTED, THE VALUE MATCHES THE 3OAK VALUE, AND THIS DIE WAS NOT ALREADY ADDED TO THE RETURN NAMES ARRAY
					if(
						(d.selected) && 
						(d.value == values) && 
						(returnNames.includes(d.name) === false)
					){
						returnNames.push(d.name);
					}
				}
			break;
			case 'Four of a Kind':
				for(let d of hand){
					//IF THIS DIE IS SELECTED, THE VALUE MATCHES THE 3OAK VALUE, AND THIS DIE WAS NOT ALREADY ADDED TO THE RETURN NAMES ARRAY
					if(
						(d.selected) && 
						(d.value == values) && 
						(returnNames.includes(d.name) === false)
					){
						returnNames.push(d.name);
					}
				}
			break;
			default:
				//ALL OTHER HAND TYPES USE ALL 5 DICE - JUST RETURN ALL FIVE DICE!
				for(let d of hand){
					returnNames.push(d.name);
				}
			break;
		}
		//console.log('getDiceUsed', returnNames, hand, type, values);
		return returnNames;
	}

	//=====================
	// UTILITY METHODS
	//=====================
	
	mode(arr){
		return arr.sort((a,b) =>
			arr.filter(v => v===a).length
			- arr.filter(v => v===b).length
		).pop();
	}
}