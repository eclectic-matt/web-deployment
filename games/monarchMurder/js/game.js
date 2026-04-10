class Game 
{
	datetimeStarted;		//Time the game started 2026-01-01 00:00:00
	datetimeFinished;		//Time the game finished 2026-01-01 23:59:59
	round;					//The current round 1 - 1000
	decks;					//The decks for the current game
	
	//Initialize this game
	constructor()
	{
		this.datetimeStarted = Date.now();
		this.datetimeFinished = undefined;
		this.round = 1;
		this.decks = [];
		//this.setup();
	}

	//Setup the game
	setup = () => 
	{
		//Castle Deck (Monarchs)
		let castleDeck = new Deck("Castle");
		castleDeck.generateCardDeck();
		//Only add cards with a value >= 10 (Jack, Queen, King)
		castleDeck.cards = castleDeck.cards.filter(c => c.iValue >= 10);
		//Now, we need to shuffle each card by value (shuffle all jacks, then all queens...)
		for(let value = 10; value < 13; value++)
		{

		}
		this.decks.push(castleDeck);
		console.log(castleDeck);
		//Tavern Deck (starting draws)
		let tavernDeck = new Deck("Tavern");
		tavernDeck.generateCardDeck();
		//Only add cards with a value < 10 (A - 10)
		tavernDeck.cards = tavernDeck.cards.filter(c => c.iValue < 10);
		this.decks.push(tavernDeck);
		console.log(tavernDeck);
	}
}