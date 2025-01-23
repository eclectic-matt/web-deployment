class ExampleJoker extends Joker
{
	constructor(data = false)
	{
		super(data);
		this.data.name = 'Example';
		this.data.description = 'This is an example';
		this.data.rarity = 'Common';
		this.data.price = 2;
	}
	init(game)
	{
    	//Nothing
    	super.init(game);
    }
    round(game)
    {
    	//Nothing
    	super.round(game);
    }
    discard(die)
    {
    	//Nothing
    	super.discard(die);
    }
    scoreDie(die)
    {
    	//Nothing
    	super.scoreDie(die);
    }
    scoreHand(hand)
    {
		//Nothing
		super.scoreHand(die);
	}
	win(game)
	{
		//Nothing
		super.win(game);
	}
	lose(game)
	{
		//Nothing
		super.lose(game);
	}
}