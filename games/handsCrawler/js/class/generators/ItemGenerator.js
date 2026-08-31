/**
 * Class for generating items.
 */
class ItemGenerator
{
	constructor()
	{
		
	}
	
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