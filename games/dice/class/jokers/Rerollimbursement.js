class Rerollimbursement extends Joker
{
	constructor(data = false)
	{
		super(data);
		this.data.name = 'Rerollimbursement';
		this.data.description = 'Gain cash equal to the first rerolled dice value each round';
		this.data.rarity = 'Uncommon';
		this.data.price = 8;
		this.data.tracking = {};
		this.data.tracking.roundUsed = -1;
	}
	init(game)
	{
    	//Nothing
    }
    round(game)
    {
    	//Nothing
    }
    discard(die, game=false)
    {
		//REQUIRE THE GAME OBJECT FOR THIS 
		if(!game) return false;
		//ALREADY USED THIS ROUND?
		if(this.data.tracking.roundUsed == game.data.round.id){
			return false;
		}
		//ELSE, STORE CURRENT ROUND AND THEN APPLY EFFECTS
		this.data.tracking.roundUsed = game.data.round.id;
		return {
			type: 'cash',
			effect: '+',
			value: die.value
		}
    }
    scoreDie(die)
    {
		super.scoreDie(die);
		//DO NOTHING ELSE
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