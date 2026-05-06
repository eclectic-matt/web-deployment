class Game 
{
	__constructor()
	{

	}

	setup()
	{
		this.daytime = {
			day: 1,
			time: 0
		}
		this.player = {
			character: undefined,
			stats: {
				strength: 2,
				agility: 2,
				xp: 0,
				purse: 2
			},
			rucksack: {
				brews: {
					life: false,
					pep: false,
					agility: false,
					reroll: false,
					attack: false,
					xp: false
				},
				tools: {
					clock: false,
					shovel: false,
					gloves: false,
					lantern: false
				},
				fish: [],
				materials: [],
				forageables: []
			}
		}
		this.quest = {
			name: undefined,
			progress: false
		}
		this.story = {
			deckRuns: 0,
			deck: [],
			discard: []
		}

    this.locations = fetch('./data/locations.json', { 
        method: 'GET'
      })
			.then(function(response) { 
        console.log('fetch.response', response);
        return response.json(); 
      })
			.then(function(json) {
        //this.locations = json;
        console.log('fetch.json', json);
        return json;
      }
    );
	}
	
	//====================
	// STORY CARDS
	//====================
	drawStoryCards(count = 1)
	{
		let rewards = [];
		for(let i = 0; i < count; i++)
		{
			let card = drawStoryCard();
			rewards.push(card);
		}
		return rewards;
	}
	
	drawStoryCard()
	{
		if(this.story.deck.length === 0)
		{
			this.refillStoryDeck();
		}
	}
	
	refillStoryDeck()
	{
		if(this.story.deckRuns == 0)
		{
			//Time passes - lose 1 time
			//Tax - 1 gem for every 10
			//Rot - lose 2 hazard cards from your supply
		}else{
			//Time passes - lose 1 time and 1 pep
			//Tax - 1 gem for every 10
			//Rot - lose ALL hazard cards from your supply
		}
		//Shuffle discards
		let cards = this.story.discards;
		cards = this.shuffle(cards);
		this.story.deck = cards;
		this.story.deckRuns++;
	}

	getDieFace(faceNumber)
	{
		switch(Number(faceNumber))
		{
			case 1:
				return "&#9856;";
			case 2:
				return "&#9857;";
			case 3:
				return "&#9858;";
			case 4:
				return "&#9859;";
			case 5:
				return "&#9860;";
			case 6:
			default:
				return "&#9861;";
		}
	}

	getLocation(locationName, side = 0, outputEl)
	{
		
	}

	updateAllDieFaces()
	{
		let dieEls = document.getElementsByTagName('die');
		for(let i = 0; i < dieEls.length; i++)
		{
			let face = dieEls[i].getAttribute('face');
			dieEls[i].innerHTML = this.getDieFace(face);
		}
	}
}