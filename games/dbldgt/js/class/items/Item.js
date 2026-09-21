/**
 * Base class for all items, to be extended by different types.
 */
class Item
{
	//Private fields
	//- unique ID for this item
	#id = "generic_item_000";
	//- the type (ring/held/consumable etc)
	#type = "item";
	//Public fields
	//- readable item name
	name = "item";
	//- readable item description
	description = "A common generic item";
	//- the cost in coins
	//- the sale value = Math.floor(cost / 2);
	cost = 1;
	
	constructor(type, name)
	{
		this.#id = category + "_" + name + "_" + new Date().getMilliseconds();
		this.#type = type;
		this.name = name;
	}
	/**
	 * Getters and setters (private fields)
	*/
 	//#id
	get id()
	{
		return this.#id;
	}
	set id(newId)
	{
		this.#id = newId;
	}
	//#type
	get type()
	{
		return this.#type;
	}
	set type(newType)
	{
		this.#type = newType;
	}
	/**
	 * Getters and setters (public fields)
	*/
	//name
	get name()
	{
		return this.name;
	}
	set name(newName)
	{
		this.name = newName;
	}
	//description
	get description()
	{
		return this.description;
	}
	set description(newDescription)
	{
		this.description = newDescription;
	}
	//cost
	get cost()
	{
		return this.cost;
	}
	set cost(newCost)
	{
		this.cost = newCost;
	}
}

/*
static class Rarity 
{
	Common = 1;
	Uncommon = 2;
	Rare = 3;
	Epic = 4;
	Legendary = 5;
}

static class EffectTypes 
{
	SetValue = 0;
	Add = 1;
	Multiply = 2;
	Retrigger = 3;
	Special = 4;
}
*/