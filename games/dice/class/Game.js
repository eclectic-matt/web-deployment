//import EvensSteven from './classes/jokers/EvensSteven.js';
//import { Joker} from './classes/jokers/Joker.js';

class Game 
{
	data = undefined;
	antesPerRound = 3;
	roundsPerGame = 8;
	maxJokers = 5;
	initTypes = [ 4, 6, 8, 10, 12 ];
	allTypes = [ 100, 50, 20, 12, 10, 8, 6, 4 ];
	hands = [
		'Max Values',  //The max value on all 5 dice (6 on a D6)
		'Five of a Kind',
		'Full House',  //Three of a Kind + One Pair
		'Four of a Kind',
		'Straight',
		'Three of a Kind',
		'Two Pair',
		'One Pair',
		'High Value',  //A single die, highest value die used
	];
	handData = [
		{
			name: 'Max Values',
			description: 'The max possible value on all 5 dice (e.g. 6 on a D6)',
			level: 1,
			mult: 30,
			planet: 'Pluto',
			scored: 0
		},
		{
			name: 'Five of a Kind',
			description: 'Five dice of the same value',
			level: 1,
			mult: 25,
			planet: 'Neptune',
			scored: 0
		},{
			name: 'Full House',
			description: 'Three of a Kind, plus One Pair',
			level: 1,
			mult: 20,
			planet: 'Uranus',
			scored: 0
		},
		{
			name: 'Four of a Kind',
			description: 'Four dice of the same value',
			level: 1,
			mult: 15,
			planet: 'Saturn',
			scored: 0
		},
		{
			name: 'Straight',
			description: 'Five dice of ascending value',
			level: 1,
			mult: 10,
			planet: 'Jupiter',
			scored: 0
		},
		{
			name: 'Three of a Kind',
			description: 'Three dice of the same value',
			level: 1,
			mult: 6,
			planet: 'Mars',
			scored: 0
		},
		{
			name: 'Two Pair',
			description: 'Two pairs of dice of the same value',
			level: 1,
			mult: 4,
			planet: 'Earth',
			scored: 0
		},
		{
			name: 'One Pair',
			description: 'A pair of dice of the same value',
			level: 1,
			mult: 2,
			planet: 'Venus',
			scored: 0
		},
		{
			name: 'High Value',
			description: 'The highest value single die',
			level: 1,
			mult: 1,
			planet: 'Mercury',
			scored: 0
		}
	]
	faceUpgrades = [
		'Platinum',   //5X
		'Gold',       //4X
		'Silver',     //3X
		'Bronze',     //2X
		'Standard'    //1X
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
        }
    };
    shopModifiers = [
        'Highest Die Twice', //Count the highest die twice
        'Level Up',        //
        'Rerolls +3',
        'Hands +2',
        'Value +1'
    ];
    //STAKE - DIFFICULTIES (Effects stack)
    stakes = [
        'Level 10 - No rerolls',
        'Level 9 - One Hand'
    ];
    anteNames = [
		'Small Blind',
		'Big Blind',
		'Boss Blind'
    ];
    //GAME FLOW - 8 LEVELS OF SMALL / BIG / BOSS
    roundScores = [
        [ 50, 75, 100 ],                 //Round 1
        [ 150, 225, 300 ],                //Round 2
        [ 400, 500, 600 ],                //Round 3
        [ 700, 850, 1000 ],         //Round 4
        [ 1200, 1500, 1800 ],        //Round 5
        [ 2000, 2500, 3000 ],        //Round 6
        [ 3750, 4500, 5500 ],        //Round 7
        [ 7000, 8500, 10000 ]        //Round 8
    ];
    //Boss effects (for each round, randomly select one)
    bossEffects = [
        [ 'No 1s', '-1 reroll' ],		//Round 1
        [ 'No 2s', '-1 hand' ],         //Round 2
        [ 'No repeats', 'One Hand' ],	//Round 3
        [ 'No 3s', '-2 reroll' ],       //Round 4
        [ 'No repeats', 'One Hand' ],   //Round 5
        [ 'Ignore Lowest Die', '-2 reroll' ],     //Round 6
        [ 'Ignore Lowest Die', 'No repeats' ],    //Round 7
        [ 'Ignore Highest Die', 'No Max Values' ] //Round 8
    ]
    
	//=====================
	// INITIALIZATION METHODS
	//=====================

    constructor(data=false)
    {
        if(data){
            this.data = data;
        }else{
            this.initData();
            this.loadStakes();
            this.loadRound(this.data.state.round);
            this.rollAllDice();
            //init at CHOOSE_SMALL?
            this.nextPhase();
            //this.updateUi();
        }
    }
    initData()
    {
        this.data = {};
        this.initDice();
        this.initState();
        //this.initJokers();
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
        //console.log('initDice', this.data.dice.dice);
    }
    initState()
    {
		this.data.state = {};
		
		//INITIAL IS THE "DEFAULT" VALUES (RESET EACH ANTE)
		this.data.state.initial = {};
		this.data.state.initial.hands = 3;
		this.data.state.initial.rerolls = 3;
		this.data.state.initial.cash = 0;
		//ROUND IS 0-INDEXED
		this.data.state.round = 0;
		this.data.state.stake = 0;
		//INIT VALUES
		this.data.state.cash = this.data.state.initial.cash;
		this.data.state.hands = this.data.state.initial.hands;
		this.data.state.rerolls = this.data.state.initial.rerolls;
		this.data.state.phases = [
			'START_ROUND',
			'CHOOSE_SMALL',
			'ANTE_SMALL',
			'SCORE_SMALL',
			'SHOP_SMALL',
			'CHOOSE_BIG',
			'ANTE_BIG',
			'SCORE_BIG',
			'SHOP_BIG',
			'CHOOSE_BOSS',	//NO ACTUAL CHOICE HERE
			'ANTE_BOSS',
			'SCORE_BOSS',
			'SHOP_BOSS',
			'CHECK_WIN'
		]
		this.data.state.phaseIndex = 0;
		this.data.state.score = 0;
		this.data.state.history = [];
	}
	
	//=================
	// LOAD FUNCTIONS
	//=================
	loadStakes()
	{
		if(this.data.state.stake == 0){
			//NO CHANGE
			return false;
		}
		//LOAD DEFAULTS
		let modifiedStakes = this.stakes;
		for(let r=0; r < this.roundScores.length; r++){
			for(let a=0; a < this.roundScores[r].length; a++){
				//Stakes are 2x - 9x higher
				modifiedStakes[r][a] = (this.data.state.stake * modifiedStakes[r][a]);
			}
		}
		//Save back over the stakes
		this.stakes = modifiedStakes;
	}

	//TERMINOLOGY DUMP:
	// The entire GAME is broken up into a series of ROUNDS (1 - 8) increasing in difficulty
	// Each ROUND:
	// - the game performs loadRound() which generates the stakes based on game difficulty and a random boss effect
	// - you first "Choose Your Blind" (choose) which allows skipping (TO ADD: SKIPPING REWARDS)
	// 		- then play your chosen stake to beat the current ANTE
	// 		- these antes are Small Blind (small) / Big Blind (big) / Boss Blind (boss)
	// 		- if you did not skip, you are then allowed to visit the SHOP
	//		- the shop allows you to buy one of three types of upgrade:
	//	- if you skipped, or you have completed the shop, and BOSS is not next, then go back to CHOOSE

	//LOAD ROUND JUST SETS THE CURRENT ROUND DATA (BOSS EFFECT, STAKES ETC)
	loadRound(round)
	{
		//Reset phase
		//this.data.state.phaseIndex = 0;
		
		this.data.round = {};
		this.data.round.id = round;
		this.data.round.ante = 0;
		this.data.round.shopFlags = {
			voucherBought: false
		}
		//Antes
		this.data.round.stakes = this.roundScores[round];
		
		//THE CURRENT ANTE REQUIREMENT IS HERE:
		this.data.round.score = this.data.round.stakes[this.data.round.ante];

		//Choose skip effects (store for consistency)
		let skipBonuses = [];
		let firstBonus = this.getSkipBonus(game, skipBonuses);
		skipBonuses.push(firstBonus);
		let secondBonus = this.getSkipBonus(game, skipBonuses);
		skipBonuses.push(secondBonus);
		this.data.round.skipBonuses = skipBonuses;

		//BOSS EFFECTS (NOT YET IMPLEMENTED)
		let bossFx = this.bossEffects[round];
		this.data.round.bossEffect = bossFx[Math.floor(Math.random() * bossFx.length)];
	}


	
	//==================
	// get data for 
	// UI methods
	//==================
	
	getBlindsAndStakesData(round=false)
	{
		if(!round){
			round = this.data.round.id;
		}
		return {
			stakes: this.roundScores[round],
			score: this.data.round.stakes[this.data.round.ante],
			bossFx: this.data.round.bossEffect
		};
	}

	getHandsData()
	{
		return this.hands;
	}
	
	getSkipBonus(round, previousBonuses)
	{
		//Init the default effect
		let bonusEffect = {
			type: 'Joker',
			subtype: 'Card',
			rarity: 'Common',
			modifier: 'Foil'
		};
		let bonusTypes = [
			'Planet',
			'Joker',
			'Booster',
			'Cash',
			'Foil',
			'Mega Booster',
			'Holographic',
			'Negative',
			'Polychrome',
		];
		let bonusRarity = [
			'Common',
			'Uncommon',
			'Rare',
			'Super Rare',
			'Legendary'
		];
		
		//GET A RANDOM REWARD BY round 
		let typeIndex = Math.floor(Math.random() * (round+1));
		let bonusRarityIndex = Math.floor(Math.random() * bonusRarity.length);
		bonusEffect.type = bonusTypes[typeIndex];
		bonusEffect.rarity = bonusRarity[bonusRarityIndex];
		if(previousBonuses.includes(bonusEffect)){
			bonusEffect.rarity = (bonusRarityIndex == 0 ? bonusRarity[1] : bonusRarity[bonusRarityIndex - 1]);
		}
		return bonusEffect;
	}
	
	earnSkipReward(name){
		/*switch(true){
			case ()
		}*/
	}
	
	getShopOption(type='card')
	{
		//This is called multiple times to populate the shop
		switch (type){
			case 'card':
				//Card row offers Jokers/Planet cards
				//Filter out current jokers
				//Planet/Joker balance = 30/70?
			break;
			case 'voucher':
				if(this.data.round.shopFlags.voucherBought){
					return false;
				}
				//let currentVouchers = this.data.vouchers.map()
			break;
			case 'booster':
				//Joker / Planet / 
				//Sizes = Std (2), Mega (4), Bumper (6)
			break;
			case 'die':
				//Offer a single die upgrade
			break;
		}
	}


	//======================
	// NEXT / WIN / LOSE METHODS
	//======================
	
	getPhaseInfo()
	{
		let current = this.data.state.phases[this.data.state.phaseIndex];
		let phaseInfo = current.split('_');
		//NAME = START/CHOOSE/ANTE/SCORE/SHOP/CHOOSE/CHECK
		let phaseName = phaseInfo[0];
		//TYPE = SMALL/BIG/BOSS
		let phaseType = phaseInfo[1];
		return {
			name: phaseName,
			type: phaseType
		}
	}

	//Trigger game phase progress using nextPhase()
	nextPhase()
	{
		//Increment phase index
		this.data.state.phaseIndex++;
		//Reset if equal to or over phases length
		if(this.data.state.phaseIndex >= this.data.state.phases.length){
			this.data.state.phaseIndex = 0;
			this.nextRound();
		}
		let phase = this.getPhaseInfo();
		console.log('nextPhase', this.data.state.phaseIndex, phase);
		switch(phase.name){
			case 'START':
				//Apply joker round start effects
				for(let joker of this.data.jokers){
					let startEffect = joker.round(this);
				}
				//This phase does nothing else, increment phase
				this.nextPhase();
			break;
			case 'CHOOSE':
				if(phase.type === 'BOSS'){
					//NOTHING TO CHOOSE
				}else{
					//Enable skip button for upcoming ante
					//this.data.round.skipBonuses 
				}
				ui.openChooseModal(this);
			break;
			case 'ANTE':
				//Apply ante effects
				this.nextAnte();
				//Get the subtype
				switch(phase.type){
					case 'SMALL':
						//UPDATE UI
					break;
					case 'BIG':
					
					break;
					case 'BOSS':
						//HANDLE BOSS EFFECT?
						switch(this.data.round.bossEffect){
							case 'Hidden Values':
								
							break;
						}
					break;
				}
				//APPLY UI CHANGES
				ui.updateUi(this);
			break;
			case 'SCORE':
				//Get score and display modal
				ui.openAnteScoreModal(this);
			break;
			case 'SHOP':
				//Get shop options and display modal
				ui.openShopModal(this);
			break;
			case 'CHECK':
				//Check end of round effects?
				
			break;
		}
	}

	nextAnte()
	{
		this.deselectAllDice();
		this.rollAllDice();
		this.data.round.ante++;
		//THE CURRENT ANTE REQUIREMENT IS HERE:
		this.data.round.score = this.data.round.stakes[this.data.round.ante];
		//RESET SCORE, HANDS, REROLLS FOR THE NEXT ANTE
		this.data.state.score = 0;
		this.data.state.hands = this.data.state.initial.hands;
		this.data.state.rerolls = this.data.state.initial.rerolls;
		//REACHED 3 - INCREMENT LEVEL
		//if(this.data.round.ante === this.antesPerRound){
			//this.nextRound();
		//}
		//this.updateDieValues();
		//this.updateUIMenu();
	}

	nextRound()
	{
		this.data.state.round++;
		if(this.data.state.round === this.roundsPerGame){
			//REACHED 8 - GAME COMPLETED! 
			this.win();
		}else{
			this.loadRound(this.data.state.round);
		}
	}

	win()
	{
		alert('You win - final score: ' + this.data.state.score);
	}

	lose()
	{
		alert('You lose - final score: ' + this.data.state.score);
	}
	
	
	//=====================
	// JOKER FUNCTIONS
	//=====================
	/**
	 * Initialise the jokers and availableJokers arrays.
	*/
	initJokers(jokers = false)
	{
		this.data.jokers = [];
		this.data.availableJokers = jokers;
	}
	/**
	 * For loading, setting initial jokers array.
	*/
	setJokers(jokers)
	{
		this.data.jokers = jokers;
	}
	/**
	 * Get the current jokers used in this game (getting names only with param).
	 * @param {boolean} returnNamesOnly Return the names only (true, default) or all joker data (false).
	 * @return {array} The array of Jokers (or just the Joker names).
	 */
	getJokers(returnNamesOnly=true){
		if(returnNamesOnly){
			return this.data.jokers.map( (j) => { return j.name; });
		}else{
			return this.data.jokers;
		}
	}
	addJoker(joker)
	{
		//Fail if joker limit reached
		if(this.data.jokers.length >= this.maxJokers) return false;
		//Otherwise add
		this.data.jokers.push(joker);
		ui.addJokerToUi(joker);
	}
	removeJoker(joker)
	{
		if(this.data.jokers.indexOf(joker) === false) return false;
		this.data.jokers.splice(this.data.jokers.indexOf(joker),1);
	}
	addJokerByName(name)
	{
		//REMOVE SPACES - names are "Chip Butty" but class is "ChipButty"
		name = name.replace(' ', '');
		let joker = new (this.data.availableJokers.get(name))();
		if(!joker) return false;
		this.addJoker(joker);
	}
	//Move Joker
	
	//==============
	//VOUCHERS
	//==============
	/**
	 * Initialise the vouchers and availableVouchers arrays.
	*/
	initVouchers(vouchers = false)
	{
		this.data.vouchers = [];
		this.data.availableVouchers = vouchers;
	}
	setVouchers(vouchers)
	{
		this.data.vouchers = vouchers;
	}
	addVoucher(voucher)
	{
		this.data.vouchers.push(voucher);
		ui.addVoucherToUi(voucher);
	}
	addVoucherByName(name)
	{
		//REMOVE SPACES - names are "Chip Butty" but class is "ChipButty"
		name = name.replace(' ', '');
		let voucher = new (this.data.availableVouchers.get(name))();
		if(!voucher) return false;
		this.addVoucher(voucher);
	}

	//=====================
	// DIE METHODS
	//=====================

	getDice()
	{
		return this.data.dice.dice;
	}
	
	getDieElementById(die)
	{
		let dieElId = die.name.replace(' ', '_') + 'Value';
		return document.getElementById(dieElId);
	}

	getSelectedDice()
	{
		return this.data.dice.dice.filter( (d) => { return d.selected === true; });
	}

	/**
	 * Rolls the die at the specified die index.
	 * @param {integer} dieIndex 
	 */
	rollDie(dieIndex)
	{
		this.data.dice.dice[dieIndex].roll();
		ui.updateUi(this);
	}

	/**
	 * Rolls all dice (and then updates the UI).
	 */
	rollAllDice()
	{
		//ITERATE THROUGH DICE
		for(let i of this.data.dice.dice){
			i.roll();
			ui.updateUiRollDie(i)
		}
		//Then update the UI
		ui.updateUi(this);
	}

	selectDie(name)
	{
		//Init count to enable/disable reroll/score buttons
		let selectedCount = 0;
		for(let die of this.data.dice.dice){
			if(die.name === name){
				die.selected = !die.selected;
			}
			if(die.selected){
				selectedCount++;
			}
		}
		if(selectedCount > 0){
			document.getElementById('rerollBtn').disabled = false;
			document.getElementById('scoreBtn').disabled = false;
		}else{
			document.getElementById('rerollBtn').disabled = true;
			document.getElementById('scoreBtn').disabled = true;
		}
		ui.updateUi(this);
	}

	deselectAllDice()
	{
		//ITERATE DICE TO DESELECT THEM
		for(let die of this.data.dice.dice){
			die.selected = false;
		}
	}
	
	rollSelectedDice()
	{
		//CHECK WE HAVE ENOUGH REROLLS
		if(this.data.state.rerolls === 0) {
			//alert('Out of rerolls!');
			return false;
		}
		//DECREMENT THE AVAILABLE REROLLS
		this.data.state.rerolls--;
		//ITERATE OVER THE DICE
		for(let die of this.data.dice.dice) {
			if (die.selected) {
				die.roll();
				die.selected = false;
				ui.updateUiRollDie(die);
			}
		}
		//Prevent double clicks
		document.getElementById('rerollBtn').disabled = true;
		ui.updateUi(this);
	}

	/**
	 * This is the main function that scores dice in the game. Uses ScoreManager.scoreJokers() to get the "base" score and then apply joker effects.
 	*/
	scoreSelectedDice()
	{
		//GET THE SCORE FOR THE SELECTED DICE VIA THE ScoreManager CLASS
		let handScore = scoreMgr.scoreJokers(this.getSelectedDice(), this.data.jokers);
		//PUSH THIS SCORE TO THE HISTORY
		this.data.state.history.push(['Scored a ' + handScore.type + ' of ' + handScore.value + ' = ' + handScore.score]);
		//DECREMENT AVAILABLE HANDS
		this.data.state.hands--;
		//ADD THE HAND SCORE TO THE CURRENT SCORE
		this.data.state.score += handScore.score;
		//IF WE HAVE REACHED THE CURRENT ANTE SCORE
		if(this.data.state.score >= this.data.round.score){
			//alert('Ante complete - score: ' + this.data.state.score);
			//SUCCESS - NEXT ANTE
			//this.nextAnte();
			this.nextPhase();
		}else{
			if(this.data.state.hands === 0){
				alert('Out of hands - scored: ' + this.data.state.score);
			}
			//Reroll and deselect all scored dice
			for(let die of this.data.dice.dice) {
				if(die.selected){
					die.roll();
					die.selected = false;
					ui.updateUiRollDie(die);
				}
			}
		}
		//Prevent double clicks
		document.getElementById('rerollBtn').disabled = true;
		document.getElementById('scoreBtn').disabled = true;
		ui.updateUi(this);
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

//export { Game };