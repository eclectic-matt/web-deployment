class UiManager 
{
	addJokerToUi(joker)
	{
		let jokerEl = document.createElement('div');
		jokerEl.classList.add('w3-col');
		jokerEl.style.width = '20%';
		jokerEl.classList.add('joker');
		//OUTPUT JOKER NAME HEADER
		let jokerHead = document.createElement('h3');
		jokerHead.innerHTML = joker.data.name;
		jokerEl.appendChild(jokerHead);
		//OUTPUT JOKER DESCRIPTION 
		let jokerDescEl = document.createElement('span');
		jokerDescEl.innerHTML = joker.data.description;
		jokerEl.appendChild(jokerDescEl);
		//BORDER = RARITY
		jokerEl.classList.add(joker.data.rarity);
		//EFFECT = MODIFIER
		if(joker.data.modifier){
			jokerEl.classList.add(joker.data.modifier);
		}
		const jokerRowElId = 'jokerRow';
		document.getElementById(jokerRowElId).appendChild(jokerEl);
	}

	/**
	 * Updates the UI to display the 
	 */
	updateUi(game)
	{
		let dice = game.data.dice.dice;
		this.updateUIDice(dice);
		this.updateDieValues(dice);
		
		let state = game.data.state;
		let hand = game.getSelectedDice();
		let anteName = game.anteNames[game.data.round.ante];
		let roundScore = game.data.round.stakes[game.data.round.ante];
		let stake = game.data.round.stakes[game.data.round.ante];
		let handScore = game.scoreJokers(hand);;
		this.updateUIMenu(state, hand, anteName, roundScore, handScore);
	}


	updateUIMenu(state, hand, anteName, roundScore, handScore)
	{
		//THE KEY PARTS OF THE UI 
		// - menu element
		//const menuElId = 'menu';
		//const menuEl = document.getElementById(menuElId);

		// - score elements
		const chipsScoreElId = 'chips';
		const chipsScoreEl = document.getElementById(chipsScoreElId);
		const multiplierScoreElId = 'multiplier';
		const multiplierScoreEl = document.getElementById(multiplierScoreElId);
		const currentScoreElId = 'currentScore';
		const currentScoreEl = document.getElementById(currentScoreElId);
		
		//Update header
		const menuHeaderElId = 'menuHeader';
		const menuHeaderEl = document.getElementById(menuHeaderElId);
		//menuHeaderEl.innerHTML = null;
		//OUTPUT AS 
		//h2 - Choose your next Blind / Small Blind / Big Blind / Boss Blind / SHOP
		//Score at least: roundStake / ""
		//let anteNameHeadEl = document.createElement('h2');
		let anteNameHeadEl = document.getElementById('currentRoundRequirements');
		//let anteName = this.anteNames[this.data.round.ante];
		anteNameHeadEl.innerHTML = anteName;
		
		let roundScoreSpanEl = document.getElementById('currentRoundStake');
		//let roundScore = this.data.round.stakes[this.data.round.ante];
		
		if(state.phase === 'ante'){
			roundScoreSpanEl.innerHTML = ' - Score at least ' + roundScore;
		}
		//roundScoreSpanEl.innerHTML = 'Score at least ' + roundScore;
		menuHeaderEl.appendChild(anteNameHeadEl);
		menuHeaderEl.appendChild(roundScoreSpanEl);
		
		//Update hands/rerolls
		//currentRoundHands
		const currHandsElId = 'currentRoundHands';
		const currHandsEl = document.getElementById(currHandsElId);
		currHandsEl.innerHTML = state.hands;
		
		const currRerollsElId = 'currentRoundRerolls';
		const currRerollsEl = document.getElementById(currRerollsElId);
		currRerollsEl.innerHTML = state.rerolls;
		
		//currentCash
		const currCashElId = 'currentCash';
		const currCashEl = document.getElementById(currCashElId);
		currCashEl.innerHTML = state.cash;
		
		//Round Score
		const currScoreElId = 'roundScore';
		const currScoreEl = document.getElementById(currScoreElId);
		currScoreEl.innerHTML = state.score;
		
		//BEST HAND CALCULATION
		//let handScore = this.scoreHand(this.getSelectedDice());
		//let handScore = this.scoreJokers(this.getSelectedDice());
		let currHandEl = document.getElementById('currentHandText');

		if(handScore){
			//OUTPUT SEPARATELY AS faceTotal (chips) VS. mult (multiplier)
			chipsScoreEl.innerHTML = handScore.faceTotal;
			multiplierScoreEl.innerHTML = handScore.mult;
			currentScoreEl.innerHTML = handScore.score;
		
			//IF AN ARRAY OF VALUES WAS RETURNED (FULL HOUSE / TWO PAIR ONLY)
			if(Array.isArray(handScore.value)){
				//OUTPUT WITH A JOIN
				currHandEl.innerHTML = handScore.type + ' (' + handScore.value.join(' + ') + ')';
			}else{
				//OUTPUT THE TYPE NAME AND THE SINGLE VALUE THIS RELATES TO (STRAIGHT 7, PAIR K)
				currHandEl.innerHTML = handScore.type + ' (' + handScore.value + ')';
			}
			//APPLY FIRE EFFECT?
			if(handScore.score >= roundScore){
				//console.log('FIRE!', handScore.score, roundScore);
				chipsScoreEl.classList.add('fire');
				multiplierScoreEl.classList.add('fire');
				currentScoreEl.classList.add('fire');
			}else{
				//console.log('NO FIRE!', handScore.score, roundScore);
				chipsScoreEl.classList.remove('fire');
				multiplierScoreEl.classList.remove('fire');
				currentScoreEl.classList.remove('fire');
			}
		}else{
			currHandEl.innerHTML = 'Select some dice!';
			chipsScoreEl.innerHTML = 0;
			multiplierScoreEl.innerHTML = 0;
			currentScoreEl.innerHTML = 0;
		}
	}

	updateUIDice(dice)
	{
		//ITERATE OVER THE STORED DICE
		for(let die of dice)
		{
			let diceEl = document.getElementById(die.name.replace(' ', '_'));
			//The current die's (rolled) value
			let diceValueEl = document.getElementById(die.name.replace(' ', '_') + '_Value');
			diceValueEl.innerHTML = die.value;
			//SELECTED DIE?
			if(die.selected){
				//diceEl.className = 'die w3-col s2 w3-border-red';
				//diceValueEl.className = 'w3-red w3-text-white';
			}
			let dieName = die.name;
			diceEl.onclick = function(){
				diceGame.selectDie(dieName);
			}
		}
	}

	//SPECIFIC LOGIC FOR GETTING A NEW IMAGE FOR AN UPGRADED DIE
	updateDieTypeImageUI(die)
	{
		//BACKGROUND IMAGE FROM IMAGES FOLDER
		let diceImageEl = document.getElementById(die.name.replace(' ', '_') + '_Image');
		diceImageEl.src = 'images/plain_d' + die.sides + '.png';
	}

	updateDieValues(dice)
	{
		for(let die of dice){
			let dieEl = document.getElementById(die.name.replace(' ', '_'));
			let id = die.name.replace(' ', '_') + '_Value';
			let valueSpan = document.getElementById(id);
			valueSpan.innerHTML = die.value;
			if(die.selected){
				dieEl.classList.add('selected');
				//valueSpan.className = 'w3-red w3-text-white';
			}else{
				dieEl.classList.remove('selected');
				//valueSpan.className = 'w3-text-white';
			}
		}
	}
	
	updateUiRollDie(die)
	{
		let dieEl = document.getElementById(die.name.replace(' ', '_'));
		dieEl.classList.add('rolling');
		dieEl.addEventListener('animationEnd', function(e){
    		e.currentTarget.style.classList.remove('rolling');
    		console.log(e.currentTarget,'stopped rolling');
		}, false);
	}
	
	
	
	alertHandScore(scoreString)
	{
		let handScoreElId = 'handScoreTooltip';
		let handScoreEl = document.getElementById(handScoreElId);
		handScoreEl.classList.add('flash');
		handScoreEl.classList.remove('flash');
		handScoreEl.innerHTML = scoreString;
	}
}