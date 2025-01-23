class FoilJoker extends Joker 
{
	constructor(data = false)
	{
		this.super(data);
		this.data.modifier = 'Foil';
	}
	init(game)
	{
    	//Nothing
    	this.super.init(game);
    }
    round(game)
    {
    	//Nothing
    	this.super.round(game);
    }
    discard(die)
    {
    	//Nothing
    	this.super.discard(die);
    }
    scoreDie(die)
    {
    	//Nothing
    	this.super.scoreDie(die);
    }
    scoreHand(hand)
    {
		//FOIL = +50 CHIPS
		this.super.scoreHand(die);
		return {
			type: 'chips',
			effect: 'add',
			value: 50
		}
	}
	win(game)
	{
		//Nothing
		this.super.win(game);
	}
	lose(game)
	{
		//Nothing
		this.super.lose(game);
	}
}
