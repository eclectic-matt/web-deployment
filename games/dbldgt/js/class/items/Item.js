/**
 * Base class for all items, to be extended by different types.
 */
class Item
{
	//Private fields
	#id = "generic_item_000";
	#type = "item";
	//Public fields
	name = "item";
	
	constructor(type, name)
	{
		this.#id = category + "_" + name + "_" + new Date().getMilliseconds();
		this.#type = type;
		this.name = name;
	}
	/**
	 * Getters and setters (private fields).
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
	//name
	get name()
	{
		return this.name;
	}
	set name(newName)
	{
		this.name = newName;
	}
}