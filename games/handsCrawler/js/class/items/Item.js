/**
 * Base class for all items, to be extended by different types.
 */
class Item 
{
	//Private fields
	#id = "generic_item_000";
	
	//Public fields
	category = "generic";
	name = "item";
	
	constructor(category, name)
	{
		this.category = category;
		this.name = name;
		this.#id = category + "_" + name + "_" + new Date().getMilliseconds();
	}
	
	get id()
	{
		return this.#id;
	}
}