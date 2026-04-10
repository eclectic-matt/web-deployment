//DATA
const suitNames = ["Hearts", "Spades", "Diamonds", "Clubs"];
const suitValues = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suits = {
	//SUIT NAMES
	iSuitNames: Array.from(Array(4).keys()),
	sSuitNames: suitNames,
	//SUIT VALUES
	iSuitValues: Array.from(Array(13).keys()),
	sSuitValues: suitValues
}

//CLASSES
class Card 
{
	//VALUE
	iValue;	//integer (1=Ace...13=King)
	sValue;	//string (Ace...King)
	//SUIT
	iSuit;	//integer (1=H...4=C)
	sSuit;	//string (Hearts...Clubs)

	//Initialize this card with an integer suit (0-3) and value (0-12)
	constructor(iSuit, iValue)
	{
		this.iSuit = iSuit;
		this.sSuit = suits.sSuitNames[iSuit];
		this.iValue = iValue;
		this.sValue = suits.sSuitValues[iValue];
	}
}

class Deck 
{
	cards;		//[array]
	isShuffled;	//bool
	name;		//string

	//Initialize this deck with a name, optionally passing in cards
	constructor(name, cards = [])
	{
		this.name = name;
		this.cards = cards;
		this.isShuffled = false;
	}

	//Generate using a standard cards
	generateCardDeck = () => {
		let deck = [];
		/*suitNames.forEach( (suit) => {
			suitValues.forEach( (value) => {
				deck.push(value + " of " + suit);
			})
		});
		*/
		for(let value = 0; value < 13; value++){
			for(let suit = 0; suit < 4; suit++){
				let card = new Card(suit, value);
				deck.push(card);
			}
		}
		this.cards = deck;
	};

	//Shuffle all cards in this deck in place
	shuffle = () => 
	{
		var j, x, i;
		for (i = this.cards.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			x = this.cards[i];
			this.cards[i] = this.cards[j];
			this.cards[j] = x;
		}
		this.isShuffled = true;
	}

	//Shuffle a selection of cards passed into this method
	shuffleTheseCards = (cards) => 
	{
		var j, x, i;
		for (i = cards.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			x = cards[i];
			cards[i] = cards[j];
			cards[j] = x;
		}
		return cards;
	}
}