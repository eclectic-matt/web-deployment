//const Joker = require('./Joker.js');
//import Joker from './Joker.js';

class ExtraInterest extends Joker
{
	constructor(data = false)
	{
		super(data);
		this.data.name = 'Extra Interest';
		this.data.description = 'Gain £1 extra interest for every £5 cash';
		this.data.rarity = 'Uncommon';
		this.data.price = 12;
	}
	init(game)
	{
    	//Nothing
    }
    round(game)
    {
    	//Nothing
    }
    discard(die)
    {
    	//Nothing
    }
    scoreDie(die)
    {
		super.scoreDie(die);
    }
    scoreHand(hand)
    {
		//Nothing
		return {
			type: "chips",
			effect: "+",
			value: 10
		}
	}
	win(anteWin)
	{
		let returnWin = {
			type: 'cash',
			value: anteWin.interest
		}
		return returnWin;
		//Nothing
	}
	lose(game)
	{
		//Nothing
	}
}

//export { ExtraInterest };