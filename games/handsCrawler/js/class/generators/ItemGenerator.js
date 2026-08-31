/**
 * Class for generating items.
 */
class ItemGenerator
{
	itemData = {
		rarities: [
			{
				name: "Common",
				multiplier: 1
			},
			{
				name: "Uncommon",
				multiplier: 2
			},
			{
				name: "Rare",
				multiplier: 5
			},
			{
				name: "Mythical",
				multiplier: 10
			},
			{
				name: "Legendary",
				multiplier: 20
			}
		],
		types: [
			{
				name: "base",
				operation: "add",
				value: 5
			},
			{
				name: "base",
				operation: "multiply",
				value: 2
			},
			{
				name: "power",
				operation: "add",
				value: 5
			},
			{
				name: "power",
				operation: "multiply",
				value: 2
			},
			{
				name: "gold",
				operation: "add",
				value: 50
			},
			{
				name: "shield",
				operation: "add",
				value: 10
			}
		]
	}
	
	constructor()
	{
		
	}
	
	/*
	generateItem(
		effect = null,
		rarity = null, 
		material = null,
		category = null
	)
	{
	  //Generate an effect if not supplied
		if (effect === null)
		{
		  effect = generateEffect();
		}
	  //Generate an rarity if not supplied
		if (rarity === null)
		{
		  rarity = generateRarity();
		}
		//Generate an material if not supplied
	  if (material === null)
	  {
	    material = generateMaterial();
	  }
	  //Generate an category if not supplied
	  if (category === null)
	  {
	    category = generateCategory();
	  }
	  let item = null;
	  switch(category)
	  {
	    case "ring":
	      item = new Ring()
	      break;
	  }
	}
	*/
	
	generateRing(
		rarity = null, 
		effect = null
	){
		if(rarity === null)
		{
			rarity = this.generateInt();
		}
		if(effect === null)
		{
			effect = this.generateInt();
		}
		//Now ensure rarity between 0 - 4
		rarity = this.constrain(rarity, 1, this.itemData.rarities.length) - 1;
		let rarityObj = this.itemData.rarities[rarity];
		
		//Now ensure effect between 0 - 5
		effect = this.constrain(effect, 1, this.itemData.types.length) - 1;
		let effectObj = this.itemData.types[effect];
		
		let item = {
			rarity: rarityObj,
			effect: effectObj
		};
		
		return item;
	}
	
	generateInt(min = 1, max = 5)
	{
		return min + Math.floor(Math.random() * (max - min));
	}
	
	constrain(value, min = 1, max = 5)
	{
		return Math.min(Math.max(value, max), min);
	}
	
	generateEffect(type = "score")
	{
	  
	}
	
	generateRarity(min = 1, max = 5)
	{
		
	}
	
	generateMaterial(min = 1, max = 10)
	{
	  
	}
	
	generateCategory(min = 1, max = 5)
	{
	  
	}
}