class ChipButty extends Joker
{
	constructor(data = false)
	{
		super(data);
		this.data.name = 'Chip Butty';
		this.data.description = 'Gain 10 chips per hand';
		this.data.rarity = 'Common';
		this.data.price = 7;
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
	win(game)
	{
		//Nothing
	}
	lose(game)
	{
		//Nothing
	}
}