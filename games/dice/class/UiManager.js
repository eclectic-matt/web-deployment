class UiManager 
{
	addJokerToUi(joker)
	{
		let jokerEl = document.createElement('div');
		jokerEl.style.width = '20%';
		/*jokerEl.style.margin = '1px';*/
		jokerEl.style.border = '1px solid white';
		jokerEl.classList.add('w3-col');
		jokerEl.classList.add('joker');
		jokerEl.classList.add('w3-tooltip');
		jokerEl.classList.add('w3-display-bottom');
		//OUTPUT JOKER NAME HEADER
		let jokerHead = document.createElement('h2');
		jokerHead.innerHTML = joker.data.name;
		jokerEl.appendChild(jokerHead);
		//OUTPUT JOKER DESCRIPTION 
		let jokerDescEl = document.createElement('span');
		jokerDescEl.id = joker.data.name.replace(' ', '_') + '_Tooltip';
		jokerDescEl.innerHTML = joker.data.description;
		jokerDescEl.classList.add('w3-text');
		jokerDescEl.classList.add('w3-black');
		jokerDescEl.classList.add('w3-text-white');
		jokerDescEl.style.position = 'absolute';
		jokerDescEl.style.left = '0px';
		jokerDescEl.style.bottom = '0px';
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
		let handScore = scoreMgr.scoreJokers(hand, game.data.jokers);;
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
		//dieEl.classList.add('rolling');
		const rollingAnimClassName = "w3-spin";
		const animRollTimeMs = 1000;
		dieEl.classList.add(rollingAnimClassName);
		setTimeout( (dieEl) => {
			dieEl.classList.remove(rollingAnimClassName);
		}, animRollTimeMs, dieEl);
		/*dieEl.addEventListener('animationEnd', function(e){
			e.currentTarget.style.classList.remove('rolling');
			console.log(e.currentTarget,'stopped rolling');
		}, false);*/
	}
	
	
	
	alertHandScore(scoreString)
	{
		let handScoreElId = 'handScoreTooltip';
		let handScoreEl = document.getElementById(handScoreElId);
		handScoreEl.classList.add('flash');
		handScoreEl.classList.remove('flash');
		handScoreEl.innerHTML = scoreString;
	}

	//====================
	// MODALS 
	//====================

	openRunInfoModal(){
		document.getElementById('runInfoModal').style.display = 'block';
		this.openRunInfoTab(false, 'PokerHands');

		//CLEAR AND RESET THE POKER HANDS TABLE 
		let pokerHandsTableEl = document.getElementById('pokerHandsTable');
		pokerHandsTableEl.innerHTML = null;
		//THIS SHOULD EVENTUALLY BE MORE DYNAMIC WITH # HANDS PLAYED - USE 0 FOR NOW
		let handsData = this.getHandsData();
		for(let hand of handsData){
			let tr = document.createElement('tr');
			//THE HAND TYPE NAME
			let td = document.createElement('td');
			td.innerHTML = hand;
			tr.appendChild(td);
			pokerHandsTableEl.appendChild(tr);
			//THE HAND MULTIPLIER
			//let handMult = this.hands.length - this.hands.indexOf(handType);
			let handMult = handsData.length - handsData.indexOf(hand);
			td = document.createElement('td');
			td.innerHTML = handMult + 'x';
			tr.appendChild(td);
			pokerHandsTableEl.appendChild(tr);
			//THE HAND LEVEL (planet cards)
			td = document.createElement('td');
			td.innerHTML = '(L1)';
			tr.appendChild(td);
			pokerHandsTableEl.appendChild(tr);
			//NUMBER OF TIMES HAND SCORED
			td = document.createElement('td');
			td.innerHTML = 0;
			tr.appendChild(td);
			pokerHandsTableEl.appendChild(tr);
		}
	}
	
	openRunInfoTab(evt, tabName) {
		const highlightClass = "w3-green";
		var i, x, tablinks;
		x = document.getElementsByClassName("tab");
		for (i = 0; i < x.length; i++) {
			x[i].style.display = "none";
		}
		tablinks = document.getElementsByClassName("tablink");
		for (i = 0; i < x.length; i++) {
			tablinks[i].className = tablinks[i].className.replace(highlightClass, "");
		}
		document.getElementById(tabName).style.display = "block";
		if(evt){
			evt.currentTarget.className += " " + highlightClass;
		}
	}

	getBlindsData(){
		//GET RELEVANT DATA FROM THE GAME 
		let data = diceGame.getBlindsAndStakesData(false);
		console.log('ui.getBlinds', data);
		return data;
	}

	getHandsData()
	{
		let data = diceGame.getHandsData();
		console.log('ui.getHandsData', data);
		return data;
	}

	openOptionsModal()
	{
		document.getElementById('optionsModal').style.display = 'block';
		//document.createEvent('click').
		this.openOptionsTab(false, 'Settings');
	}

	openOptionsTab(evt, tabName)
	{
		const highlightClass = "w3-green";
		var i, x, tablinks;
		x = document.getElementsByClassName("tab");
		for (i = 0; i < x.length; i++) {
			x[i].style.display = "none";
		}
		tablinks = document.getElementsByClassName("tablink");
		for (i = 0; i < x.length; i++) {
			tablinks[i].className = tablinks[i].className.replace(highlightClass, "");
		}
		document.getElementById(tabName).style.display = "block";
		if(evt){
			evt.currentTarget.className += " " + highlightClass;
		}
	}

	openAnteScoreModal(game)
	{
		let anteScore = scoreMgr.getAnteCash(game);
		this.updateAnteScoreModal(anteScore);
		document.getElementById('anteScoreModal').style.display = 'block';
	}

	updateAnteScoreModal(anteScore)
	{
		let anteScoreDiv = document.getElementById('anteScoreDiv');
		let roundScoreCash = anteScore.cash;
	}
	
	openShopModal()
	{
		document.getElementById('shopModal').style.display = 'block';
	}
	
	updateShopOptions(shop)
	{
		//CARDS ROW - JOKER / PLANET / SPECIAL - shopCardCardsRow
		//VOUCHER ROW - ONE PER ROUND ONLY - voucherRow
		//DICE UPGRADE ROW - ONE PER SHOP - diceUpgradeRow

	}
}