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
	constructor(iSuit, iValue)
	{
		this.iSuit = iSuit;
		this.sSuit = suits.sSuitNames[iSuit];
		this.iValue = iValue;
		this.sValue = suits.sSuitValues[iValue];
	}
}

//METHODS
const generateCardDeck = () => {
	let deck = [];
	suitNames.forEach( (suit) => {
		suitValues.forEach( (value) => {
			deck.push(value + " of " + suit);
		})
	});
	return deck;
};
const shuffle = (arr) => {
	var j, x, i;
	for (i = arr.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = arr[i];
		arr[i] = arr[j];
		arr[j] = x;
	}
	return arr;
}
const renderCard = (card) =>
{
	return false;
}

//EXAMPLES
let generatedDeck = generateCardDeck();
console.log(generatedDeck);
let shuffledDeck = shuffle(generatedDeck);
console.log(shuffledDeck);

const card = new Card(0,0);
console.log(card.sSuit, card.sValue);
const card2 = new Card(1,1);
console.log(card2.sSuit, card2.sValue);
const card3 = new Card(2,2);
console.log(card3.sSuit, card3.sValue);
const card4 = new Card(3,12);
console.log(card4.sSuit, card4.sValue);