class Game 
{
	data = undefined;
	antesPerRound = 3;
	roundsPerGame = 8;
	maxJokers = 5;
	initTypes = [ 4, 6, 8, 10, 12 ];
	allTypes = [ 100, 50, 20, 12, 10, 8, 6, 4 ];
	hands = [
		'Max Values',        //The max value on all 5 dice (6 on a D6)
		'Five of a Kind',
		'Full House',        //Three of a Kind + One Pair
		'Four of a Kind',
		'Straight',
		'Three of a Kind',
		'Two Pair',
		'One Pair',
		'High Value', //A single die, highest value die used
	];
	faceUpgrades = [
		'Platinum', //5X
		'Gold',                //4X
		'Silver',        //3X
		'Bronze',        //2X
		'Standard'        //1X
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
            this.loadRound(this.data.state.round);
            this.rollAllDice();
            //this.updateUi();
        }
    }
    initData()
    {
        this.data = {};
        this.initDice();
        this.initState();
        this.initJokers();
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

		this.data.state.round = 0;
		this.data.state.cash = 0;
		
		this.data.state.hands = this.data.state.initial.hands;
		this.data.state.rerolls = this.data.state.initial.rerolls;
		this.data.state.phase = 'ante';//choose, ante, shop
		this.data.state.score = 0;
		this.data.state.history = [];
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

	loadRound(round)
	{
		this.data.round = {};
		this.data.round.id = round;
		this.data.round.ante = 0;
		//Antes
		this.data.round.stakes = this.roundScores[round];
		
		//THE CURRENT ANTE REQUIREMENT IS HERE:
		this.data.round.score = this.data.round.stakes[this.data.round.ante];

		//BOSS EFFECTS (NOT YET IMPLEMENTED)
		let bossFx = this.bossEffects[round];
		this.data.round.bossEffect = Math.floor(Math.random() * bossFx.length);
	}
	
	loadPhase(phase){
		switch(phase){
			case 'choose':
				//Display current round blinds and offer skip/reward
			break;
			case 'ante':
			default:
				//The main game loop
			break;
			case 'shop':
				//Dice and "joker" upgrades
				
			break;
		}
	}

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


	//======================
	// NEXT / WIN / LOSE METHODS
	//======================

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
		if(this.data.round.ante === this.antesPerRound){
			this.nextRound();
		}
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
	initJokers(jokers = false)
	{
		if(!jokers){
			this.data.jokers = [];
		}else{
			this.data.jokers = jokers;
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
	//Move Joker
	
	//


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
			alert('Out of rerolls!');
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
			alert('Ante complete - score: ' + this.data.state.score);
			//SUCCESS - NEXT ANTE
			this.nextAnte();
		}else{
			if(this.data.state.hands === 0){
				alert('Out of hands - scored: ' + this.data.state.score);
			}
			//Reroll and deselect all scored dice
			for(let die of this.data.dice.dice) {
				if(die.selected){
					die.roll();
					die.selected = false;
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