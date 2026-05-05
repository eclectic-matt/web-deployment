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