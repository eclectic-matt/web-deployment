class Rerollimbursement extends Joker
{
	constructor(data = false)
	{
		super(data);
		this.data.name = 'Wackernomics';
		this.data.description = 'Gain £1 per round. Increases by £1 for each hand played';
		this.data.rarity = 'Uncommon';
		this.data.price = 10;
		this.data.tracking = {};
		this.data.tracking.cashGainPerHand = 1;
		this.data.tracking.cashPerRound = 1;
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
		//Nothing
    }
    scoreDie(die)
    {
		super.scoreDie(die);
		//DO NOTHING ELSE
    }
    scoreHand(hand)
    {
		//INCREMENT CASH GAINS BY 1 PER HAND
		this.data.tracking.cashGainPerHand++;
	}
	win(game)
	{
		//PLAYER GAINS this.data.tracking.cashPerRound IN CASH
		return {
			type: 'cash',
			effect: '+',
			value: this.data.tracking.cashPerRound
		}
	}
	lose(game)
	{
		//Nothing
	}
}