class EvensJoker extends Joker
{
	constructor(data = false)
	{
		super(data);
		this.data.name = 'Evens Steven';
		this.data.description = 'Each even die scored is worth double chips';
		this.data.rarity = 'Uncommon';
		this.data.price = 6;
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
    	if (die.value % 2 !== 0) return false;
		//return (die.value * 2);
		//Add the die value onto the chips value again
		return {
			type: 'chips',
			effect: '+',
			value: die.value
		}
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
}