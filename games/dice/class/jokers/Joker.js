class Joker 
{
	data = undefined;
	constructor(data=false)
    {
        if(data){
            this.data = data;
        }else{
            this.initData();
        }
    }
    initData()
    {
    	this.data = {};
    	this.data.scored = 0;
    	this.data.name = 'Empty Joker';
    	this.data.description = 'No effect';
    	this.data.rarity = 'Common';
    	this.data.modifier = undefined;
    	this.data.price = 1;
    	this.data.tooltips = [];
    	this.data.timeouts = [];
    }
    
    //EXTENDED CLASSES MUST IMPLEMENT THE FOLLOWING:
    // - init(game) => when the Joker is brought into play
    // - round(game)
	// - discard(die)
	// - scoreDie(die)
	// - scoreHand(hand)
	// - win(game)
	// - lose(game)
	
    init(game){
    	//Nothing
    }
    round(game){
    	//Nothing
    }
    discard(die){
    	//Nothing
    }
    //Extended classes should call super.scoreDie() within their own score() method
    scoreDie(die)
    {
    	//No behaviour by default, other than incrementing its internal "scored" counter
    	this.data.scored++;
    }
    scoreHand(hand)
    {
		//Nothing
	}
	win(game)
	{
		//Nothing
	}
	lose(game)
	{
		//Nothing
	}
	
	//=======
	//Alert
	//=======
	alertScore(scoreString)
	{
		//dScore.type + ' ' + dScore.effect + '' + dScore.value);
		//Set a delay and queue?
		this.data.tooltips.push(scoreString);
		this.data.timeouts.push(setTimeout((joker, scoreString) => {
			let tooltipEl = document.getElementById(joker.data.name.replace(' ', '_') + '_Tooltip');
			let newScoreSpan = document.createElement('span');
			newScoreSpan.innerHTML = scoreString;
			tooltipEl.appendChild(newScoreSpan);
			joker.data.tooltips.pop();
		}, 500 * this.data.tooltips.length, this, scoreString));
	}
	
	clearAlert()
	{
		this.data.tooltips = [];
		this.data.timeouts = [];
		let tooltipEl = document.getElementById(this.data.name.replace(' ', '_') + '_Tooltip');
		tooltipEl.innerHTML = null;
	}
}

//export { Joker };