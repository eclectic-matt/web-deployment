/**
 * Generic class for an item's rarity.
 */
class Rarity
{
	rarityNames = [
		"Common", 
		"Uncommon", 
		"Rare",
		"Mythical",
		"Legendary"
	];
	//Rarity from 1 - 5
	#rarity = 1;
	//One of the above names
	rarityName = "Common";
	//Boost from 1.5 - 3.5
	boost = 1.5;
	
	/**
	 * Create a rarity from the specified index.
	 */
	constructor(rarity = 1)
	{
		rarity = Math.min(Math.max(1, rarity), rarityNames.length);
		this.#rarity = rarity;
		this.rarityName = rarityNames[rarity - 1];
		this.boost = (rarity + 2) / 2;
	}
}