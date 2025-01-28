class UiManager 
{
	/**
	 * Generates via getJokerElement and adds to the UI.
	 * @param {object} joker The joker data.
	 * @return void;
 	*/
	addJokerToUi(joker)
	{
		let jokerEl = this.getJokerElement(joker);
		const jokerRowElId = 'jokerRow';
		let jokerRowEl = document.getElementById(jokerRowElId);
		//Could check children if adding more than 5 and set all element widths appropriately
		//let widthPercent = Math.min(20, Math.floor(jokerRowEl.getChildren().length / 5));
		jokerEl.style.width = '20%';
		jokerRowEl.appendChild(jokerEl);
	}
	
	/**
	 * Generates a new Joker HTML element ready to insert into the UI.
	 * @param {object} joker The joker data object.
	 * @return {HTMLElement} The joker html element.
 	*/
	getJokerElement(joker)
	{
		let jokerEl = document.createElement('div');
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
		jokerDescEl.style.left = '10px';
		jokerDescEl.style.bottom = '10px';
		//jokerDescEl.style.width = (jokerEl.style.offsetWidth - 20) + 'px';
		//console.log(jokerEl.style.offsetWidth, jokerDescEl.style.width);
		jokerEl.appendChild(jokerDescEl);
		//BORDER = RARITY
		jokerEl.classList.add(joker.data.rarity);
		//EFFECT = MODIFIER
		if(joker.data.modifier){
			jokerEl.classList.add(joker.data.modifier);
		}
		return jokerEl;
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
		//CURRENTLY BROKEN, REWORKING
		return false;
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
	
	//=====================
	// ANTE SCORE RESULT
	//=====================
	openAnteScoreModal(game)
	{
		let anteScore = scoreMgr.getAnteCash(game);
		this.updateAnteScoreModal(anteScore);
		document.getElementById('anteScoreModal').style.display = 'block';
	}
	updateAnteScoreModal(anteScore)
	{
		let anteScoreDiv = document.getElementById('anteScoreDiv');
		anteScoreDiv.innerHTML = null;
		
		let anteScoreTableHead = document.createElement('h3');
		anteScoreTableHead.innerHTML = 'Ante Score';
		anteScoreDiv.appendChild(anteScoreTableHead);
		
		//START TABLE
		let anteScoreTable = document.createElement('table');
		anteScoreTable.classList.add('w3-table-all');
		anteScoreTable.classList.add('w3-text-black');
		anteScoreTable.classList.add('w3-center');
		
		//HEAD ROW - BLIND EARNINGS
		let anteScoreTableHeadRow = document.createElement('tr');
		let anteScoreTh = document.createElement('th');
		anteScoreTh.innerHTML = 'Blind Earnings';
		anteScoreTableHeadRow.appendChild(anteScoreTh);
		anteScoreTh = document.createElement('th');
		anteScoreTh.innerHTML = '_COIN_'.repeat(anteScore.blindEarnings) + '£' + (anteScore.blindEarnings);
		anteScoreTableHeadRow.appendChild(anteScoreTh);
		anteScoreTable.appendChild(anteScoreTableHeadRow);
		
		if(anteScore.handsRemaining > 0){
			//SECOND ROW - HANDS REMAINING
			let anteScoreHandsRow = document.createElement('tr');
			let anteScoreHandsTd = document.createElement('td');
			anteScoreHandsTd.innerHTML = 'Hands Remaining (' + anteScore.handsRemaining + ')';
			anteScoreHandsRow.appendChild(anteScoreHandsTd);
			anteScoreHandsTd = document.createElement('td');
			//anteScoreHandsTd.innerHTML = '_COIN_'.repeat(anteScore.handsRemaining) + ' = £' + (anteScore.handsRemaining);
			anteScoreHandsTd.innerHTML = '£' + (anteScore.handsRemaining);
			anteScoreHandsRow.appendChild(anteScoreHandsTd);
			anteScoreTable.appendChild(anteScoreHandsRow);
		}
		
		if(anteScore.interest > 0){
			//THIRD ROW - INTEREST
			let anteScoreInterestRow = document.createElement('tr');
			let anteScoreInterestTd = document.createElement('td');
			anteScoreInterestTd.innerHTML = 'Interest';
			anteScoreInterestRow.appendChild(anteScoreInterestTd);
			anteScoreInterestTd = document.createElement('td');
			//anteScoreInterestTd.innerHTML = '_COIN_'.repeat(anteScore.interest) + ' = £' + (anteScore.interest);
			anteScoreInterestTd.innerHTML = '£' + (anteScore.interest);
			anteScoreInterestRow.appendChild(anteScoreInterestTd);
			anteScoreTable.appendChild(anteScoreInterestRow);
		}
		
		if(anteScore.jokers.length > 0){
			//ITERATE JOKER SCORES TO OUTPUT
			for(let joker of anteScore.jokers){
				let jokerScoreRow = document.createElement('tr');
				let jokerScoreTd = document.createElement('td');
				jokerScoreTd.innerHTML = joker.name;
				jokerScoreRow.appendChild(jokerScoreTd);
				jokerScoreTd = document.createElement('td');
				jokerScoreTd.innerHTML = joker.cash;
				jokerScoreRow.appendChild(jokerScoreTd);
				anteScoreTable.appendChild(jokerScoreRow);
			}
		}
		
		//OUTPUT TOTAL (ALSO AS A th?)
		let totalScoreRow = document.createElement('tr');
		let totalScoreTh = document.createElement('th');
		totalScoreTh.innerHTML = 'Total';
		totalScoreRow.appendChild(totalScoreTh);
		totalScoreTh = document.createElement('th');
		totalScoreTh.innerHTML = '£' + anteScore.calcCash;
		totalScoreRow.appendChild(totalScoreTh);
		anteScoreTable.appendChild(totalScoreRow);
		
		anteScoreDiv.appendChild(anteScoreTable);
		
		/*
		
		/*anteWin = {
			calcCash: 0,
			blindEarnings: blindEarnings,
			hands: handsRemaining,
			rerolls: rerollsRemaining,
			interest: interest,
			jokers: []
		};*/
		
	}
	
	//=====================
	// SHOP MODAL
	//=====================
	openShopModal(game)
	{
		this.updateShopModal(game);
		document.getElementById('shopModal').style.display = 'block';
	}
	updateShopModal(game)
	{
		//CARDS ROW - JOKER / PLANET / SPECIAL - shopCardCardsRow
		//VOUCHER ROW - ONE PER ROUND ONLY - voucherRow
		//DICE UPGRADE ROW - ONE PER SHOP - diceUpgradeRow
		//BOOSTER PACKS ROW - TWO PER SHOP - boosterRow
		let cards = game.getShopOption('card');
		let voucher = game.getShopOption('voucher');
		let diceUp = game.getShopOption('dice');
		let boosters = game.getShopOption('booster');
	}
	
	//=====================
	// CHOOSE (SKIP) MODAL
	//=====================
	openChooseModal(game)
	{
		this.updateChooseModal(game);
		document.getElementById('chooseModal').style.display = 'block';
	}
	updateChooseModal(game)
	{
		const chooseModalElId = 'chooseDiv';
		let chooseModalEl = document.getElementById(chooseModalElId);
		
		//copy blindsDiv?0
		let blindsDiv = document.getElementById('blindsDiv');
		const clone = blindsDiv.cloneNode(true);
		chooseModalEl.appendChild(clone);
		
		return;

		chooseModalEl.classList.add('w3-row-padding');
		chooseModalEl.innerHTML = null;
		
		//3 COLUMNS - SMALL / BIG / BOSS
		const antes = [ 'SMALL', 'BIG', 'BOSS' ];
		let anteIndex = 0;
		for(let ante of antes){
			//OUTPUT ANTE COLUMN
			let anteColumn = document.createElement('div');
			anteColumn.classList.add('w3-col s4');
			let anteColumnHead = document.createElement('h4');
			anteColumnHead.innerHTML = ante + ' BLIND';
			anteColumn.appendChild(anteColumnHead);
			//IF BOSS, SHOW NAME?
			
			//SHOW SCORE
			let score = game.data.round.stakes[anteIndex];
			let scoreEl = document.createElement('p');
			scoreEl.innerHTML = 'Score at least: ' + score;
			anteColumn.appendChild(scoreEl);
			//IF BOSS, SHOW EFFECTS?
			
			
			//Output skip button if not boss
			if(ante !== 'BOSS'){
				let skipBtnEl = document.createElement('button');
				skipBtnEl.id = ante + 'skipBtn';
				//skipBtnEl.onclick = 'diceGame.skipAnte("' + ante + '");';
				skipBtnEl.innerHTML = 'Skip ' + ante;
				anteColumn.appendChild(skipBtnEl);
			}
			//ADD COLUMN
			chooseModalEl.appendChild(anteColumn);
		}
		
		//GET CURRENT PHASE TO DISABLE BUTTONS
		let phase = game.getPhaseInfo();
		switch (phase.type) {
			case 'SMALL':
				//Enable small, disable big
				document.getElementById('BIGskipBtn').disabled = true;
			break;
			case 'BIG':
				document.getElementById('SMALLskipBtn').disabled = true;
				document.getElementById('BIGskipBtn').disabled = false;
			break;
			case 'BOSS':
				//NO BUTTONS ENABLED
				document.getElementById('SMALLskipBtn').disabled = true;
				document.getElementById('BIGskipBtn').disabled = true;
			break;
		}
		
		//SHOW THE SKIP OPTION AND OFFER REWARD
		//THE BUTTONS SHOULD gainSkipReward()
		//THAT SHOULD TAKE YOU ON TO phase+=3
	}
}